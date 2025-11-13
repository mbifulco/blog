import { initBotId } from 'botid/client/core';

// Initialize BotID protection for client-side routes
// Add routes here that you want to protect from bot traffic
initBotId({
  protect: [
    // Example: Protect webhook endpoints
    { path: '/api/inbound_webhooks/resend', method: 'POST' },

    // Example: Protect tRPC endpoints (if needed)
    { path: '/api/trpc/*', method: 'POST' },

    // Example: Protect form submissions
    { path: '/subscribe', method: 'POST' },
  ],
});
