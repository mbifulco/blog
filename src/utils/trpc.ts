// Universal tRPC client exports for both Pages Router and App Router
import { trpcNext, trpcReact } from '../lib/trpc';

// Export both clients - components can import the one they need
export const trpc = trpcReact; // Default to React client (works in both contexts when properly wrapped)
export const trpcPages = trpcNext; // Pages Router specific (for withTRPC HOC)
