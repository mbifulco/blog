import { env } from '../env';
import { resend } from '../resend';

type BroadcastParams = {
  slug: string;
  subject: string;
  html: string;
  from: string;
  disableClickTracking?: boolean; // Disable click tracking to preserve sponsor URLs
};

/**
 * Finds an existing broadcast by name (slug).
 * Returns the broadcast ID if found, null otherwise.
 */
export async function findBroadcastByName(
  slug: string
): Promise<string | null> {
  try {
    const response = await resend.broadcasts.list();

    if (response.error) {
      console.error('Error listing broadcasts:', response.error);
      return null;
    }

    if (!response.data) {
      return null;
    }

    // Find broadcast where name matches the slug
    const broadcast = response.data.data.find(
      (b) => b.name === slug && b.status === 'draft'
    );

    return broadcast?.id || null;
  } catch (error) {
    console.error('Error finding broadcast:', error);
    return null;
  }
}

/**
 * Creates a new draft broadcast in Resend.
 */
export async function createBroadcast(params: BroadcastParams) {
  try {
    const response = await resend.broadcasts.create({
      name: params.slug, // Use slug as unique identifier
      subject: params.subject,
      from: params.from,
      html: params.html,
      audienceId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      // Conditionally disable click tracking to preserve sponsor tracking URLs
      ...(params.disableClickTracking && {
        tracking: {
          click: false,
        },
      }),
    });

    if (response.error) {
      throw new Error(`${response.error.name}: ${response.error.message}`);
    }

    return response;
  } catch (error) {
    console.error('Error creating broadcast:', error);
    throw error;
  }
}

/**
 * Updates an existing draft broadcast in Resend.
 */
export async function updateBroadcast(
  broadcastId: string,
  params: BroadcastParams
) {
  try {
    const response = await resend.broadcasts.update(broadcastId, {
      name: params.slug,
      subject: params.subject,
      from: params.from,
      html: params.html,
      segmentId: env.RESEND_NEWSLETTER_AUDIENCE_ID,
      // Conditionally disable click tracking to preserve sponsor tracking URLs
      ...(params.disableClickTracking && {
        tracking: {
          click: false,
        },
      }),
    });

    if (response.error) {
      throw new Error(`${response.error.name}: ${response.error.message}`);
    }

    return response;
  } catch (error) {
    console.error('Error updating broadcast:', error);
    throw error;
  }
}

/**
 * Creates or updates a broadcast (upsert operation).
 * Searches for existing broadcast by slug, updates if found, creates if not.
 * Handles "already sent" errors gracefully.
 */
export async function upsertBroadcast(params: BroadcastParams) {
  try {
    // Try to find existing broadcast
    const existingBroadcastId = await findBroadcastByName(params.slug);

    if (existingBroadcastId) {
      console.log(
        `[${params.slug}] Updating existing broadcast: ${existingBroadcastId}`
      );
      return await updateBroadcast(existingBroadcastId, params);
    }

    console.log(`[${params.slug}] Creating new broadcast`);
    return await createBroadcast(params);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);

    // Handle "already sent" error gracefully
    if (
      errorMessage.includes('already sent') ||
      errorMessage.includes('cannot update')
    ) {
      console.warn(`[${params.slug}] Broadcast already sent, skipping update`);
      return {
        data: null,
        error: {
          name: 'already_sent',
          message: 'Broadcast has already been sent and cannot be updated',
        },
      };
    }

    throw error;
  }
}
