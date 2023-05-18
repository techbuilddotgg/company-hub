import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {}

(async () => {
  try {
    await main();
  } catch (error) {
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
})();
