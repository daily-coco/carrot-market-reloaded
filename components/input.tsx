import { InputHTMLAttributes } from 'react';

interface IInputProps {
  // type: string;
  // placeholder: string;
  // required: boolean;
  name: string; //typescript 유효성 검사를  이용하여 개발자의 입력 누락 방지 실수를 줄이기 위해 남겨둔다.
  errors?: string[]; // string 타입의 배열로 지정하는 것은 에러가 여러개일 수도 있기 때문에
}

export default function Input({
  // type,
  // placeholder,
  // required,
  //name,
  errors = [],
  ...rest // input의 나머지 props 전부를 rest에 담기
}: IInputProps & InputHTMLAttributes<HTMLInputElement>) {
  // console.log(rest);
  return (
    <div className='flex flex-col gap-2'>
      <input
        // type={type}
        // name={name}
        // placeholder={placeholder}
        // required={required}
        {...rest}
        className='px-2 bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-4 ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400'
      />
      {errors?.map((error, index) => (
        <span key={index} className='text-red-500 font-medium'>
          {error}
        </span>
      ))}
    </div>
  );
}
