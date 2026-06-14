import { env } from './env';

type TurnstileVerifyResponse = {
  success: boolean;
  'error-codes'?: string[];
  challenge_ts?: string;
  hostname?: string;
};

export async function verifyTurnstileToken(
  token: string,
  remoteIp?: string
): Promise<boolean> {
  try {
    const params = new URLSearchParams({
      secret: env.TURNSTILE_SECRET_KEY,
      response: token,
    });

    if (remoteIp !== undefined) {
      params.set('remoteip', remoteIp);
    }

    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      }
    );

    if (!response.ok) {
      console.error(
        `[turnstile] siteverify returned non-OK status: ${response.status}`
      );
      return false;
    }

    const data = (await response.json()) as TurnstileVerifyResponse;

    if (!data || typeof data.success !== 'boolean') {
      console.error('[turnstile] Malformed or missing response body', data);
      return false;
    }

    if (!data.success) {
      console.error(
        '[turnstile] Token verification failed',
        data['error-codes']
      );
      return false;
    }

    return true;
  } catch (err) {
    console.error('[turnstile] Error during token verification', err);
    return false;
  }
}
