import { rateLimit } from "express-rate-limit";

export const aiRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute

  max: 20, // 20 requests per minute

  standardHeaders: true,

  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many AI requests. Please try again in a minute.",
  },
});