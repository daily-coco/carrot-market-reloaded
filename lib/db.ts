import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function test() {
  const product = await db.product.create({
    data: {
      title: '고구마',
      price: 9999,
      photo: '/goguma.jpg',
      description: '맛있는 고구마아아아',
      user: {
        connect: {
          id: 2,
        },
      },
    },
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      description: true,
      created_at: true,
      updated_at: true,
      user: true,
      userId: true,
    },
  });

  //   const user = await db.user.create({
  //     data: {
  //       username: 'coco',
  //       phone: '123123123',
  //     },
  //   });
  //   //   const token = await db.sMSToken.create({
  //   //     data: {
  //   //       token: '12121212',
  //   //       user: {
  //   //         connect: {
  //   //           id: 1,
  //   //         },
  //   //       },
  //   //     },
  //   //   });
  //   const token = await db.sMSToken.findUnique({
  //     where: {
  //       id: 1,
  //     },
  //     include: {
  //       user: true,
  //     },
  //   });
  //   console.log(token);
  //   console.log(user);
  //   console.log(token);
}
test();

export default db;
