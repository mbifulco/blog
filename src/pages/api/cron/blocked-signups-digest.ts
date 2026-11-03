import type { NextApiRequest, NextApiResponse } from 'next';
import { easternDateKey } from '@server/blockedSignups';

import { sendBlockedSignupsDigest } from '@utils/email/sendBlockedSignupsDigest';
import { env } from '@utils/env';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (
    !env.CRON_SECRET ||
    req.headers.authorization !== `Bearer ${env.CRON_SECRET}`
  ) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // The cron fires at 13:00 UTC, so 24 hours back is always the previous Eastern day.
  const dateKey = easternDateKey(new Date(Date.now() - 86_400_000));

  try {
    const result = await sendBlockedSignupsDigest(dateKey);
    if (result.count > 0 && !result.sent) {
      return res.status(502).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error sending blocked signups digest:', error);
    return res.status(500).json({ error: 'Digest failed' });
  }
}
