import { NextRequest } from "next/server";

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
const rateLimitStore = new Map<string, RateLimitEntry>();

// Configuration
// const WINDOW_MS = 15 * 60 * 1000; // production
const WINDOW_MS = 10 * 1000; // testing
const MAX_ATTEMPTS = 5; // Maximum 5 attempts per window

/**
 * Rate limiter for login endpoints
 * Limits requests based on IP address
 */
export function checkRateLimit(request: NextRequest): {
  allowed: boolean;
  remaining: number;
  resetTime: number;
} {
  // Get client IP address
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0] ||
    request.headers.get("x-real-ip") ||
    "unknown";

  const now = Date.now();
  const key = `login:${ip}`;

  // Clean up expired entries periodically (every 100 requests)
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  // Get or create rate limit entry
  let entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    entry = {
      count: 0,
      resetTime: now + WINDOW_MS,
    };
  }

  // Increment attempt count
  entry.count++;
  rateLimitStore.set(key, entry);

  const allowed = entry.count <= MAX_ATTEMPTS;
  const remaining = Math.max(0, MAX_ATTEMPTS - entry.count);

  return {
    allowed,
    remaining,
    resetTime: entry.resetTime,
  };
}

/**
 * Clean up expired entries from the rate limit store
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  const keysToDelete: string[] = [];

  rateLimitStore.forEach((entry, key) => {
    if (now > entry.resetTime) {
      keysToDelete.push(key);
    }
  });

  keysToDelete.forEach((key) => {
    rateLimitStore.delete(key);
  });
}

/**
 * Reset rate limit for a specific IP (useful for testing or manual reset)
 */
export function resetRateLimit(ip: string) {
  const key = `login:${ip}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status for an IP
 */
export function getRateLimitStatus(ip: string): RateLimitEntry | null {
  const key = `login:${ip}`;
  return rateLimitStore.get(key) || null;
}
