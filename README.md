# Nomad Carrot Market

## 프로젝트 소개

노마드코더 리액트 챌린지 7기 - 캐럿마켓 클론코딩 실습용 프로젝트

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38bdf8)

## 기술 스택

- **프레임워크**: Next.js 14 (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS

## 설치 및 실행 방법

```
// # 저장소 클론
git clone [repository-url]
npx create-next-app@14
// # 라이브러리 설치
npm install @heroicons/react
npm i zod
npm i validator
npm i @types/validator
```

## 프로젝트 구조

```
app/
├── create-account/    # 계정 생성 페이지
│   └── page.tsx       # 계정 생성 페이지 컴포넌트
├── login/             # 로그인 페이지
│   └── page.tsx       # 로그인 페이지 컴포넌트
├── globals.css        # 전역 스타일
├── package.json       # 프로젝트 의존성 정보
└── package-lock.json  # 의존성 버전 잠금 파일
```

## 브랜치 전략 및 커밋 컨벤션

```
feat: 새로운 기능 추가
fix: 버그 수정
docs: 문서 변경
style: 코드 포맷팅, UI 스타일 변경
refactor: 코드 리팩토링
test: 테스트 코드 추가/수정
chore: 빌드 프로세스, 패키지 매니저 설정 등 변경
```

## Setting

```
npm i zod
// 최신 버전 (6.6.0 - 250424 기준 )
npm i prisma
npx prisma init

//다운그레이 진행 시
npm uninstall @prisma/client prisma

npm install @prisma/client@5.10.0 prisma@5.10.0
npx prisma init


// migration
npx prisma migrate dev

// Prisma Studio
npx prisma studio

//
npm i bcrypt
npm i @types/bcrypt

npm i iron-session
```

### 라이브러리

🔥비밀번호 생성기
1password password generator
ㄴhttps://1password.com/password-generator

## 라이센스

MIT

## Writer

coco
