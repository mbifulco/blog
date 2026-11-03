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
 * submit before the challenge finishes. The challenge starts on `start()`
 * (first field focus) or on submit, never on page load, and failures stay
 * hidden until the reader has submitted.
 *
 * The server answers a token-less request with a silent fake success, so a
 * form must never send without one: route every send through
 * `submitWhenVerified`.
 */
export const useTurnstileGate = (
  source?: string,
  options?: { onSubmitFailed?: (reason: string) => void }
) => {
  const turnstileRef = useRef<TurnstileInstance>(null);
  const pendingSendRef = useRef<((token: string) => void) | null>(null);
  const waitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startedRef = useRef(false);
  const widgetReadyRef = useRef(false);
  const submittedRef = useRef(false);
  const failedBeforeSubmitRef = useRef(false);
  const inErrorRef = useRef(false);
  const interactiveRef = useRef(false);
  const loggedRef = useRef({ before: false, after: false });
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

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    // execute() is a no-op until the widget renders; onWidgetLoad picks it up.
    if (widgetReadyRef.current) turnstileRef.current?.execute();
  };

  const fail = (reason: string) => {
    stopWaitTimer();
    interactiveRef.current = false;
    setToken(null);
    const afterSubmit = submittedRef.current;
    if (!afterSubmit) failedBeforeSubmitRef.current = true;
    const logKey = afterSubmit ? 'after' : 'before';
    if (!loggedRef.current[logKey]) {
      loggedRef.current[logKey] = true;
      posthog.capture('newsletter/turnstile_error', {
        source,
        reason,
        after_submit: afterSubmit,
      });
    }
    if (!afterSubmit || inErrorRef.current) return;
    inErrorRef.current = true;
    setStatus('error');
    options?.onSubmitFailed?.(reason);
  };

  const startWaitTimer = () => {
    stopWaitTimer();
    if (interactiveRef.current) return;
    waitTimerRef.current = setTimeout(
      () => fail('token_wait_limit'),
      TOKEN_WAIT_LIMIT_MS
    );
  };

  const submitWhenVerified = (send: (token: string) => void) => {
    if (token) {
      send(token);
      return;
    }
    pendingSendRef.current = send;
    posthog.capture('newsletter/waiting_for_turnstile', { source });
    submittedRef.current = true;
    if (failedBeforeSubmitRef.current) {
      failedBeforeSubmitRef.current = false;
      turnstileRef.current?.reset();
      startedRef.current = false;
    } else if (inErrorRef.current) {
      return;
    }
    setStatus('waiting');
    startWaitTimer();
    start();
  };

  const retry = () => {
    inErrorRef.current = false;
    turnstileRef.current?.reset();
    startedRef.current = false;
    if (!pendingSendRef.current) {
      setStatus('idle');
      return;
    }
    setStatus('waiting');
    startWaitTimer();
    start();
  };

  // Tokens are single-use, so a rejected submission needs a fresh one.
  const resetToken = () => {
    setToken(null);
    turnstileRef.current?.reset();
    startedRef.current = false;
  };

  const widgetProps = {
    ref: turnstileRef,
    siteKey: env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
    onSuccess: (newToken: string) => {
      stopWaitTimer();
      interactiveRef.current = false;
      inErrorRef.current = false;
      failedBeforeSubmitRef.current = false;
      setToken(newToken);
      setStatus('idle');
      const send = pendingSendRef.current;
      pendingSendRef.current = null;
      send?.(newToken);
    },
    onWidgetLoad: () => {
      widgetReadyRef.current = true;
      if (startedRef.current) turnstileRef.current?.execute();
    },
    onExpire: () => {
      setToken(null);
      startedRef.current = false;
    },
    onError: (code: string) => fail(code || 'widget_error'),
    onTimeout: () => fail('challenge_timeout'),
    onUnsupported: () => fail('unsupported_browser'),
    onBeforeInteractive: () => {
      interactiveRef.current = true;
      stopWaitTimer();
    },
    onAfterInteractive: () => {
      interactiveRef.current = false;
      if (pendingSendRef.current && !inErrorRef.current) startWaitTimer();
    },
    scriptOptions: { onError: () => fail('script_load_failed') },
    options: {
      appearance: 'interaction-only',
      execution: 'execute',
      size: 'flexible',
      theme: 'auto',
    },
  } satisfies TurnstileProps & { ref: typeof turnstileRef };

  return {
    widgetProps,
    status,
    start,
    submitWhenVerified,
    retry,
    resetToken,
  };
};
