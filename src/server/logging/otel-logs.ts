import type { Logger } from '@opentelemetry/api-logs';
import { logs, SeverityNumber } from '@opentelemetry/api-logs';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import { resourceFromAttributes } from '@opentelemetry/resources';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';

import { POSTHOG_LOGS_ENDPOINT } from '@lib/posthog/hosts';

type ConsoleMethod = 'debug' | 'log' | 'info' | 'warn' | 'error';

const BRIDGED_METHODS: ConsoleMethod[] = [
  'debug',
  'log',
  'info',
  'warn',
  'error',
];

// Minimal shape we need from an OTel logger, so tests can pass a fake.
type EmittingLogger = Pick<Logger, 'emit'>;

let provider: LoggerProvider | undefined;
let bridgeInstalled = false;

export function mapConsoleSeverity(method: ConsoleMethod): SeverityNumber {
  switch (method) {
    case 'debug':
      return SeverityNumber.DEBUG;
    case 'warn':
      return SeverityNumber.WARN;
    case 'error':
      return SeverityNumber.ERROR;
    case 'log':
    case 'info':
    default:
      return SeverityNumber.INFO;
  }
}

function stringifyArg(arg: unknown): string {
  if (typeof arg === 'string') return arg;
  if (arg instanceof Error) return `${arg.name}: ${arg.message}`;
  try {
    return JSON.stringify(arg);
  } catch {
    return String(arg);
  }
}

/**
 * Patch console.* so every server-side log is also emitted as an OTel log
 * record. The original console method is always called first, so Vercel's own
 * log capture keeps working. Returns an uninstall function (used by tests).
 */
export function installConsoleBridge(logger: EmittingLogger): () => void {
  const originals = new Map<ConsoleMethod, (...args: unknown[]) => void>();

  for (const method of BRIDGED_METHODS) {
    const original = console[method] as (...args: unknown[]) => void;
    originals.set(method, original);

    console[method] = (...args: unknown[]) => {
      original.apply(console, args);
      try {
        logger.emit({
          severityNumber: mapConsoleSeverity(method),
          severityText: method.toUpperCase(),
          body: args.map(stringifyArg).join(' '),
          attributes: { 'log.source': 'console' },
        });
      } catch {
        // Logging must never break the request path.
      }
    };
  }

  return () => {
    for (const [method, original] of originals) {
      console[method] = original as typeof console.log;
    }
  };
}

/**
 * Stand up the OTLP log pipeline and install the console bridge. Idempotent and
 * a no-op outside the Node.js runtime or when the project token is missing.
 */
export function registerServerLogging(): void {
  if (bridgeInstalled) return;
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  // Only ship logs from production deploys (matches the sourcemap upload gate),
  // so preview/dev console output and dev-only data never reach PostHog Logs.
  if (process.env.VERCEL_ENV !== 'production') return;

  const token = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (!token) return;

  provider = new LoggerProvider({
    resource: resourceFromAttributes({ 'service.name': 'mikebifulco-blog' }),
    processors: [
      new BatchLogRecordProcessor({
        exporter: new OTLPLogExporter({
          url: POSTHOG_LOGS_ENDPOINT,
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }),
      }),
    ],
  });
  logs.setGlobalLoggerProvider(provider);

  installConsoleBridge(provider.getLogger('mikebifulco-blog'));
  bridgeInstalled = true;
}

/**
 * Flush pending log records. Safe to call when logging was never set up.
 * Never throws, so callers can fire it from request teardown paths.
 */
export async function flushLogs(): Promise<void> {
  if (!provider) return;
  try {
    await provider.forceFlush();
  } catch {
    // best-effort on serverless
  }
}
