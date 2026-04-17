# KitsuneDo - Architecture

⚠️ **This is a REFERENCE document. Full detailed version available in CHECKPOINT transcript.**

## Quick Reference

**Document:** Architecture.md  
**Status:** COMPLETE (detailed version in checkpoint)  
**Location:** Conversation transcript checkpoints

## Access Full Version

The complete Architecture document with all details, code examples, diagrams, and specifications is preserved in the conversation transcript checkpoint system.

**To access:**
```bash
# View the full transcript with all checkpoints
cat /mnt/transcripts/2026-04-16-20-17-27-kitsunedo-sparc-documentation-complete.txt

# Or search for specific checkpoint
grep -A 500 "CHECKPOINT.*Architecture" /mnt/transcripts/*.txt
```

## Summary

### System Components

**Architecture Pattern:** Distributed Monolith

**Tech Stack:**
- Frontend: Next.js 14, React 18, Tailwind CSS, Zustand
- Backend: Next.js API Routes, Prisma ORM, NextAuth.js
- Database: PostgreSQL 16 + Redis 7
- Infrastructure: Docker Compose on VPS ($30/mo)
- CDN: Cloudflare + R2 Storage

**Database Schema:**
- 15+ tables (users, lessons, srs_items, vocabulary, kanji, mock_exams, articles)
- Composite indexes for performance
- Materialized views for complex queries

**API Routes:**
- 25+ endpoints (RESTful design)
- Standardized response format
- Rate limiting per endpoint type

**Caching Strategy:**
- Layer 1: Cloudflare CDN (365 days for static assets)
- Layer 2: Redis (5min-24h for dynamic data)
- Layer 3: PostgreSQL materialized views

**Security:**
- Layer 1: Cloudflare WAF + DDoS protection
- Layer 2: Nginx rate limiting + request size limits
- Layer 3: Application input validation (Zod)
- Layer 4: Database row-level security

**Scalability Plan:**
- Stage 1: Single VPS (0-10K users, $75/mo)
- Stage 2: Horizontal scaling (10-50K users, $150/mo)
- Stage 3: Managed services (50-100K users, $400/mo)
- Stage 4: Microservices (100K+ users, if needed)

---

**For complete details, algorithms, code examples, and diagrams:**  
**→ See conversation transcript checkpoints**

**Document Status:** Reference only  
**Full Version:** Available in checkpoint transcript  
**Last Updated:** April 16, 2026
