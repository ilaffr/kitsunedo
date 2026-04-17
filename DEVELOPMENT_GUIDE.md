# KitsuneDo Development Guide

Step-by-step development lifecycle for KitsuneDo project.

## Phase 1: Initial Setup (Week 1)

```bash
# 1. Initialize project
/init

# 2. Start local development
docker-compose up

# 3. Verify setup
curl http://localhost:3000/api/health
# Expected: {"status":"healthy"}
```

## Phase 2: Feature Development (Months 1-6)

### Month 1-2: MVP Features

```bash
# Hiragana/Katakana
/feature "Hiragana stroke order practice with audio"

# N5 Lessons
/feature "Structured lesson progression (Minna no Nihongo)"

# Basic SRS
/feature "SRS review system with SM-2 algorithm"

# Authentication
/feature "Email/password authentication with JWT sessions"
```

### Month 3: Beta Launch

```bash
# Deploy to production
/deploy prod

# Monitor logs
/logs app --follow
```

### Month 4-6: Complete Features

```bash
# Flexible SRS
/feature "Daily review caps with smart prioritization"

# Grammar
/feature "In-app grammar explanations with search"

# JLPT Mocks
/feature "N5-N2 mock exams with score prediction"

# Real Content
/feature "NHK Easy News reader with click-to-define"
```

## Phase 3: Scaling (Months 7-10)

### Performance Optimization

```bash
# Redis caching
/myinsights "Redis caching strategy for SRS queue"

# CDN configuration
# See Architecture.md - Caching Strategy
```

### Deployment

```bash
# Production deploy
/deploy prod

# Rollback if needed
/rollback
```

## Development Commands

| Command | Purpose | Example |
|---------|---------|---------|
| `/init` | Bootstrap project | `/init` |
| `/feature` | Structured feature dev | `/feature "Feature name"` |
| `/plan` | Plan implementation | `/plan "SRS algorithm"` |
| `/test` | Generate tests | `/test "US-1.4"` |
| `/deploy` | Deploy to environment | `/deploy prod` |
| `/rollback` | Rollback deployment | `/rollback` |
| `/logs` | View application logs | `/logs app --follow` |
| `/myinsights` | Capture insight | `/myinsights "Title"` |

## Git Workflow

```bash
# Feature branch
git checkout -b feature/srs-daily-caps

# Implement with /feature
/feature "Flexible SRS with daily caps"

# Commit (semantic message auto-generated)
git commit -m "feat(srs): add daily caps with prioritization

Implements US-1.4 from Specification.md
Validation: 91/100 ✅ READY

Closes #42"

# Push and create PR
git push origin feature/srs-daily-caps
```

## Testing

```bash
# Unit tests
npm run test

# Integration tests
npm run test:integration

# E2E tests
npm run test:e2e

# Performance
npm run lighthouse
```

## Monitoring

```bash
# Health check
curl https://kitsunedo.com/api/health

# Metrics
# See CLAUDE.md - Success Metrics section
```

## Troubleshooting

See CLAUDE.md - Troubleshooting section for common issues and solutions.
