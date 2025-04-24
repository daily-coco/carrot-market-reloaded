import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function test() {
  const user = await db.user.create({
    data: {
      username: 'coco',
      phone: '123123123',
    },
  });
  //   const token = await db.sMSToken.create({
  //     data: {
  //       token: '12121212',
  //       user: {
  //         connect: {
  //           id: 1,
  //         },
  //       },
  //     },
  //   });
  const token = await db.sMSToken.findUnique({
    where: {
      id: 1,
    },
    include: {
      user: true,
    },
  });
  console.log(token);
  console.log(user);
  console.log(token);
}
test();

export default db;
