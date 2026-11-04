const requestCounts = new Map();

// Periodic cleanup of expired rate limit entries every 5 minutes
const cleanupTimer = setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of requestCounts.entries()) {
    if (now > record.resetTime) {
      requestCounts.delete(ip);
    }
  }
}, 5 * 60 * 1000);

if (cleanupTimer.unref) {
  cleanupTimer.unref();
}

/**
 * In-memory sliding window rate limiter for chat endpoints.
 */
export const chatRateLimiter = (maxRequests = 30, windowMs = 60 * 1000) => {
  return (req, res, next) => {
    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "global";
    const now = Date.now();
    const record = requestCounts.get(ip);

    if (!record || now > record.resetTime) {
      requestCounts.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    if (record.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many messages sent. Please wait a moment before sending another message.",
      });
    }

    record.count += 1;
    next();
  };
};

