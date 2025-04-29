// import { cookies } from 'next/headers';
// import { NextRequest, NextResponse } from 'next/server';
// import getSession from './lib/session';

// export async function middleware(request: NextRequest) {
//   // console.log(request.nextUrl.pathname); // url을 알려주는 string

//   // #request의 cookie를 얻어올 수도 있다.
//   // console.log(request.cookies.getAll());
//   // console.log(cookies());

//   // cookie를 저장함에 따라 getSession을 할 수 있음
//   const session = await getSession();
//   console.log(session);

//   const pathname = request.nextUrl.pathname;
//   if (pathname === '/') {
//     // 우리가 user에게 실제로 제공할 response를 가져와야함.
//     const response = NextResponse.next();
//     response.cookies.set('middleware-cookie', 'hello'); // 쿠키를 설정할 수 있다.
//     return response;
//   }

//   if (pathname === '/profile') {
//     // #Json Return하여 응답주기
//     // return Response.json({
//     //   error: 'you are not allowed here!',
//     // });
//     // #Redirect로 응답주기
//     return Response.redirect(new URL('/', request.url));
//   }
// }

// export const config = {
//   matcher: ['/', '/profile', '/create-account'],
// };

import { NextRequest, NextResponse } from 'next/server';
import getSession from './lib/session';

interface Routes {
  [key: string]: boolean;
}

// 인증되지 않은 user가 갈 수 있는 URL을 저장한다.
const publicOnlyUrls: Routes = {
  '/': true,
  '/login': true,
  '/sms': true,
  '/create-account': true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  //로그인 되지 않았다면 user가 이동하려는 url이나 pathname은 publicOnlyUrls object 안에 없다.
  const exists = publicOnlyUrls[request.nextUrl.pathname]; // false가 뜨면 ! => true : true가 되니 로그아웃 상태로 최종 체크
  if (!session.id) {
    //user가 로그인 상태가 아니라면
    if (!exists) {
      // publicOnlyUrls의 배열에 값이 없는
      // 즉, 로그아웃 상태를 뜻함
      return NextResponse.redirect(new URL('/', request.url));
    }
  } else {
    //로그인된경우라면?
    if (exists) {
      return NextResponse.redirect(new URL('/products', request.url));
    }
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
