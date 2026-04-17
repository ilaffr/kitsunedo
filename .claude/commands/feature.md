# /feature – Structured Feature Development

Full feature lifecycle with SPARC documentation + validation + implementation + review.

## Purpose

Implements feature using structured workflow:
1. **PRD Generation** (sparc-prd-manual skill in AUTO mode)
2. **Requirements Validation** (requirements-validator skill)
3. **BLOCKS if score <50** (untestable requirements cannot proceed)
4. **Implementation** (code generation with Pseudocode references)
5. **Post-Review** (brutal-honesty-review skill)

## Usage

```bash
# AUTO mode (default – no checkpoints)
/feature "Flexible SRS system with daily review caps"

# MANUAL mode (with checkpoints for approval)
/feature "JLPT mock exam scoring algorithm" --mode manual

# Skip validation (NOT RECOMMENDED – may produce untestable code)
/feature "Quick UI tweaks" --skip-validation

# With specific focus
/feature "Real Content Reader" --focus backend
```

## Workflow

```
┌──────────────────────────────────────────────────────────────┐
│ /feature "X"                                                 │
│         ↓                                                     │
│ Phase 1: PRD Generation (sparc-prd-manual AUTO)             │
│         - Product Brief (if not clear, runs explore)         │
│         - Research Findings (GOAP + web search)              │
│         - Solution Strategy (problem-solver-enhanced)        │
│         - Specification (user stories + Gherkin)             │
│         - Pseudocode (algorithms)                            │
│         - Architecture (tech stack alignment)                │
│         - Refinement (edge cases, testing)                   │
│         - Completion (deployment notes)                      │
│         ↓                                                     │
│ Phase 2: Validation (requirements-validator)                │
│         - INVEST analysis (6 criteria)                       │
│         - SMART analysis (5 criteria)                        │
│         - BDD scenarios generation (Gherkin)                 │
│         - Score calculation (0-100)                          │
│         ↓                                                     │
│ ┌─ IF SCORE < 50 → BLOCKED ─────────────────────────┐      │
│ │ Cannot proceed to implementation.                  │      │
│ │ User must fix requirements or override with        │      │
│ │ --skip-validation flag (not recommended).          │      │
│ └───────────────────────────────────────────────────┘      │
│         ↓                                                     │
│ Phase 3: Implementation                                      │
│         - Read Pseudocode for algorithm templates            │
│         - Generate code (TypeScript + React)                 │
│         - Create tests (Jest + Gherkin → test cases)         │
│         - Update Prisma schema (if needed)                   │
│         ↓                                                     │
│ Phase 4: Review (brutal-honesty-review)                     │
│         - Code quality check                                 │
│         - Security audit                                     │
│         - Performance analysis                               │
│         - Edge case coverage                                 │
│         ↓                                                     │
│ Phase 5: Commit                                              │
│         - Semantic commit message (git-workflow.md)          │
│         - Documentation updated                              │
│         - Feature marked as DONE                             │
└──────────────────────────────────────────────────────────────┘
```

## Output Structure

```
docs/features/feature-name/
├── PRD.md                    # Product requirements
├── Solution_Strategy.md      # Problem analysis (TRIZ + game theory)
├── Specification.md          # User stories + Gherkin scenarios
├── Pseudocode.md             # Algorithm templates
├── Architecture.md           # Tech stack integration
├── Refinement.md             # Edge cases + testing strategy
├── Completion.md             # Deployment notes
├── Research_Findings.md      # Market + tech research
├── Final_Summary.md          # Executive summary
└── VALIDATION_REPORT.md      # Requirements validation results

app/src/
├── app/[feature-routes]/     # New Next.js routes
├── components/[feature]/     # New components
├── lib/[feature].ts          # Business logic
└── __tests__/[feature]/      # Tests
```

## Example: Flexible SRS System

```bash
/feature "Flexible SRS system with daily review caps and smart prioritization"
```

**Phase 1 Output (PRD):**
- Problem: WaniKani's "400-500 reviews waiting" overwhelm (validated pain point)
- Solution: User-configurable daily caps (10-500) + 4-tier prioritization
- User Story US-1.4 from Specification.md
- Algorithm from Pseudocode.md (`generateDailyReviewQueue`)

**Phase 2 Validation:**
```
INVEST Score: 88/100 ✓ (6/6 criteria met)
SMART Score: 95/100 ✓ (5/5 criteria met)
Overall: 91/100 ✅ READY FOR DEVELOPMENT

BDD Scenarios Generated:
- User-configurable daily caps
- Smart prioritization when capped
- Vacation mode
- Grace period for missed reviews
```

**Phase 3 Implementation:**
- `app/src/lib/srs.ts` – SRS algorithm implementation
- `app/src/app/api/srs/queue/route.ts` – API endpoint
- `app/src/components/srs/ReviewQueue.tsx` – UI component
- `app/src/__tests__/srs/queue.test.ts` – Unit tests

**Phase 4 Review:**
```
brutal-honesty-review output:

✓ Algorithm matches Pseudocode.md specification exactly
✗ Missing: Redis caching (will hit DB on every queue generation)
✗ Race condition: Concurrent reviews can bypass daily cap
✓ Edge cases covered: Leap year dates, timezone changes
✗ Performance: O(n²) sorting in shuffleWithinTiers – use Fisher-Yates
→ 3 CRITICAL issues must be fixed before merge
```

**Phase 5 Commit:**
```bash
git commit -m "feat(srs): add flexible SRS with daily caps and prioritization

Implements User Story 1.4 from Specification.md.
Addresses WaniKani 'review avalanche' pain point.

Features:
- User-configurable daily caps (10-500, default 50)
- 4-tier prioritization (leeches, overdue, new, regular)
- Vacation mode with timer pause
- 3-day grace period for missed reviews
- Redis caching (1-hour TTL)
- Fisher-Yates shuffle for O(n) performance

Validation: 91/100 (INVEST 88/100, SMART 95/100)
Review: All critical issues addressed

Closes #42"
```

## Validation Scoring

| Score | Rating | Status | Action |
|-------|--------|--------|--------|
| 90-100 | Excellent | ✅ READY | Proceed to implementation |
| 70-89 | Good | ✅ READY | Minor fixes recommended |
| 50-69 | Fair | ⚠️ WARNING | Needs work before implementation |
| **0-49** | **Poor** | **🚫 BLOCKED** | **Cannot proceed** |

**Blocked (<50) Requirements Example:**

```
US-X.X: System should be fast and user-friendly

INVEST Analysis:
✗ Valuable: No clear user benefit stated
✗ Testable: "fast" and "user-friendly" are not measurable

SMART Analysis:
✗ Specific: "fast" is vague (no threshold)
✗ Measurable: No metrics defined
✗ Time-bound: No performance targets

Score: 35/100 🚫 BLOCKED

Suggestions:
1. Define "fast": <200ms p95 API response time
2. Define "user-friendly": >80% task completion in usability test
3. Add acceptance criteria with Gherkin scenarios
```

## Modes

### AUTO Mode (Default)

No checkpoints – runs entire pipeline automatically.

**Use when:** Requirements are clear, low risk, small features.

**Example:**
```bash
/feature "Add audio play button to vocabulary cards"
# Runs: PRD → Validate → Implement → Review → Commit (no stops)
```

### MANUAL Mode

Checkpoints after each phase for approval.

**Use when:** Complex features, high risk, architectural changes.

**Example:**
```bash
/feature "JLPT mock exam scoring with ML prediction" --mode manual

# Checkpoint 1: PRD Generated
→ User reviews PRD, can request changes
→ User approves: "ok" to proceed

# Checkpoint 2: Validation Complete
→ User reviews validation report
→ If score <50, user can fix requirements or override

# Checkpoint 3: Implementation Plan
→ User reviews proposed code structure
→ Can request different approach

# etc.
```

## Dependencies

**MANDATORY P0 Skills:**
- `sparc-prd-manual` – PRD generation (phases 1-7)
- `requirements-validator` – INVEST + SMART + BDD validation
- `brutal-honesty-review` – Post-implementation review

**Atomic Dependencies (auto-loaded by sparc-prd-manual):**
- `explore` – Task exploration if requirements unclear
- `goap-research` – Market + tech research
- `problem-solver-enhanced` – Solution strategy (TRIZ + game theory)

## Flags

| Flag | Effect | When to Use |
|------|--------|-------------|
| `--mode manual` | Enable checkpoints | Complex/risky features |
| `--mode auto` | No checkpoints (default) | Simple features |
| `--skip-validation` | Skip requirements validator | Quick experiments (NOT for production) |
| `--focus backend` | Focus on backend code | API-heavy features |
| `--focus frontend` | Focus on frontend code | UI-heavy features |
| `--focus tests` | Focus on test generation | Test-first development |

## Best Practices

### DO:
- Use `/feature` for all new features (ensures documentation + validation)
- Let validation BLOCK bad requirements (saves debugging time later)
- Review brutal-honesty-review output before merging
- Commit with semantic messages (automatically generated)

### DON'T:
- Skip validation unless experimenting (production code should always validate)
- Ignore brutal-honesty-review warnings (they're usually right)
- Use `/feature` for trivial changes (use direct coding instead)
- Override BLOCKED requirements without fixing them first

## Troubleshooting

**Issue:** Feature blocked with score <50  
**Solution:** Fix requirements to be INVEST + SMART compliant. See validation report for specific issues.

**Issue:** brutal-honesty-review finds security vulnerability  
**Solution:** Address immediately. Security issues are CRITICAL priority.

**Issue:** Implementation doesn't match Pseudocode  
**Solution:** Re-read Pseudocode.md and align implementation. Algorithm correctness is non-negotiable.

**Issue:** Tests fail after implementation  
**Solution:** Check Gherkin scenarios in Specification.md. Tests are derived from acceptance criteria.

## Related Commands

- `/init` – Bootstrap project before first `/feature`
- `/plan` – Plan implementation without full PRD
- `/test` – Generate tests from Gherkin scenarios
- `/myinsights` – Capture learnings during feature development
