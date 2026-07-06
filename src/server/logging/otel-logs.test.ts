import { SeverityNumber } from '@opentelemetry/api-logs';
import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  flushLogs,
  installConsoleBridge,
  mapConsoleSeverity,
} from './otel-logs';

describe('mapConsoleSeverity', () => {
  it('maps console methods to OTel severities', () => {
    expect(mapConsoleSeverity('debug')).toBe(SeverityNumber.DEBUG);
    expect(mapConsoleSeverity('log')).toBe(SeverityNumber.INFO);
    expect(mapConsoleSeverity('info')).toBe(SeverityNumber.INFO);
    expect(mapConsoleSeverity('warn')).toBe(SeverityNumber.WARN);
    expect(mapConsoleSeverity('error')).toBe(SeverityNumber.ERROR);
  });
});

describe('installConsoleBridge', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('preserves original console output and emits a log record', () => {
    const emit = vi.fn();
    const fakeLogger = { emit };
    const original = vi.spyOn(console, 'error').mockImplementation(() => {});

    const uninstall = installConsoleBridge(fakeLogger);
    try {
      console.error('boom', { code: 500 });

      // original console.error still called
      expect(original).toHaveBeenCalledWith('boom', { code: 500 });
      // and a record was emitted with ERROR severity + a string body
      expect(emit).toHaveBeenCalledTimes(1);
      const record = emit.mock.calls[0][0];
      expect(record.severityNumber).toBe(SeverityNumber.ERROR);
      expect(typeof record.body).toBe('string');
      expect(record.body).toContain('boom');
    } finally {
      // Guarantee console is restored even if an assertion above throws, so a
      // failure here cannot leak patched console methods into other tests.
      uninstall();
    }
  });

  it('restores console methods on uninstall', () => {
    const before = console.error;
    const uninstall = installConsoleBridge({ emit: vi.fn() });
    try {
      expect(console.error).not.toBe(before);
    } finally {
      uninstall();
    }
    expect(console.error).toBe(before);
  });
});

describe('flushLogs', () => {
  it('resolves without throwing when no provider exists', async () => {
    await expect(flushLogs()).resolves.toBeUndefined();
  });
});
