import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

export async function middleware(request: NextRequest) {
  // console.log(request.nextUrl.pathname); // url을 알려주는 string

  // #request의 cookie를 얻어올 수도 있다.
  // console.log(request.cookies.getAll());
  // console.log(cookies());

  // cookie를 저장함에 따라 getSession을 할 수 있음
  const session = await getSession();
  console.log(session);

  const pathname = request.nextUrl.pathname;

  if (pathname === '/') {
    // 우리가 user에게 실제로 제공할 response를 가져와야함.
    // const response = NextResponse.next();
  }

  if (pathname === '/profile') {
    // #Json Return하여 응답주기
    // return Response.json({
    //   error: 'you are not allowed here!',
    // });
    // #Redirect로 응답주기
    return Response.redirect(new URL('/', request.url));
  }
}
