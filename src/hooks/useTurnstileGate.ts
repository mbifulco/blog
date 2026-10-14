import type {
  TurnstileInstance,
  TurnstileProps,
} from '@marsidev/react-turnstile';
import { useEffect, useRef, useState } from 'react';
import posthog from 'posthog-js';

import { env } from '@utils/env';

// Script-load failures only reach the first widget on the page, so a held
// signup gives up on its own rather than waiting forever.
const TOKEN_WAIT_LIMIT_MS = 8000;

export type TurnstileGateStatus = 'idle' | 'waiting' | 'error';

/**
 * Holds a signup until Cloudflare Turnstile has issued a token, so readers can
 * submit before the background challenge finishes.
 *
 * The server answers a token-less request with a silent fake success, so a
 * form must never send without one: route every send through
 * `submitWhenVerified`.
 */
export const useTurnstileGate = (source?: string) => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const pendingSendRef = useRef<((token: string) => void) | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [status, setStatus] = useState<TurnstileGateStatus>('idle');

  useEffect(
    () => () => {
      if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
      pendingSendRef.current = null;
    },
    []
  );

  const stopWaitTimer = () => {
    if (waitTimerRef.current) clearTimeout(waitTimerRef.current);
    waitTimerRef.current = null;
  };

  const fail = (reason: string) => {
    stopWaitTimer();
    setToken(null);
    setStatus('error');
    posthog.capture('newsletter/turnstile_error', { source, reason });
  };

  const submitWhenVerified = (send: (token: string) => void) => {
    if (token) {
      send(token);
      return;
    }
    pendingSendRef.current = send;
    posthog.capture('newsletter/waiting_for_turnstile', { source });
    if (status === 'error') return;
    setStatus('waiting');
    startWaitTimer();
  };

  const startWaitTimer = () => {
    stopWaitTimer();
    waitTimerRef.current = setTimeout(
      () => fail('token_wait_limit'),
      TOKEN_WAIT_LIMIT_MS
    );
  };

  const retry = () => {
    turnstileRef.current?.reset();
    if (!pendingSendRef.current) {
      setStatus('idle');
      return;
    }
    setStatus('waiting');
    startWaitTimer();
  };

  // Tokens are single-use, so a rejected submission needs a fresh one.
  const resetToken = () => {
    setToken(null);
    turnstileRef.current?.reset();
  };

  const widgetProps = {
    ref: turnstileRef,
    siteKey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    onSuccess: (newToken: string) => {
      stopWaitTimer();
      setToken(newToken);
      setStatus('idle');
      const send = pendingSendRef.current;
      pendingSendRef.current = null;
      send?.(newToken);
    },
    onExpire: () => setToken(null),
    onError: (code: string) => fail(code || 'widget_error'),
    onTimeout: () => fail('challenge_timeout'),
    onUnsupported: () => fail('unsupported_browser'),
    scriptOptions: { onError: () => fail('script_load_failed') },
    options: {
      appearance: 'interaction-only',
      size: 'flexible',
      theme: 'auto',
    },
  } satisfies TurnstileProps & { ref: typeof turnstileRef };

  return { widgetProps, status, submitWhenVerified, retry, resetToken };
};
