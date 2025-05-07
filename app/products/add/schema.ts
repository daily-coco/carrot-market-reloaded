import { z } from 'zod';

export const productSchema = z.object({
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

//z.infer은 Schema로부터 typescript에서 쓸 수 있는 type을 가져올 수 있게 해 준다.
export type ProductType = z.infer<typeof productSchema>;
