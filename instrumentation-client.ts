import { initBotId } from 'botid/client/core';

// Initialize BotID protection for client-side routes
// Add routes here that you want to protect from bot traffic
initBotId({
  protect: [
    // Protect tRPC endpoints from automated abuse
    { path: '/api/trpc/*', method: 'POST' },

    // Protect form submissions
    { path: '/subscribe', method: 'POST' },
  ],
});
