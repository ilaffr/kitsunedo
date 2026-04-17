export type JLPTLevel = 'N5' | 'N4' | 'N3' | 'N2' | 'N1'
export type Language = 'JAPANESE' | 'KOREAN'
export type SubscriptionTier = 'FREE' | 'PREMIUM'
export type ExamSection = 'VOCABULARY' | 'GRAMMAR' | 'READING' | 'LISTENING'
export type ExamPrediction = 'PASS' | 'BORDERLINE_PASS' | 'BORDERLINE_FAIL' | 'FAIL'
export type SRSPriority = 'LEECH' | 'OVERDUE' | 'NEW' | 'REGULAR'

export interface SRSReviewResult {
  itemId: string
  quality: 0 | 1 | 2 | 3 | 4 | 5
}

export interface SRSItem {
  id: string
  vocabularyId: string
  easiness: number
  interval: number
  repetitions: number
  nextReview: Date
  consecutiveFailures: number
}

export interface LessonProgress {
  lessonId: string
  section: string
  completed: boolean
  accuracy: number | null
}

// Extend NextAuth session type
declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}
