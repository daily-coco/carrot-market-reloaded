'use server';
import {
  PASSWORD_MIN_LENGTH,
  PASSWORD_REGEX,
  PASSWORD_REGEX_ERROR,
} from '@/lib/constants';
import { z } from 'zod';

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
      .trim() //유저가 시작과 끝에 공백을 넣었을 때를 대비해서 trim으로 앞,뒤 공백을 제거
      .transform((formAccountName) => `❤️${formAccountName}`),
    //필드별 데이터 유효성 검증 .refine
    //.refine((formAcccountName) => checkname, 'customer error'),
    formAcccountEamail: z.string().email().toLowerCase(),
    formAccountPw: z
      .string()
      .min(PASSWORD_MIN_LENGTH)
      .regex(passwordRegex, PASSWORD_REGEX_ERROR),
    formAccountPwChk: z.string().min(PASSWORD_MIN_LENGTH),
  })
  .refine(checkpassword, {
    message: 'Both passwords should be the same!',
    path: ['formAccountPwChk'],
  });

// const usernameSchema = z.string().min(5).max(10);

export async function createAccount(prevState: any, formData: FormData) {
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
  const result = formSchema.safeParse(data); //safePars는 에러를 throw하지 않는다.
  console.log(data);
  if (!result.success) {
    //console.log(result.error.flatten()); // 콘솔에서 에러를 볼 수도 있다.
    // 여기서 return으로 에러를 보내면 page.tsx의 useFormState의 state로 return한 내용이 들어간다.

    return result.error.flatten();
  } else {
    // result.data 안에는 검증된 데이터도 있고, 변환된 데이터도 있다.
    console.log(result.data);
  }
}
