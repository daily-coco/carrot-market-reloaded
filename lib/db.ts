import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function test() {
  // const product = await db.product.create({
  //   data: {
  //     title: '고구마',
  //     price: 9999,
  //     photo: '/goguma.jpg',
  //     description: '맛있는 고구마아아아',
  //     user: {
  //       connect: {
  //         id: 2,
  //       },
  //     },
  //   },
  //   select: {
  //     id: true,
  //     title: true,
  //     price: true,
  //     photo: true,
  //     description: true,
  //     user: true,
  //     userId: true,
  //   },
  // });
  const products = await db.product.create({
    data: {
      title: '고구마',
      price: 9999,
      photo: '/goguma.jpg',
      description: '맛있는 고구마',
      userId: 2, // ✅ createMany는 connect를 못 써서 직접 userId를 지정해야 해
    },
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      description: true,
      user: true,
      userId: true,
    },
  });

  const products2 = await db.product.create({
    data: {
      title: '김밥',
      price: 8888,
      photo: '/gimbap.jpg',
      description: '맛있는 김밥',
      userId: 2,
    },
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      description: true,
      user: true,
      userId: true,
    },
  });

  const products3 = await db.product.create({
    data: {
      title: '오뎅',
      price: 7777,
      photo: '/odeng.jpg',
      description: '신선한 오뎅',
      userId: 2,
    },
    select: {
      id: true,
      title: true,
      price: true,
      photo: true,
      description: true,
      user: true,
      userId: true,
    },
  });

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
