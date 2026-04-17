# KitsuneDo - Product Requirements Document

## Product Vision

"Learn Japanese and Korean the way you actually acquire languages — systematically, deeply, and joyfully. One beautiful app replaces your entire learning stack."

## Problem Statement

Language learners face 7 critical pain points validated through 500+ user reviews:

1. **Shallow Learning** - Apps don't teach actual proficiency (Duolingo: complete course but can't watch K-drama)
2. **No Grammar Explanations** - Implicit learning fails for Asian languages (Bunpro links to external sites)
3. **App Fragmentation** - Need 4+ apps at $14-24/mo (Duolingo + WaniKani + Bunpro + HelloTalk)
4. **SRS Burnout** - Review avalanches (WaniKani: 400-500 reviews waiting)
5. **Poor Design** - Ugly/overwhelming interfaces (Renshuu: "2004 AOL threw up")
6. **Artificial Content** - No real practice ("turtle eats lettuce" vs actual news)
7. **Fake Progress** - XP/streaks ≠ proficiency (users complete Duolingo but know nothing)

## Target Users

See detailed personas in **Research_Findings.md**.

**Primary Segments:**
- Media Consumers (40%) - Watch anime/K-drama without subtitles
- Career Builders (30%) - Pass JLPT N2 for work/visa
- Culture Enthusiasts (20%) - Deep cultural understanding
- Academic Learners (10%) - Supplement classroom

## Product Strategy

### Freemium Model

**Free Tier (80% of value):**
- Complete N5→N2 Japanese + TOPIK 1-4 Korean curriculum
- In-app grammar explanations
- Systematic kanji/hangul teaching
- Basic SRS with flexible caps
- Native audio, community forums

**Premium Tier ($6.99/mo or $59.99/yr):**
- JLPT/TOPIK mock exams (official format, score prediction)
- Real Content Reader (NHK Easy, Naver with click-to-define)
- Speaking practice (record + compare)
- Writing checker (community-powered)
- Advanced SRS analytics
- Offline mode, ad-free

**Lifetime ($199):**
- All Premium features forever
- All future content

### Pricing Rationale
- $6.99/mo = 46% cheaper than Duolingo ($12.99)
- Complete solution vs fragmented stack (WaniKani $9 + Bunpro $5 = $14)
- Target 15% conversion (above industry 5-10%)

## Key Features (MVP)

Detailed specifications in **Specification.md**.

### Epic 1: Free Tier - Core Learning
1. Hiragana/Katakana with stroke order
2. Structured lessons (Minna no Nihongo-inspired)
3. In-app grammar explanations
4. Flexible SRS system
5. Native audio
6. Community forums

### Epic 2: Premium - Exam Prep
1. JLPT mock exams with score prediction
2. Real Content Reader
3. Speaking/writing practice
4. Advanced analytics

### Epic 3: Design & UX
1. Ghost of Yotei aesthetic (warm, cultural)
2. Mobile-responsive
3. Progressive disclosure (simple → complex)

## Technical Requirements

See **Architecture.md** for full technical design.

**Stack:**
- Frontend: Next.js 14, React 18, Tailwind CSS
- Backend: Next.js API Routes, Prisma, NextAuth.js
- Database: PostgreSQL 16 + Redis 7
- Infrastructure: Docker Compose on VPS ($30/mo)
- CDN: Cloudflare + R2 Storage

**Non-Functional Requirements:**
- Performance: <200ms API p95, <3s page load
- Availability: 99.9% uptime
- Security: bcrypt passwords, rate limiting, HTTPS
- Scalability: 0-100K users on current architecture

## Success Metrics

**Financial:**
- Break-even: Month 10 (6K users, 900 paying, $7.5K MRR)
- Year 1: 10K users, 1.5K paying, $10K MRR
- Net Year 1: -$107K investment
- Net Year 2: +$160K profit

**Product:**
- DAU/MAU >40%
- Lesson completion >70%
- Premium conversion 15%
- NPS >40
- JLPT pass rate >60%

**North Star:** Users Who Achieve Real Language Proficiency

## Roadmap

**Phase 1 (M1-6):** Japanese N5-N2 MVP
**Phase 2 (M7-12):** Korean TOPIK 1-4
**Phase 3 (Y2 M13-18):** Real Content Reader, N1, TOPIK 5-6
**Phase 4 (Y2 M19-24):** AI features (if profitable)

## Go-to-Market

**Organic-First:**
- Reddit launch (r/LearnJapanese, r/Korean)
- SEO content (50 blog posts)
- YouTube partnerships (Dogen, Matt vs Japan)

**Paid Ads (Month 10+ after PMF):**
- Google Ads ($2K/mo)
- Reddit Ads ($500/mo)

Target CAC: $10 organic, $50-70 paid

## Risks & Mitigations

| Risk | Probability | Mitigation |
|------|------------|------------|
| Low conversion | Medium | Gate JLPT mocks, 7-day trial |
| Dev delay | Low | Launch N5 only, add progressively |
| Competitor reaction | Medium | 12-month head start, moats |
| Expensive CAC | Low | Organic-first strategy |

## Dependencies

- Content creation: JLPT/TOPIK questions, audio recordings
- Design: Ghost of Yotei aesthetic guidelines
- Infrastructure: VPS provider account
- Payment: Stripe account setup

## Open Questions

None - all resolved through Product Discovery phase.

---

**Document Version:** 1.0  
**Last Updated:** April 2026  
**Status:** Ready for Development
