# KitsuneDo – Claude Code Integration Guide

**Japanese + Korean Language Learning Platform**  
N5→N2 systematic curriculum • Freemium model • VPS deployment

---

## 🎯 Quick Start

```bash
# Initialize project structure
/init

# Start development with feature lifecycle
/feature "Hiragana stroke order practice"

# Deploy to production
/deploy prod

# View logs
/logs app --follow
```

---

## 📋 Product Overview

**Problem:** Language learners juggle 4+ apps ($14-24/mo), face grammar confusion, SRS burnout, and artificial content.

**Solution:** ONE beautiful app with textbook-quality Japanese (N5-N2) + Korean (TOPIK 1-4), in-app grammar, flexible SRS, real content reader.

**Target Users:**
- Media Consumers (40%): Watch anime/K-drama without subtitles
- Career Builders (30%): Pass JLPT N2, work in Japan/Korea
- Culture Enthusiasts (20%): Deep cultural understanding
- Academic Learners (10%): Supplement classroom

**Financial Model:**
- Free Tier: Full N5-N2 curriculum + basic SRS (80% of features)
- Premium ($6.99/mo): JLPT mocks, real content reader, speaking practice
- Break-even: Month 10 (6,000 users, 900 paying)
- Year 2: +$160K profit

---

## 🏗️ Architecture

**Pattern:** Distributed Monolith (Docker Compose)

**Tech Stack:**
- Frontend: Next.js 14, React 18, Tailwind CSS, Zustand
- Backend: Next.js API Routes, Prisma ORM
- Database: PostgreSQL 16 + Redis 7
- Infrastructure: VPS (AdminVPS/HOSTKEY), Docker Compose
- CDN: Cloudflare + R2 Storage

**Infrastructure Costs:** $75/mo fixed
- VPS: $30/mo (4 CPU, 8GB RAM)
- Cloudflare CDN: $20/mo
- Cloudflare R2: $5/mo (audio storage)
- Email/Analytics: $15/mo
- Domain + SSL: $5/mo

**Database Schema:** 15+ tables
- users, lessons, srs_items, vocabulary, kanji, grammar_points
- mock_exams, articles, user_progress, subscriptions

**API Routes:** 25+ endpoints (RESTful design)
- `/api/lessons/*` – Curriculum management
- `/api/srs/*` – Spaced repetition system
- `/api/auth/*` – Authentication (NextAuth.js)
- `/api/exams/*` – JLPT mock exams
- `/api/content/*` – Real content reader

**Caching Strategy:**
- Layer 1: Cloudflare CDN (365 days for static assets)
- Layer 2: Redis (5min-24h for dynamic data)
- Layer 3: PostgreSQL materialized views

**Security:**
- Layer 1: Cloudflare WAF + DDoS protection
- Layer 2: Nginx rate limiting (5 auth/15min, 100 API/1min)
- Layer 3: Application input validation (Zod schemas)
- Layer 4: Database row-level security

**Scalability Plan:**
- Stage 1: Single VPS (0-10K users, $75/mo)
- Stage 2: Horizontal scaling (10-50K users, $100/mo)
- Stage 3: Managed services (50K+ users, $400/mo)

---

## 🛠️ Development Workflow

### Phase 1: Project Bootstrap (Month 1)

```bash
# Initialize full project structure
/init

# Creates:
# ├── app/ (Next.js)
# │   ├── src/
# │   │   ├── app/ (routes)
# │   │   ├── components/
# │   │   ├── lib/
# │   │   └── types/
# │   ├── prisma/ (schema)
# │   └── Dockerfile
# ├── docker-compose.yml
# ├── docker-compose.prod.yml
# └── nginx/
```

### Phase 2: Feature Development (Months 1-6)

Use `/feature` command for structured feature lifecycle:

```bash
# Start new feature
/feature "SRS daily review queue with smart prioritization"

# Triggers:
# 1. sparc-prd-manual skill (generates PRD, SPARC, specs)
# 2. requirements-validator skill (validates user stories)
# 3. Implementation phase (code generation)
# 4. brutal-honesty-review skill (post-review)

# Outputs:
# ├── docs/features/srs-daily-review-queue/
# │   ├── PRD.md
# │   ├── Solution_Strategy.md
# │   ├── Specification.md
# │   ├── Pseudocode.md
# │   └── Architecture.md
# └── Code changes in app/

# Feature workflow:
# /feature "X" → PRD auto-generated → Implement → Review
```

### Phase 3: Deployment (Month 3+)

```bash
# Deploy to production
/deploy prod

# CI/CD Pipeline:
# 1. Run tests (npm run test)
# 2. Build Docker images
# 3. SSH to VPS
# 4. Zero-downtime deployment (docker-compose up -d)
# 5. Health check (curl /api/health)
# 6. Slack notification

# Rollback if needed
/rollback           # to previous version
/rollback v1.2.3    # to specific version
```

---

## 🤖 Swarm Agents

### Planner Agent
**Role:** Feature planning with algorithm templates from Pseudocode  
**Triggers:** `/plan`, `/feature` command, "plan the implementation"

**Knowledge Base:**
- SRS algorithm (SM-2 with daily caps)
- JLPT score prediction algorithm
- Click-to-define annotation system
- Lesson progression logic
- Authentication flows

**Example:**
```bash
User: Plan the implementation of flexible SRS system
Planner: [reads Pseudocode.md] → Creates task breakdown:
1. Implement SM-2 algorithm (calculateNextReview)
2. Build prioritization queue (4 tiers: leeches, overdue, new, regular)
3. Add vacation mode (pause timers)
4. Grace period logic (3-day window)
```

### Code Reviewer Agent
**Role:** Quality review with edge-case awareness from Refinement  
**Triggers:** `/review`, post-implementation, "review this code"

**Knowledge Base:**
- Edge cases: Leap year dates, Unicode handling, concurrent users
- Security patterns: Rate limiting, input validation, auth flows
- Performance requirements: <200ms API p95, <3s page load

**Example:**
```bash
User: Review SRS scheduling code
Code Reviewer: Checks against Refinement.md edge cases:
✓ Handles timezone changes correctly
✗ Missing validation: dailyCap must be 10-500
✗ Race condition: Multiple tab SRS reviews
→ Suggests fixes with specific code examples
```

### Architect Agent
**Role:** System design awareness from Architecture + Solution_Strategy  
**Triggers:** "architecture question", "scaling", "how should we structure X"

**Knowledge Base:**
- Docker Compose orchestration
- VPS deployment patterns
- Zero-downtime deployment strategy
- Caching layers (Cloudflare, Redis, PostgreSQL)
- Scalability stages (1 VPS → Load Balancer → Managed Services)

**Example:**
```bash
User: How should we handle 10K concurrent users?
Architect: Based on Architecture.md scaling plan:
- Current: Single VPS handles 10K (you're at capacity)
- Recommendation: Add load balancer + 2nd VPS ($100/mo total)
- Implementation: docker-compose.prod.yml with replicas: 2
→ Provides specific Docker config + Nginx setup
```

---

## 📝 Commands Reference

### `/init` – Project Bootstrap ⭐ MANDATORY
Full project generation from SPARC documentation.

**What it does:**
- Phase 1: Create monorepo structure (Next.js app, Docker configs)
- Phase 2: Generate Prisma schema from Specification.md data model
- Phase 3: Setup Docker Compose (app, db, redis, nginx)
- Phase 4: CI/CD pipeline (.github/workflows/deploy.yml)

**Usage:**
```bash
/init
# No parameters needed – reads from SPARC docs
```

**Output:**
- `/app` – Full Next.js application
- `/docker-compose.yml` – Local development
- `/docker-compose.prod.yml` – Production config
- `/nginx` – Reverse proxy config
- `/.github/workflows` – CI/CD pipeline

---

### `/feature` – Structured Feature Development ⭐ MANDATORY
Full feature lifecycle with documentation validation.

**What it does:**
1. Generates PRD using `sparc-prd-manual` skill (AUTO mode)
2. Validates requirements with `requirements-validator` skill
3. Blocks implementation if validation score <50
4. Implements feature with code generation
5. Post-review with `brutal-honesty-review` skill

**Usage:**
```bash
/feature "Real Content Reader with click-to-define"

# Manual mode (with checkpoints):
/feature "JLPT mock exam scoring" --mode manual

# Skip validation (not recommended):
/feature "UI tweaks" --skip-validation
```

**Output:**
- `docs/features/real-content-reader/` – Full SPARC documentation
- Code changes in `app/src/`
- Git commit with semantic message

**Dependencies:** sparc-prd-manual, requirements-validator, brutal-honesty-review skills

---

### `/myinsights` – Capture Development Insight ⭐ MANDATORY
Structured insight capture for knowledge base.

**What it does:**
- Captures insights during development
- Auto-commits on Stop hook (if enabled)
- Stores in `/docs/insights/YYYY-MM-DD-insight-name.md`

**Usage:**
```bash
# During development:
User: I discovered that Next.js SSR breaks with MeCab tokenization
Assistant: Let me capture that insight...
[calls /myinsights with context]

# Manual capture:
/myinsights "Performance optimization for Redis caching"
```

**Output:**
- `docs/insights/2026-04-17-next-js-mecab-ssr-issue.md`
- Automatically commits to Git (if hook enabled)

**Integration:** Works with Stop hook for automatic capture

---

### `/plan` – Implementation Planning
Plan feature implementation with task breakdown.

**Usage:**
```bash
/plan "Flexible SRS system with daily caps"

# With specific focus:
/plan "SRS algorithm" --focus backend
```

**Output:**
- Task breakdown with time estimates
- Dependencies and blockers
- Code structure recommendations
- Database schema changes (if needed)

---

### `/test` – Test Generation
Generate tests from Gherkin scenarios.

**Usage:**
```bash
/test "US-1.4 Flexible SRS System"

# Generate all tests for epic:
/test --epic "Free Tier"
```

**Output:**
- Jest tests in `app/src/__tests__/`
- Test coverage report
- Missing scenarios identified

---

### `/deploy` – Deploy to Environment
Deploy application to VPS.

**Usage:**
```bash
/deploy prod
/deploy staging
/deploy staging --skip-tests
```

**Process:**
1. Verify git status (no uncommitted changes)
2. Run tests (unless --skip-tests)
3. Trigger GitHub Actions workflow
4. Monitor deployment progress
5. Health check verification
6. Slack notification

---

### `/rollback` – Rollback to Previous Version
Rollback deployment if issues occur.

**Usage:**
```bash
/rollback           # rollback to previous version
/rollback v1.2.3    # rollback to specific version
```

**Safety:**
- Keeps last 5 versions on VPS
- Automatic backup before rollback
- Health check before confirming success

---

### `/logs` – View Application Logs
View logs from VPS in real-time.

**Usage:**
```bash
/logs app           # Next.js app logs
/logs db            # PostgreSQL logs
/logs nginx         # Nginx logs
/logs --follow      # Stream logs
/logs --tail 100    # Last 100 lines
```

---

## 📚 Skills Reference

### sparc-prd-manual ⭐ MANDATORY P0
Modular PRD + SPARC documentation generator.

**Triggers:** `/feature` command, "generate PRD", "create documentation"

**Dependencies:**
- explore (task exploration)
- goap-research (research with A*)
- problem-solver-enhanced (TRIZ + first principles)

**Output:** 11 production-ready files (PRD, Solution_Strategy, Specification, Pseudocode, Architecture, Refinement, Completion, Research_Findings, Final_Summary, README, _INDEX)

---

### requirements-validator ⭐ MANDATORY P0
Validates user stories using INVEST + SMART criteria.

**Triggers:** `/feature` command (automatic), "validate requirements"

**Scoring:**
- 90-100: Excellent → READY
- 70-89: Good → Minor fixes
- 50-69: Fair → Needs work
- **0-49: BLOCKED** → Cannot proceed to development

**Output:**
- Validation report with scores
- BDD scenarios (Gherkin format)
- Actionable improvement suggestions

---

### brutal-honesty-review ⭐ MANDATORY P0
Unvarnished technical criticism (Linus Torvalds + Gordon Ramsay + James Bach).

**Triggers:** Post-implementation in `/feature` command, "review this brutally"

**Review Areas:**
- Code quality and architecture
- Security vulnerabilities
- Performance bottlenecks
- Edge cases missed
- Test coverage gaps

**Output:**
- Surgical criticism with specific fixes
- No sugar-coating, just truth
- Actionable improvements

---

### project-context (P1)
Full domain context from Research_Findings + Final_Summary.

**Contains:**
- Market analysis (Japanese $500M→$2.49B, Korean $7.2B→$67B)
- Competitive landscape (Duolingo, WaniKani, Bunpro, Renshuu)
- User segments (4 personas with pain points)
- Monetization benchmarks
- Technology decisions rationale

---

### coding-standards (P1)
Tech stack patterns and best practices.

**Contains:**
- Next.js 14 patterns (SSR, API routes, middleware)
- Prisma ORM usage (relations, migrations, seed data)
- TypeScript strict mode patterns
- Tailwind CSS conventions
- Docker best practices

---

### testing-patterns (P1)
Test templates from Refinement.md.

**Contains:**
- Jest unit test templates
- Integration test patterns
- E2E test scenarios (Playwright)
- Performance testing (Lighthouse)
- Load testing (k6)

---

### security-patterns (P1)
Security patterns for external APIs.

**Contains:**
- bcrypt password hashing (cost ≥12)
- JWT token management (HTTP-only cookies)
- Rate limiting patterns (Redis)
- Input validation (Zod schemas)
- OWASP Top 10 mitigations

---

## 🎯 Rules

### security.md ⭐ MANDATORY P0
Security requirements from Specification NFRs.

**Enforces:**
- Password hashing: bcrypt cost ≥12
- Session management: HTTP-only cookies, 30-day expiry
- Rate limiting: 5 auth/15min, 100 API/1min
- Data encryption: Email at rest, GDPR compliance
- Input validation: Zod schemas for all API endpoints

---

### coding-style.md ⭐ MANDATORY P0
Coding conventions from Architecture tech stack.

**Enforces:**
- TypeScript strict mode (no `any` types)
- Functional components (React Hooks)
- Consistent naming: camelCase (JS), PascalCase (components), kebab-case (files)
- ESLint + Prettier (auto-format on save)
- Comment style: JSDoc for public APIs, inline for complex logic

---

### testing.md (P1)
Quality requirements from Refinement.md.

**Enforces:**
- Unit test coverage: ≥80%
- Integration tests: All API routes
- E2E tests: Critical user flows (login, lesson, SRS review)
- Performance: Lighthouse score >85, <200ms API p95
- Accessibility: WCAG AA compliance

---

### git-workflow.md ⭐ MANDATORY P0
Semantic commit conventions.

**Format:**
```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation only
- `style`: Formatting, no code change
- `refactor`: Code restructure, no behavior change
- `test`: Adding tests
- `chore`: Build process, dependencies

**Examples:**
```bash
feat(srs): add daily review cap with smart prioritization

Implements User Story 1.4 from Specification.md.
Addresses WaniKani "review avalanche" pain point.

- SM-2 algorithm with modifications
- 4-tier prioritization (leeches, overdue, new, regular)
- Vacation mode with timer pause
- 3-day grace period for missed reviews

Closes #23

fix(auth): rate limiting bypass on concurrent requests

Race condition in Redis increment operation allowed
>5 login attempts within 15min window.

Solution: Use Redis INCR with WATCH for atomic increment.

test(jlpt): add gap analysis unit tests

Covers calculatePriority edge cases:
- Zero error count
- All sections weighted equally
- Listening section 1.3x multiplier
```

---

### insights-capture.md ⭐ MANDATORY P0
Development insights protocol.

**When to capture:**
- Technical discoveries (performance optimization, library quirks)
- Architecture decisions (why we chose X over Y)
- Debugging breakthroughs (complex bug root cause)
- Best practices learned (what worked, what didn't)

**How to capture:**
```bash
/myinsights "Insight title"
# Or use Stop hook for automatic capture
```

---

### feature-lifecycle.md ⭐ MANDATORY P0
Feature development protocol.

**Lifecycle:**
```
/feature "X" 
  → PRD generation (sparc-prd-manual AUTO)
  → Validation (requirements-validator)
  → BLOCKED if score <50
  → Implementation (code generation)
  → Review (brutal-honesty-review)
  → Commit (semantic message)
```

**Documentation output:**
```
docs/features/feature-name/
├── PRD.md
├── Solution_Strategy.md
├── Specification.md
├── Pseudocode.md
├── Architecture.md
├── Refinement.md
├── Completion.md
└── Final_Summary.md
```

---

### secrets-management.md (P1)
Client-side encryption rules for external APIs.

**Enforces:**
- Never commit secrets to Git (.env in .gitignore)
- Environment variables for all secrets (DATABASE_URL, JWT_SECRET)
- Encrypt secrets at rest (Prisma bcrypt for passwords)
- Rotate secrets quarterly
- Use GitHub Secrets for CI/CD

---

## 🪝 Hooks

### Stop Hook – Insights Auto-Commit ⭐ MANDATORY P0

**Purpose:** Automatically capture and commit insights when stopping Claude Code.

**Configuration (settings.json):**
```json
{
  "hooks": {
    "stop": {
      "enabled": true,
      "commands": [
        "/myinsights --auto"
      ]
    }
  }
}
```

**Behavior:**
1. User clicks Stop button in Claude Code
2. Claude prompts: "Would you like to capture any insights from this session?"
3. If yes → generates insight markdown + commits to Git
4. If no → normal stop

---

## 📊 Development Timeline

### Month 1-2: N5 Curriculum + SRS (MVP)
- Hiragana/Katakana lessons with stroke order
- N5 lessons 1-10 (Minna no Nihongo structure)
- Basic SRS system (SM-2 algorithm, no daily caps yet)
- Authentication (email/password, JWT sessions)
- Ghost of Yotei aesthetic (color palette, typography)

### Month 3: Beta Launch
- Deploy to VPS with Docker Compose
- Invite 100 beta users from r/LearnJapanese
- Collect feedback via in-app forms
- Fix critical bugs and UX issues

### Month 4-6: Complete N5-N2 + Premium Features
- N5 lessons 11-50 (complete curriculum)
- N4, N3, N2 curricula (150 total lessons)
- Flexible SRS (daily caps, prioritization, vacation mode)
- In-app grammar explanations
- JLPT mock exams (N5-N2)
- Real Content Reader (NHK Easy News integration)

### Month 7-9: Polish + Scale
- Performance optimizations (Redis caching, CDN)
- Mobile responsiveness (iOS/Android via PWA)
- Community forums (basic moderation)
- SEO optimization (blog content, keyword targeting)

### Month 10: Break-Even
- 6,000 total users
- 900 Premium subscribers ($7,500 MRR)
- Fixed costs: $75/mo + $2,000/mo marketing = $2,075/mo burn
- **Net:** $7,500 - $2,075 = $5,425/mo profit ✅

---

## 📈 Success Metrics

**Product Metrics:**
- DAU/MAU >40% (habit formation)
- Lesson completion rate >70% (curriculum quality)
- Premium conversion 15% (validates value gap)
- JLPT pass rate >60% (exam prep quality)
- NPS >40 (word-of-mouth)

**Financial Metrics:**
- Month 3: 300 users, 0 paying (beta, no Premium yet)
- Month 6: 3,000 users, 450 paying ($3,750 MRR)
- Month 10: 6,000 users, 900 paying ($7,500 MRR, break-even)
- Year 2: 20,000 users, 3,000 paying ($25,000 MRR, +$160K profit)

**Technical Metrics:**
- API p95 <200ms
- Page load <3s (3G connection)
- Lighthouse score >85
- Uptime >99.5%
- Zero-downtime deployments

---

## 🚀 Deployment Guide

### Initial VPS Setup (One-Time)

```bash
# SSH into fresh VPS
ssh root@your-vps-ip

# Update system
apt update && apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Install Docker Compose
apt install docker-compose-plugin -y

# Create deployment user
useradd -m -s /bin/bash deploy
usermod -aG docker deploy
mkdir -p /home/deploy/.ssh
cp /root/.ssh/authorized_keys /home/deploy/.ssh/
chown -R deploy:deploy /home/deploy/.ssh

# Setup project directory
mkdir -p /opt/kitsunedo
chown deploy:deploy /opt/kitsunedo

# Clone repository (as deploy user)
su - deploy
cd /opt/kitsunedo
git clone git@github.com:yourusername/kitsunedo.git .

# Setup environment variables
cp .env.example .env.production
nano .env.production  # Edit with production values

# Initial deploy
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline (GitHub Actions)

**Automatic deployment on `git push origin main`:**

1. Run tests (Jest, ESLint)
2. Build Docker images
3. SSH to VPS
4. Pull latest code
5. Backup database
6. Zero-downtime deployment (`docker-compose up -d`)
7. Health check (`/api/health`)
8. Slack notification (success/failure)

**Manual deployment via `/deploy` command:**

```bash
/deploy prod        # Deploy to production
/deploy staging     # Deploy to staging
```

---

## 🐛 Troubleshooting

### VPS Logs

```bash
# SSH to VPS
ssh deploy@your-vps-ip
cd /opt/kitsunedo

# View all logs
docker-compose -f docker-compose.prod.yml logs --tail=100

# View specific service logs
docker-compose -f docker-compose.prod.yml logs app --tail=100
docker-compose -f docker-compose.prod.yml logs db --tail=100

# Follow logs in real-time
docker-compose -f docker-compose.prod.yml logs -f app
```

### Common Issues

**Issue:** API returns 500 errors after deployment  
**Solution:**
```bash
# Check database migrations
docker-compose exec app npx prisma migrate status
docker-compose exec app npx prisma migrate deploy

# Check environment variables
docker-compose exec app env | grep DATABASE_URL
```

**Issue:** Redis connection timeout  
**Solution:**
```bash
# Restart Redis container
docker-compose restart redis

# Check Redis logs
docker-compose logs redis --tail=50
```

**Issue:** Zero-downtime deployment failed  
**Solution:**
```bash
# Rollback to previous version
/rollback

# Or manual rollback on VPS:
cd /opt/kitsunedo
git log --oneline -10
git checkout <previous-commit-hash>
docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📚 Additional Resources

**Documentation:**
- `/docs/features/` – Feature-specific SPARC documentation
- `/docs/insights/` – Development insights and learnings
- `/docs/api/` – API endpoint documentation

**External Links:**
- [SPARC Methodology](https://github.com/anthropics/sparc-framework)
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Last Updated:** April 17, 2026  
**Version:** 1.0.0  
**Status:** Ready for Vibe Coding Development
