# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository State

This is a **pre-development planning repository**. No application code exists yet. The repo contains SPARC documentation and a Claude Code toolkit ready to bootstrap the project.

Key directories:
- `kitsunedo-cc-toolkit/` — Claude Code configuration to copy into the app project
- `*.md` — SPARC planning documents (PRD, Architecture, Pseudocode, Specification, etc.)

The actual app is bootstrapped by running `/init` after installing the toolkit (see below).

## Project: KitsuneDo

Japanese + Korean language learning platform (N5→N2 / TOPIK 1-4). Freemium model: free tier covers full curriculum + basic SRS; Premium ($6.99/mo) adds JLPT mocks, real content reader, speaking practice. Break-even at Month 10 (6K users, 900 paying).

## Getting Started (First Time)

```bash
# 1. Copy Claude Code toolkit into your app project
cp -r kitsunedo-cc-toolkit/.claude ~/projects/kitsunedo/

# 2. Open Claude Code from app project root
cd ~/projects/kitsunedo
claude

# 3. Bootstrap the full project structure
/init
```

`/init` generates: Next.js app, Prisma schema, Docker Compose (dev + prod), Nginx config, GitHub Actions CI/CD pipeline.

## Development Workflow

```bash
# Start local dev (after /init)
docker-compose up

# Implement a feature (triggers PRD → validation → code → review)
/feature "Hiragana stroke order practice"

# Deploy to production
/deploy prod

# Rollback
/rollback
```

Every `/feature` run auto-generates docs in `docs/features/<name>/` and is blocked if requirement validation scores below 50/100.

## Tech Stack

- **Frontend:** Next.js 14, React 18, Tailwind CSS, Zustand
- **Backend:** Next.js API Routes, Prisma ORM, NextAuth.js
- **Database:** PostgreSQL 16 + Redis 7
- **Infrastructure:** Docker Compose on VPS (~$75/mo fixed), Cloudflare CDN + R2

## Architecture

Pattern: Distributed Monolith. All services in Docker Compose.

App structure after `/init`:
```
kitsunedo/
├── app/src/app/          # Next.js 14 App Router
│   ├── (auth)/           # login, register
│   ├── lessons/[id]/
│   ├── srs/
│   ├── exams/
│   ├── content/
│   └── api/              # lessons, srs, auth, exams, health
├── app/src/components/   # ui/ (shadcn), lessons/, srs/, layout/
├── app/src/lib/          # prisma.ts, redis.ts, auth.ts, utils.ts
├── app/prisma/           # schema.prisma, migrations/, seed.ts
├── nginx/
└── .github/workflows/    # deploy.yml (GitHub Actions)
```

**Database** (15 core tables): `users`, `user_settings`, `user_subscriptions`, `lessons`, `lesson_sections`, `vocabulary`, `grammar_points`, `exercises`, `srs_items`, `user_lesson_access`, `user_progress`, `mock_exams`, `exam_questions`, `exam_results`, `articles`.

**Caching layers:** Cloudflare CDN (static, 365d) → Redis (dynamic, 5min–24h) → PostgreSQL materialized views.

**API rate limits:** 5 auth attempts / 15min, 100 API calls / 1min (enforced at Nginx layer).

## Core Algorithms (see Pseudocode.md for signatures)

1. **SRS** — SM-2 modified with user-controlled daily cap, 4-tier prioritization (leeches → overdue → new → regular), vacation mode with timer pause
2. **JLPT Scoring** — confidence-weighted score prediction with gap analysis per section (listening weighted 1.3×)
3. **Real Content Reader** — kuromoji.js tokenization + click-to-define + SRS save integration
4. **Lesson Progression** — auto-unlock on section completion, sequence gating per JLPT level

## Key Constraints

- TypeScript strict mode — no `any` types
- bcrypt cost ≥ 12 for password hashing
- All API inputs validated with Zod schemas
- Semantic commits: `feat(scope): subject`, `fix(scope): subject`, etc.
- Stop hook auto-captures dev insights via `/myinsights --auto`

## Validated User Stories

All 7 stories scored 86–100/100 (INVEST + SMART criteria). None are blocked. Full Gherkin scenarios in `Specification.md` checkpoint transcript.
