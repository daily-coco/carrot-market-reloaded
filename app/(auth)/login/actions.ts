'use server';
import { z } from 'zod';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import db from '@/lib/db';
import bcrypt from 'bcrypt';
import getSession from '@/lib/session';
import { redirect } from 'next/navigation';

const checkEmailExists = async (loginEmail: string) => {
  const user = await db.user.findUnique({
    where: {
      email: loginEmail,
    },
    select: {
      id: true,
    },
  });
  return Boolean(user);
};

const formSchema = z.object({
  loginEmail: z
    .string()
    .email()
    .toLowerCase()
    .refine(checkEmailExists, 'An account with this email does not exist.'),
  loginPassword: z.string({
    required_error: 'Password is required',
  }),
  //.min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
});

export async function login(prevState: any, formData: FormData) {
  const data = {
    loginEmail: formData.get('loginEmail'),
    loginPassword: formData.get('loginPassword'),
  };

  console.log(data);
  const result = await formSchema.spa(data);
  if (!result.success) {
    return result.error.flatten();
  } else {
    // console.log(result.data);
    // find a user with the email
    // if the user is found, check password hash

    const user = await db.user.findUnique({
      where: {
        email: result.data.loginEmail,
      },
      select: {
        id: true,
        password: true,
      },
    });
    const ok = await bcrypt.compare(
      result.data.loginPassword,
      user!.password ?? 'xxxx'
    );
    if (ok) {
      const session = await getSession();
      session.id = user!.id;
      await session.save();
      redirect('/profile');
    } else {
      return {
        fieldErrors: {
          loginPassword: ['Wrong password.'],
          loginEmail: [],
        },
      };
    }

    // log the user in
    // redriect "/profile"
  }
}
