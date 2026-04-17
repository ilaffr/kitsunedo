# /init – Project Bootstrap

Generate complete project structure from SPARC documentation.

## Purpose

One-command full project generation for KitsuneDo. Creates:
- Next.js application with TypeScript
- Docker Compose configuration (dev + prod)
- Prisma schema from Specification data model
- Nginx reverse proxy
- CI/CD pipeline (GitHub Actions)

## Usage

```bash
/init
```

No parameters needed – reads directly from SPARC documentation in `/mnt/user-data/outputs/kitsunedo-sparc/`.

## Implementation

### Phase 1: Monorepo Structure

```
kitsunedo/
├── app/                        # Next.js application
│   ├── src/
│   │   ├── app/                # App Router (Next.js 14)
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── lessons/
│   │   │   │   └── [id]/
│   │   │   ├── srs/
│   │   │   ├── exams/
│   │   │   ├── content/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   ├── lessons/
│   │   │   │   ├── srs/
│   │   │   │   ├── exams/
│   │   │   │   └── health/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui components
│   │   │   ├── lessons/
│   │   │   ├── srs/
│   │   │   └── layout/
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── redis.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   ├── types/
│   │   └── styles/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   └── seed.ts
│   ├── public/
│   │   ├── audio/              # Placeholder for audio files
│   │   └── images/
│   ├── Dockerfile
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js
│   └── next.config.js
├── nginx/
│   ├── Dockerfile
│   └── nginx.conf
├── .github/
│   └── workflows/
│       └── deploy.yml
├── docker-compose.yml          # Local development
├── docker-compose.prod.yml     # Production config
├── .env.example
├── .gitignore
└── README.md
```

Create entire structure with:
```bash
mkdir -p app/src/{app,components,lib,types,styles}
mkdir -p app/prisma/migrations
mkdir -p app/public/{audio,images}
mkdir -p nginx
mkdir -p .github/workflows
```

### Phase 2: Prisma Schema Generation

Extract data model from `Specification.md` and generate `app/prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  email         String   @unique
  username      String   @unique
  passwordHash  String   @map("password_hash")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  settings      UserSettings?
  subscription  UserSubscription?
  progress      UserProgress[]
  srsItems      SRSItem[]
  lessonAccess  UserLessonAccess[]
  examResults   ExamResult[]

  @@map("users")
}

model UserSettings {
  id             String   @id @default(cuid())
  userId         String   @unique @map("user_id")
  dailyReviewCap Int      @default(50) @map("daily_review_cap")
  theme          String   @default("ghost_of_yotei")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_settings")
}

model UserSubscription {
  id        String   @id @default(cuid())
  userId    String   @unique @map("user_id")
  tier      String   @default("FREE") // FREE, PREMIUM
  status    String   @default("ACTIVE") // ACTIVE, CANCELED, EXPIRED
  startsAt  DateTime @map("starts_at")
  expiresAt DateTime? @map("expires_at")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_subscriptions")
}

model Lesson {
  id             String   @id @default(cuid())
  course         String   // N5, N4, N3, N2, N1
  sequenceNumber Int      @map("sequence_number")
  title          String
  titleJp        String?  @map("title_jp")
  description    String?
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  sections      LessonSection[]
  vocabulary    Vocabulary[]
  grammarPoints GrammarPoint[]
  exercises     Exercise[]
  userAccess    UserLessonAccess[]
  userProgress  UserProgress[]

  @@unique([course, sequenceNumber])
  @@map("lessons")
}

model LessonSection {
  id          String   @id @default(cuid())
  lessonId    String   @map("lesson_id")
  type        String   // VOCABULARY, GRAMMAR, EXAMPLES, EXERCISES
  title       String
  content     String?  @db.Text
  orderIndex  Int      @map("order_index")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("lesson_sections")
}

model Vocabulary {
  id          String   @id @default(cuid())
  lessonId    String?  @map("lesson_id")
  word        String
  reading     String
  meaning     String
  jlptLevel   String   @map("jlpt_level") // N5, N4, N3, N2, N1
  audioUrl    String?  @map("audio_url")
  exampleSentence String? @map("example_sentence") @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  lesson   Lesson?    @relation(fields: [lessonId], references: [id])
  srsItems SRSItem[]

  @@map("vocabulary")
}

model GrammarPoint {
  id          String   @id @default(cuid())
  lessonId    String?  @map("lesson_id")
  name        String
  nameJp      String?  @map("name_jp")
  meaning     String   @db.Text
  usagePattern String? @map("usage_pattern") @db.Text
  examples    String   @db.Text // JSON array of examples
  jlptLevel   String   @map("jlpt_level")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  lesson Lesson? @relation(fields: [lessonId], references: [id])

  @@map("grammar_points")
}

model Exercise {
  id          String   @id @default(cuid())
  lessonId    String   @map("lesson_id")
  type        String   // MULTIPLE_CHOICE, FILL_BLANK, TRANSLATE
  question    String   @db.Text
  options     String?  @db.Text // JSON array for multiple choice
  correctAnswer String @map("correct_answer")
  explanation String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@map("exercises")
}

model SRSItem {
  id                    String   @id @default(cuid())
  userId                String   @map("user_id")
  vocabularyId          String   @map("vocabulary_id")
  easiness              Float    @default(2.5)
  interval              Int      @default(0) // Days
  repetitions           Int      @default(0)
  nextReview            DateTime @map("next_review")
  lastReviewed          DateTime? @map("last_reviewed")
  consecutiveFailures   Int      @default(0) @map("consecutive_failures")
  createdAt             DateTime @default(now()) @map("created_at")
  updatedAt             DateTime @updatedAt @map("updated_at")

  user       User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  vocabulary Vocabulary @relation(fields: [vocabularyId], references: [id], onDelete: Cascade)

  @@unique([userId, vocabularyId])
  @@index([userId, nextReview])
  @@map("srs_items")
}

model UserLessonAccess {
  id         String   @id @default(cuid())
  userId     String   @map("user_id")
  lessonId   String   @map("lesson_id")
  unlockedAt DateTime @default(now()) @map("unlocked_at")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId])
  @@map("user_lesson_access")
}

model UserProgress {
  id                  String   @id @default(cuid())
  userId              String   @map("user_id")
  lessonId            String   @map("lesson_id")
  section             String   // VOCABULARY, GRAMMAR, EXAMPLES, EXERCISES
  itemsViewed         Int      @default(0) @map("items_viewed")
  explanationsRead    Int      @default(0) @map("explanations_read")
  examplesListened    Int      @default(0) @map("examples_listened")
  exercisesCompleted  Int      @default(0) @map("exercises_completed")
  accuracy            Float?
  completed           Boolean  @default(false)
  completedAt         DateTime? @map("completed_at")
  createdAt           DateTime @default(now()) @map("created_at")
  updatedAt           DateTime @updatedAt @map("updated_at")

  user   User   @relation(fields: [userId], references: [id], onDelete: Cascade)
  lesson Lesson @relation(fields: [lessonId], references: [id], onDelete: Cascade)

  @@unique([userId, lessonId, section])
  @@map("user_progress")
}

model MockExam {
  id          String   @id @default(cuid())
  level       String   // N5, N4, N3, N2, N1
  title       String
  description String?  @db.Text
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  questions ExamQuestion[]
  results   ExamResult[]

  @@map("mock_exams")
}

model ExamQuestion {
  id          String   @id @default(cuid())
  examId      String   @map("exam_id")
  section     String   // VOCABULARY, GRAMMAR, READING, LISTENING
  questionNum Int      @map("question_num")
  question    String   @db.Text
  options     String   @db.Text // JSON array
  correctAnswer String @map("correct_answer")
  topic       String?  // For gap analysis
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  exam MockExam @relation(fields: [examId], references: [id], onDelete: Cascade)

  @@map("exam_questions")
}

model ExamResult {
  id                String   @id @default(cuid())
  userId            String   @map("user_id")
  examId            String   @map("exam_id")
  totalScore        Int      @map("total_score")
  vocabularyScore   Int      @map("vocabulary_score")
  grammarScore      Int      @map("grammar_score")
  readingScore      Int      @map("reading_score")
  listeningScore    Int      @map("listening_score")
  prediction        String   // PASS, BORDERLINE_PASS, BORDERLINE_FAIL, FAIL
  confidence        Float
  takenAt           DateTime @default(now()) @map("taken_at")

  user User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  exam MockExam @relation(fields: [examId], references: [id], onDelete: Cascade)

  @@map("exam_results")
}

model Article {
  id          String   @id @default(cuid())
  source      String   // NHK_EASY, NAVER
  language    String   // JAPANESE, KOREAN
  title       String
  titleEn     String?  @map("title_en")
  content     String   @db.Text
  difficulty  String   // N5-N4, N4-N3, N3-N2, N2-N1
  publishedAt DateTime @map("published_at")
  imageUrl    String?  @map("image_url")
  sourceUrl   String   @map("source_url")
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("articles")
}
```

Initialize database:
```bash
cd app
npx prisma migrate dev --name init
npx prisma generate
npx prisma db seed
```

### Phase 3: Docker Configuration

Generate `docker-compose.yml` (local development):

```yaml
version: '3.8'

services:
  app:
    build:
      context: ./app
      dockerfile: Dockerfile
      target: development
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/kitsunedo_dev
      - REDIS_URL=redis://redis:6379
    volumes:
      - ./app:/app
      - /app/node_modules
    depends_on:
      - db
      - redis
    command: npm run dev

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_DB=kitsunedo_dev
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=postgres
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  postgres-data:
```

Generate `docker-compose.prod.yml` (production) – see Architecture.md for full config.

### Phase 4: CI/CD Pipeline

Generate `.github/workflows/deploy.yml` – see Architecture.md deployment section for full pipeline.

## Validation

After running `/init`, verify:

```bash
# 1. Structure created
ls -la app/src/app
ls -la nginx
ls -la .github/workflows

# 2. Dependencies installable
cd app && npm install

# 3. Prisma schema valid
cd app && npx prisma validate

# 4. Docker builds
docker-compose build

# 5. Local dev runs
docker-compose up
# Visit http://localhost:3000
```

## Next Steps

After `/init`:

1. Run `docker-compose up` to start local development
2. Use `/feature` to generate first feature (e.g., "Hiragana stroke order practice")
3. Implement feature using generated SPARC documentation
4. Deploy to VPS with `/deploy prod`

## Troubleshooting

**Issue:** Prisma schema generation fails  
**Solution:** Check that Specification.md contains data model section

**Issue:** Docker build fails  
**Solution:** Ensure Docker daemon is running: `docker info`

**Issue:** Port 3000 already in use  
**Solution:** Stop conflicting service or change port in docker-compose.yml
