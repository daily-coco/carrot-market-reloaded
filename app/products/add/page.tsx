'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProduct } from './actions';
import { useFormState } from 'react-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductType } from './schema';
export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductType>({
    resolver: zodResolver(productSchema), //
  });

  const [file, setFile] = useState<File | null>(null);

  const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // console.log(event.target.files);
    const {
      target: { files },
    } = event;
    // file이 없을 수도 있기 때문에 if문을 추가하여 없는 케이스에 대한 처리
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file); /// URL을 생성한다.
    // ㄴ 이건 사용자 브라우저에서만 존재하고, 타인을 볼 수 없음
    // ㄴ URL은 파일이 업로드 된 메모리를 참조
    // 우리는 input file로 등록한 이미지의 url을 가져오는게 목표.
    // url이 필요한 이유는 등록한 이미지의 미리보기를 해 주기 위해서이다.
    // console.log(url); // 유저가 방금 업로드한 파일을 개발자가 볼 수 있도록 해 준다.
    // 즉, 업로드한 파일은 브라우저의 메모리에 저장이 되어있고, 새로고침할 때까지는 메모리에 살아 있다.

    setPreview(url);
    setFile(file);
  };
  // user가 form을 submit해서 Form의 action이 호출되면 const interceptAction 이 호출된다.
  // const interceptAction = (state, formData) => {};
  //   const interceptAction = (_: any, formData: FormData) => {
  //     const file = formData.get('photo');
  //     if (!file) {
  //       return;
  //     }
  //     setImageId(preview);

  //     const photoUrl = `${photoId}`;
  //     formData.set('photo', photoUrl);

  //     // uploadProduct Fuctiondmf return 해 주는게 중요하다!
  //     return uploadProduct(_, formData); // 11.5 7:30~8:10초 구간 대 코드 설명

  //     //upload image to cloudflar
  //     //replace 'photo' in formData
  //     // call upload proudct(uploadProduct)
  //   };
  // const [state, action] = useFormState(interceptAction, null);

  const [state, action] = useFormState(uploadProduct, null);
  //onValid에 들어오는 data는 validation을 마친 데이터
  // const onValid = (data: ProductType) => {};
  // 즉, onValid 함수가 호출된다는 건. 데이터 validation을 마쳤다는 것. react hook form은 자동으로 validation된 데이터를 여기에 넣을 것이다.

  // const onValid = async () => {
  //   await onSubmit()
  // };

  return (
    <div>
      <form
        // action={onValid}
        action={action}
        // onSubmit={handleSubmit(onValid)} // form의 validation이 성공했을 때 호출할 함수(onValid)
        // 🔥참고🔥 onValid는 validation이 끝난 데이터로 호출된다.
        className='p-5 flex flex-col gap-5'
      >
        <label
          htmlFor='photo'
          className='border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover'
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === '' ? (
            <>
              <PhotoIcon className='w-20' />
              <div className='text-neutral-400 text-sm'>
                사진을 추가해주세요.
                {/* {state?.fieldErrors.photo} */}
                {/* errors.photo?.message */}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type='file'
          id='photo'
          name='photo'
          accept='image/*'
          className='hidden'
        />
        <Input
          // register를 통해서 name이 추가 됨에 따른 name 속성 삭제
          // name='title'
          required
          placeholder='제목'
          type='text'
          {...register('title')}
          // errors={state?.fieldErrors.title}
          errors={[errors.title?.message ?? '']} // react hook form의  error를 처리한 위한 설계가 없기 때문에 배열로 만들고 그 안에서 if문으로 값을 처리해주는 꼼수를 살짝 써준다!
        />
        <Input
          // name='price'
          type='number'
          required
          placeholder='가격'
          {...register('price')}
          // errors={state?.fieldErrors.price}
          errors={[errors.price?.message ?? '']}
        />
        <Input
          // name='description'
          type='text'
          required
          placeholder='자세한 설명'
          {...register('description')}
          // errors={state?.fieldErrors.description}
          errors={[errors.description?.message ?? '']}
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}
