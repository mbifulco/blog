interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute

export function rateLimit(ip: string): { success: boolean; remaining: number } {
  const now = Date.now();
  const windowKey = `${ip}`;
  const window = store[windowKey];

  if (!window) {
    store[windowKey] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (now > window.resetTime) {
    store[windowKey] = {
      count: 1,
      resetTime: now + WINDOW_MS,
    };
    return { success: true, remaining: MAX_REQUESTS - 1 };
  }

  if (window.count >= MAX_REQUESTS) {
    return { success: false, remaining: 0 };
  }

  window.count += 1;
  return { success: true, remaining: MAX_REQUESTS - window.count };
}

// Clean up expired entries every minute
setInterval(() => {
  const now = Date.now();
  Object.keys(store).forEach((key) => {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  });
}, WINDOW_MS);
