import { PrismaClient, Question, Answer, Company } from '@prisma/client';

const companies: Omit<Company, 'createdAt' | 'id'>[] = [
  {
    name: 'Company 1',
  },
];

const questions: Omit<Question, 'createdAt' | 'id'>[] = [
  {
    title: 'What is your name?',
    description: 'I want to know your name',
    companyId: '1',
    authorId: '1',
    correctAnswerId: null,
  },
];

const answers: Omit<Answer, 'createdAt' | 'id'>[] = [
  {
    text: 'My name is John',
    questionId: '1',
    authorId: '1',
  },
];

const prisma = new PrismaClient();

async function main() {
  const companyIds = [];
  const questionIds = [];

  for (const company of companies) {
    const result = await prisma.company.create({
      data: company,
    });
    companyIds.push(result.id);
  }

  for (const question of questions) {
    const result = await prisma.question.create({
      data: { ...question, companyId: companyIds[0]! },
    });
    questionIds.push(result.id);
  }

  for (const answer of answers) {
    await prisma.answer.create({
      data: { ...answer, questionId: questionIds[0]! },
    });
  }
}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
