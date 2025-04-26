'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import getSession from '@/lib/session';

/*
username: z
.string({
    invalid_type_error: "Username must be a string!",
    required_error: "Where is my username???",
})
.min(3, "Way too short!!!")
.max(10, "That is too looooong!")
.refine(
    (username) => !username.includes("potato"),
    "No potatoes allowed!"
),
*/

//검증하는 함수부분을 따로 빼서 처리
// function checkname(formAcccountName: string) {
//   return !formAcccountName.includes('cocoball');
// }
const checkname = (formAcccountName: string) =>
  !formAcccountName.includes('cocoball');

// 비밀번호 정규식 : 소문자,대문자,숫자, 특정 특수문자 일부를 모두 포함하고 있는지 검사
const passwordRegex = PASSWORD_REGEX;

const checkpassword = ({
  formAccountPw,
  formAccountPwChk,
}: {
  formAccountPw: string;
  formAccountPwChk: string;
}) => formAccountPw === formAccountPwChk;

const formSchema = z
  .object({
    formAcccountName: z
      .string({
        invalid_type_error: 'Username must be a string',
        required_error: 'Please enter userName',
      })
      // .min(3, 'password too short')
      // .max(10, 'The password can be up to 10 digits')
      // //데이터변환
      .toLowerCase()
      .trim(), //유저가 시작과 끝에 공백을 넣었을 때를 대비해서 trim으로 앞,뒤 공백을 제거
    // .transform((formAccountName) => `❤️${formAccountName}`),
    //필드별 데이터 유효성 검증 .refine
    //.refine((formAcccountName) => checkname, 'customer error')
    //.refine(checkUniqueUsername, 'This username is already taken'),
    formAcccountEamail: z.string().email().toLowerCase(),
    // .refine(
    //   checkUniqueEmail,
    //   'There is an account already registered with that email.'
    // ),
    formAccountPw: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(passwordRegex, PASSWORD_REGEX_ERROR),
    formAccountPwChk: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .superRefine(async ({ formAcccountName }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: formAcccountName,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      //user = true 이면 아이디가 존재한다는 의미
      ctx.addIssue({
        // zod 유효성 검사에서 에러를 추가하는 방법이다.
        code: 'custom', // 커스텀 : 오류 메시지를 커스텀 하는 부분임으로 custom으로 선택
        message: 'This username is already taken',
        path: ['username'], // 에러가 발생된 위치(filed)를 기재해준다. 만약, 기재되지 않는다면 formError로 노출이 된다.( 정확하게 Zod에서 에러가 어떤 필드에서 발생한지를 모르기 때문에)
        fatal: true, // 이 에러가 치명적인 에러라고 지정
      });
      return z.NEVER;
    }
  })
  .superRefine(async ({ formAcccountEamail }, ctx) => {
    const user = await db.user.findUnique({
      where: {
        username: formAcccountEamail,
      },
      select: {
        id: true,
      },
    });
    if (user) {
      //user = true 이면 아이디가 존재한다는 의미
      ctx.addIssue({
        // zod 유효성 검사에서 에러를 추가하는 방법이다.
        code: 'custom', // 커스텀 : 오류 메시지를 커스텀 하는 부분임으로 custom으로 선택
        message: 'This email is already taken',
        path: ['email'], // 에러가 발생된 위치(filed)를 기재해준다. 만약, 기재되지 않는다면 formError로 노출이 된다.( 정확하게 Zod에서 에러가 어떤 필드에서 발생한지를 모르기 때문에)
        fatal: true, // 이 에러가 치명적인 에러라고 지정
      });
      return z.NEVER;
    }
  })
  .refine(checkpassword, {
    message: 'Both passwords should be the same!',
    path: ['formAccountPwChk'],
  });

// const usernameSchema = z.string().min(5).max(10);

export async function createAccount(prevState: any, formData: FormData) {
  // cookie 테스트를 위한 쿠키 찍어보기
  // console.log(cookies());

  // form에서 모든 item을 가져와보자  = 유효성 검사하고 싶은 data Object
  const data = {
    formAcccountName: formData.get('formAcccountName'),
    formAcccountEamail: formData.get('formAcccountEamail'),
    formAccountPw: formData.get('formAccountPw'),
    formAccountPwChk: formData.get('formAccountPwChk'),
  };
  console.log(data);
  //usernameSchema.parse(data.formAcccountName);
  // zod 보내는 에러를 가지고 try-catch문으로도 잡아올 수 있다.
  //   try {
  //     formSchema.parse(data);
  //   } catch (e) {
  //     //이렇게하면 화면에 오류 메세지를 노출하지 않고, 콘솔로그로 에러를 확인할 수 있다.
  //     console.log(e);
  //   }

  //safeParse
  const result = await formSchema.safeParseAsync(data); //safePars는 에러를 throw하지 않는다.
  console.log(data);
  if (!result.success) {
    //console.log(result.error.flatten()); // 콘솔에서 에러를 볼 수도 있다.
    // 여기서 return으로 에러를 보내면 page.tsx의 useFormState의 state로 return한 내용이 들어간다.

    return result.error.flatten();
  } else {
    // result.data 안에는 검증된 데이터도 있고, 변환된 데이터도 있다.
    // console.log(result.data);

    //#bcrypt :hash password
    const hashedPassword = await bcrypt.hash(result.data.formAccountPw, 12);
    console.log(hashedPassword);

    //: save the user to DB
    const user = await db.user.create({
      data: {
        username: result.data.formAcccountName,
        email: result.data.formAcccountEamail,
        password: hashedPassword,
      },
      select: {
        id: true,
      },
    });
    console.log(user);

    //# iron-session : log the user in : 사용자가 데이터베이스에 저장되면 사용자를 로그인 시켜준다.
    // const cookie = await getIronSession(cookies(), {
    //   cookieName: 'delicious-karrot',
    //   password: process.env.COOKIE_PASSWORD!,
    // });
    //174-177 일부 코드 이동 : lib > session.ts
    const session = await getSession();
    session.id = user.id;
    await session.save();

    // 사용자가 로그인하면 사용자를 /home으로 /redirect를 시켜준다.

    redirect('/profile');
  }
}
