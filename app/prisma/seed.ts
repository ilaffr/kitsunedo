import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding N5 lesson 1...')

  const lesson1 = await prisma.lesson.upsert({
    where: { course_sequenceNumber: { course: 'N5', sequenceNumber: 1 } },
    update: {},
    create: {
      course: 'N5',
      sequenceNumber: 1,
      title: 'Greetings & Self-Introduction',
      titleJp: 'あいさつと自己紹介',
      description: 'Learn essential Japanese greetings and how to introduce yourself.',
      sections: {
        create: [
          { type: 'VOCABULARY', title: 'Vocabulary', orderIndex: 0 },
          { type: 'GRAMMAR', title: 'Grammar Points', orderIndex: 1 },
          { type: 'EXERCISES', title: 'Practice', orderIndex: 2 },
        ],
      },
      vocabulary: {
        create: [
          { word: 'おはよう', reading: 'ohayou', meaning: 'Good morning (casual)', jlptLevel: 'N5' },
          { word: 'おはようございます', reading: 'ohayou gozaimasu', meaning: 'Good morning (polite)', jlptLevel: 'N5' },
          { word: 'こんにちは', reading: 'konnichiwa', meaning: 'Hello / Good afternoon', jlptLevel: 'N5' },
          { word: 'こんばんは', reading: 'konbanwa', meaning: 'Good evening', jlptLevel: 'N5' },
          { word: 'おやすみなさい', reading: 'oyasumi nasai', meaning: 'Good night', jlptLevel: 'N5' },
          { word: 'ありがとうございます', reading: 'arigatou gozaimasu', meaning: 'Thank you very much', jlptLevel: 'N5' },
          { word: 'すみません', reading: 'sumimasen', meaning: 'Excuse me / I\'m sorry', jlptLevel: 'N5' },
          { word: 'はじめまして', reading: 'hajimemashite', meaning: 'Nice to meet you (first meeting)', jlptLevel: 'N5' },
          { word: 'よろしくおねがいします', reading: 'yoroshiku onegaishimasu', meaning: 'Please treat me well', jlptLevel: 'N5' },
          { word: 'わたし', reading: 'watashi', meaning: 'I / me', jlptLevel: 'N5' },
        ],
      },
      grammarPoints: {
        create: [
          {
            name: '〜は〜です',
            nameJp: '〜は〜です',
            meaning: 'X is Y. The basic copula sentence pattern using は (topic marker) and です (polite verb "to be").',
            usagePattern: '[Topic]は [Noun/Adjective]です',
            examples: JSON.stringify([
              'わたしはたなかです。(I am Tanaka.)',
              'これはほんです。(This is a book.)',
            ]),
            jlptLevel: 'N5',
          },
        ],
      },
      exercises: {
        create: [
          {
            type: 'MULTIPLE_CHOICE',
            question: 'How do you say "Good morning" (polite) in Japanese?',
            options: JSON.stringify(['こんにちは', 'おはようございます', 'こんばんは', 'おやすみなさい']),
            correctAnswer: 'おはようございます',
            explanation: 'おはようございます is the polite form of おはよう, used in formal situations or with people you don\'t know well.',
          },
          {
            type: 'MULTIPLE_CHOICE',
            question: 'What does はじめまして mean?',
            options: JSON.stringify(['Goodbye', 'Thank you', 'Nice to meet you', 'Excuse me']),
            correctAnswer: 'Nice to meet you',
            explanation: 'はじめまして is used when meeting someone for the first time.',
          },
        ],
      },
    },
  })

  console.log(`Created lesson: ${lesson1.title}`)
  console.log('Seed complete.')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
