# /myinsights – Capture Development Insight

Structured insight capture for knowledge base.

## Purpose

Captures technical discoveries, architecture decisions, debugging breakthroughs, and best practices learned during development. Creates markdown file in `docs/insights/` and optionally commits to Git.

## Usage

```bash
# Capture insight with title
/myinsights "Next.js SSR breaks with MeCab tokenization"

# Auto-capture (triggered by Stop hook)
/myinsights --auto

# Capture with category
/myinsights "Redis caching strategy for SRS queue" --category performance
```

## Output Format

Creates file: `docs/insights/YYYY-MM-DD-insight-slug.md`

```markdown
---
date: 2026-04-17
category: [category]
tags: [auto-generated tags]
---

# [Insight Title]

## Context

[What were you working on when you discovered this?]

## Discovery

[What did you learn? What was the breakthrough?]

## Impact

[Why does this matter? How does it affect the project?]

## Implementation

[Code examples, specific changes, or approaches]

## References

[Links to docs, StackOverflow, GitHub issues, etc.]

## Related

[Links to related insights or features]
```

## Examples

### Performance Insight

```markdown
---
date: 2026-04-17
category: performance
tags: [redis, srs, caching]
---

# Redis Caching Strategy for SRS Daily Queue

## Context

Generating daily SRS review queue was taking 2-3 seconds for users with 500+ items. This violated our <200ms API p95 requirement from Specification.md.

## Discovery

The `generateDailyReviewQueue` function in Pseudocode.md was being called on every SRS page load. Each call required:
1. Query all due reviews (SELECT * FROM srs_items WHERE...)
2. Classify into 4 tiers (leeches, overdue, new, regular)
3. Apply prioritization algorithm
4. Shuffle within tiers

For 500 items, this was 500 row scans + in-memory sorting.

## Impact

- API response time: 2,500ms → 50ms (50x improvement)
- User experience: No more loading spinner on SRS page
- Scalability: Supports 10,000+ SRS items per user

## Implementation

Cache the priority queue in Redis with 1-hour TTL:

```typescript
// app/src/lib/srs.ts
export async function getDailyReviewQueue(userId: string) {
  const cacheKey = `srs:queue:${userId}:${format(new Date(), 'yyyy-MM-dd')}`;
  
  // Check Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    return JSON.parse(cached);
  }
  
  // Generate queue (expensive operation)
  const queue = await generateDailyReviewQueue(userId);
  
  // Cache for 1 hour
  await redis.setex(cacheKey, 3600, JSON.stringify(queue));
  
  return queue;
}
```

Invalidate cache when:
- User completes a review → `redis.del(cacheKey)`
- User changes daily cap settings → `redis.del(cacheKey)`
- User enables vacation mode → `redis.del(cacheKey)`

## References

- [Redis SETEX documentation](https://redis.io/commands/setex)
- Architecture.md – Caching Strategy (Layer 2)
- Pseudocode.md – `generateDailyReviewQueue` function

## Related

- `docs/insights/2026-04-15-postgresql-indexes-for-srs-queries.md`
```

### Bug Fix Insight

```markdown
---
date: 2026-04-17
category: bug-fix
tags: [authentication, race-condition, redis]
---

# Authentication Rate Limiting Bypass via Race Condition

## Context

Security testing revealed that concurrent login requests could bypass the 5-attempt/15-minute rate limit defined in Specification.md security requirements.

## Discovery

The rate limiting check in `loginUser` (Pseudocode.md) had a race condition:

```typescript
// VULNERABLE CODE
const attempts = await redis.get(`login_attempts:${email}`);
if (attempts >= 5) {
  return { error: "Too many attempts" };
}
// ... validate password ...
await redis.incr(`login_attempts:${email}`); // ← Race condition here
```

If 10 requests arrived simultaneously:
1. All 10 read `attempts = 0`
2. All 10 pass the `< 5` check
3. All 10 execute, then increment

Result: 10 attempts executed when limit is 5.

## Impact

- Security vulnerability: Brute force attacks not properly throttled
- OWASP: Broken Authentication (A07:2021)
- Violates Specification.md: "5 attempts per 15 minutes"

## Implementation

Use Redis WATCH for atomic increment:

```typescript
// FIXED CODE
import { redis } from '@/lib/redis';

export async function checkRateLimit(key: string, limit: number, windowSeconds: number): Promise<boolean> {
  const multi = redis.multi();
  
  multi.incr(key);
  multi.expire(key, windowSeconds);
  
  const results = await multi.exec();
  const attempts = results[0][1] as number;
  
  return attempts <= limit;
}

// Usage in loginUser
const allowed = await checkRateLimit(
  `login_attempts:${email}`,
  5,   // limit
  900  // 15 minutes
);

if (!allowed) {
  return { error: "Too many login attempts. Try again in 15 minutes." };
}
```

Redis `INCR` is atomic, so no race condition.

## References

- [Redis INCR atomicity](https://redis.io/commands/incr)
- [OWASP A07:2021 – Identification and Authentication Failures](https://owasp.org/Top10/A07_2021-Identification_and_Authentication_Failures/)
- Pseudocode.md – `loginUser` function
- Specification.md – Security Requirements

## Related

- `docs/insights/2026-04-10-bcrypt-cost-factor-benchmarking.md`
```

## Integration with Stop Hook

Configure in `.claude/settings.json`:

```json
{
  "hooks": {
    "stop": {
      "enabled": true,
      "commands": ["/myinsights --auto"]
    }
  }
}
```

When user clicks Stop:
1. Claude prompts: "Would you like to capture any insights from this session?"
2. User confirms → Claude generates insight markdown
3. Insight committed to Git with message: `docs: add insight on [title]`

## Best Practices

### When to Capture

**DO capture:**
- Technical discoveries (performance optimization, library quirks)
- Architecture decisions (why we chose X over Y)
- Complex bug root causes
- Security vulnerabilities found and fixed
- Unexpected behavior in external libraries
- Best practices learned from trial and error

**DON'T capture:**
- Routine feature implementations (use commit messages instead)
- Obvious information (e.g., "Next.js uses React")
- Personal notes or TODOs (use issue tracker)
- Sensitive information (API keys, passwords, PII)

### Writing Good Insights

1. **Be specific:** Include code examples, not just descriptions
2. **Explain why:** Don't just say what you did, explain why it matters
3. **Add references:** Link to docs, issues, or related insights
4. **Make it searchable:** Use clear tags and categories

### Categories

- `performance` – Optimization, caching, profiling
- `bug-fix` – Root cause analysis of bugs
- `architecture` – Design decisions, refactoring
- `security` – Vulnerabilities, mitigations
- `debugging` – Debugging techniques, tools
- `library` – External library quirks, workarounds
- `deployment` – CI/CD, infrastructure, Docker
- `testing` – Test strategies, coverage improvements

## Troubleshooting

**Issue:** Insight not captured  
**Solution:** Ensure `docs/insights/` directory exists: `mkdir -p docs/insights`

**Issue:** Git commit fails  
**Solution:** Check Git status: `git status`. Commit manually if needed.

**Issue:** Stop hook not triggering  
**Solution:** Verify `.claude/settings.json` has `hooks.stop.enabled: true`
