'use server';

import { z } from 'zod';
import fs from 'fs/promises'; // fs : file system을 위한 것, Node.js 기본 라이브러리에 포함되어 있음.
import db from '@/lib/db';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

// fs/promises : promises를 붙이는 이유는 async와 await를 사용하기 위해서임.

const productSchema = z.object({
  title: z.string({
    required_error: 'title is required',
  }),
  photo: z.string({
    required_error: 'photo is required',
  }),
  description: z.string({
    required_error: 'description is required',
  }),
  price: z.coerce.number({
    required_error: 'price is required',
  }),
});

export async function uploadProduct(_: any, formData: FormData) {
  const data = {
    title: formData.get('title'),
    photo: formData.get('photo'),
    price: formData.get('price'),
    description: formData.get('description'),
  };
  if (data.photo instanceof File) {
    const photoData = await data.photo.arrayBuffer();
    //console.log(photoData);
    await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData));
    // Buffer는 구글링해서 봐도 괜찮다. 요기 if 문은 가볍게 데이터 확인용으로 적는 테스트 코드라 중요치 않고, 좋지도 않다.
    data.photo = `/${data.photo.name}`;
  }
  const result = productSchema.safeParse(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    const session = await getSession();
    if (session.id) {
      const product = await db.product.create({
        data: {
          title: result.data.title,
          description: result.data.description,
          price: result.data.price,
          photo: result.data.photo,
          user: {
            connect: {
              id: session.id, // user id와 session id가 같은 user에 connect
            },
          },
        },
        // product를 생성하면 새로 생성된 proudct를 return 해 준다.
        // 여기서 필요한 것만 리턴
        select: {
          id: true,
        },
      });
      // option1
      redirect(`/products/${product.id}`);
      // option2 : products 목록으로 리다이렉트
      //   redirect('/products');
    }
  }
  //   console.log(data);
}
