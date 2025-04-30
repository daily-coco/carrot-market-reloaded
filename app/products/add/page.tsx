'use client';

import Button from '@/components/button';
import Input from '@/components/input';
import { PhotoIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';
import { uploadProduct } from './actions';
import { useFormState } from 'react-dom';

export default function AddProduct() {
  const [preview, setPreview] = useState('');
  const [photoId, setImageId] = useState('');

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
  return (
    <div>
      <form action={action} className='p-5 flex flex-col gap-5'>
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
          name='title'
          required
          placeholder='제목'
          type='text'
          errors={state?.fieldErrors.title}
        />
        <Input
          name='price'
          type='number'
          required
          placeholder='가격'
          errors={state?.fieldErrors.price}
        />
        <Input
          name='description'
          type='text'
          required
          placeholder='자세한 설명'
          errors={state?.fieldErrors.description}
        />
        <Button text='작성 완료' />
      </form>
    </div>
  );
}
