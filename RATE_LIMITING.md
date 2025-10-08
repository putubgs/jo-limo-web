# Rate Limiting Implementation

## Overview

Rate limiting has been implemented on all login endpoints to prevent brute force attacks and protect user accounts.

## Configuration

- **Window:** 15 minutes
- **Max Attempts:** 5 attempts per window
- **Scope:** Per IP address

## Affected Endpoints

### 1. Admin Login

- **Endpoint:** `POST /api/admin/auth/login`
- **Rate Limit:** 5 attempts per 15 minutes per IP
- **Reset:** Automatic after 15 minutes

### 2. Corporate Mobility Login

- **Endpoint:** `POST /api/corporate-mobility/auth/login`
- **Rate Limit:** 5 attempts per 15 minutes per IP
- **Reset:** Automatic after 15 minutes

## HTTP Response Headers

All login endpoint responses include the following headers:

- `X-RateLimit-Limit`: Maximum number of attempts allowed (5)
- `X-RateLimit-Remaining`: Number of attempts remaining
- `X-RateLimit-Reset`: ISO timestamp when the limit resets (only on 429)
- `Retry-After`: Seconds until the limit resets (only on 429)

## Response Codes

### Success (200 OK)

```json
{
  "success": true,
  "user": {
    "id": "...",
    "email": "...",
    "role": "..."
  }
}
```

### Invalid Credentials (401 Unauthorized)

```json
{
  "error": "Invalid email or password"
}
```

### Rate Limit Exceeded (429 Too Many Requests)

```json
{
  "error": "Too many login attempts. Please try again later.",
  "resetTime": "2025-01-08T12:30:00.000Z"
}
```

## Implementation Details

### Rate Limiter Utility

Located at: `src/utils/rate-limiter.ts`

The rate limiter:

- Tracks attempts in-memory using a Map
- Keys are based on IP address (from `x-forwarded-for` or `x-real-ip` headers)
- Automatically cleans up expired entries
- Thread-safe for concurrent requests

### IP Address Detection

The rate limiter detects the client IP in the following order:

1. `x-forwarded-for` header (first IP)
2. `x-real-ip` header
3. Defaults to "unknown" if neither is present

### Cleanup

- Expired entries are automatically cleaned up periodically
- Cleanup runs on ~1% of requests to minimize performance impact
- Manual cleanup can be triggered if needed

## Testing

### Test Rate Limiting

To test the rate limiting:

1. Make 5 failed login attempts within 15 minutes
2. The 6th attempt should return a 429 status code
3. Wait 15 minutes or until the reset time
4. Attempts should be allowed again

### Reset Rate Limit (Development Only)

```typescript
import { resetRateLimit } from "@/utils/rate-limiter";

// Reset for a specific IP
resetRateLimit("192.168.1.1");
```

## Security Considerations

1. **In-Memory Storage**: Current implementation uses in-memory storage. For production with multiple servers, consider:

   - Redis for distributed rate limiting
   - Database-backed rate limiting
   - Edge middleware (Vercel, Cloudflare)

2. **IP Spoofing**: While the rate limiter uses IP addresses, be aware that:

   - IPs can be spoofed in some environments
   - Multiple users behind NAT share the same IP
   - Consider adding additional factors (user ID, session, etc.)

3. **Account Lockout**: Current implementation doesn't lock accounts. Consider adding:
   - Progressive delays after failed attempts
   - Account lockout after N failed attempts
   - Email notifications on suspicious activity

## Future Enhancements

- [ ] Redis-backed rate limiting for distributed systems
- [ ] Per-user rate limiting in addition to per-IP
- [ ] Progressive delays (exponential backoff)
- [ ] Admin dashboard to view/reset rate limits
- [ ] Logging and alerting for rate limit violations
- [ ] Whitelist/blacklist IP addresses
- [ ] CAPTCHA integration after multiple failures

## Configuration

To adjust rate limiting settings, modify `src/utils/rate-limiter.ts`:

```typescript
const WINDOW_MS = 15 * 60 * 1000; // Window size
const MAX_ATTEMPTS = 5; // Max attempts per window
```

## Monitoring

Monitor rate limiting effectiveness by tracking:

- Number of 429 responses
- Most frequently rate-limited IPs
- Patterns of failed login attempts
- Time of day for rate limit violations

## Support

For questions or issues with rate limiting, contact the development team.
