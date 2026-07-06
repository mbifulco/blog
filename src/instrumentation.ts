import { registerServerLogging } from '@server/logging/otel-logs';

export function register() {
  registerServerLogging();
}
