'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import bcrypt from 'bcrypt';
import db from '@/lib/db';
import { z } from 'zod';
import { getIronSession } from 'iron-session';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

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

// Join1. 사용자가 입력한 이름을 사용하는 유저가 있는지 filter
const checkUniqueUsername = async (formAcccountName: string) => {
  // check if username is taken ::already exists (사용자 이름이 존재하지는지 확인)
  const user = await db.user.findUnique({
    // 정상적인 프로세스를 위해서는 반환값은 null이 되어야 다음 가입 step으로 진행 가능
    where: {
      username: formAcccountName,
      // username, // 니꼬쌤 강의 기준 : 필드명이 같은 경우에는 자바스크립트 문법으로 username으로 축약이 가능함
    },
    select: {
      // 데이터베이스에서 요청할 데이터를 결정할 수 있다.
      // 기본적으로는 모든 user 데이터를 가져옴 그러기 때문에 사용하지 않을 데이터를 다 가져오는 것은 성능면에서 좋지 않음.
      // db에서 데이터를 전송 받을 때 user를 찾지만, id만 정보 받아옴
      id: true,
    },
  });
  // if (user) {
  //   // 조회된 사용자가 있는 경우
  //   return false;
  // } else {
  //   // 조회된 사용자가 없는 경우
  //   return true;
  // }
  // 위의 if문을 좀 더 간결하게 적을 수 있다.
  return !Boolean(user);
};

// join2
// email을 누가 사용하고 있는지도 확인
const checkUniqueEmail = async (formAcccountEamail: string) => {
  const user = await db.user.findUnique({
    // 정상적인 프로세스를 위해서는 반환값은 null이 되어야 다음 가입 step으로 진행 가능
    where: {
      email: formAcccountEamail,
    },
    select: {
      id: true,
    },
  });
  return !Boolean(user);
};

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
      .trim() //유저가 시작과 끝에 공백을 넣었을 때를 대비해서 trim으로 앞,뒤 공백을 제거
      // .transform((formAccountName) => `❤️${formAccountName}`),
      //필드별 데이터 유효성 검증 .refine
      //.refine((formAcccountName) => checkname, 'customer error')
      .refine(checkUniqueUsername, 'This username is already taken'),
    formAcccountEamail: z
      .string()
      .email()
      .toLowerCase()
      .refine(
        checkUniqueEmail,
        'There is an account already registered with that email.'
      ),
    formAccountPw: z.string().min(PASSWORD_MIN_LENGTH),
    // .regex(passwordRegex, PASSWORD_REGEX_ERROR),
    formAccountPwChk: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkpassword, {
    message: 'Both passwords should be the same!',
    path: ['formAccountPwChk'],
  });

// const usernameSchema = z.string().min(5).max(10);

export async function createAccount(prevState: any, formData: FormData) {
  // cookie 테스트를 위한 쿠키 찍어보기
  console.log(cookies());

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
    const cookie = await getIronSession(cookies(), {
      cookieName: 'delicious-karrot',
      password: process.env.COOKIE_PASSWORD!,
    });

    //@ts-ignore
    cookie.id = user.id;
    await cookie.save();

    // 사용자가 로그인하면 사용자를 /home으로 /redirect를 시켜준다.

    redirect('/profile');
  }
}
