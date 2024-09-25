import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main() {
  const zoe = await prisma.user.upsert({
    where: { email: 'zoezebedee1@gmail.com' },
    update: {},
    create: {
      id: "cm1830y8y0000iwxob7fjt3g9",
      userId: "Zoe",
      email: 'zoezebedee1@gmail.com',
      createdAt: "2024-09-18 16:33:25.091Z",
      updatedAt: "2024-09-18 16:32:56.354Z",
    },
  })
  console.log({ zoe })
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })