'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLoign from '@/components/soial-login';
import { useFormState } from 'react-dom';
import { createAccount } from './actions';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function CreateAcountForm() {
  const [state, action] = useFormState(createAccount, null);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Fill in the form below to join!</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <Input
          type='text'
          name='formAcccountName'
          placeholder='UserName'
          required={true}
          minLength={3}
          maxLength={10}
          errors={state?.fieldErrors.formAcccountName}
        />
        <Input
          type='email'
          name='formAcccountEamail'
          placeholder='Email'
          required={true}
          errors={state?.fieldErrors.formAcccountEamail}
        />
        <Input
          type='password'
          name='formAccountPw'
          placeholder='Password'
          required={true}
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.formAccountPw}
        />
        <Input
          type='password'
          name='formAccountPwChk'
          placeholder='Confirm password'
          required={true}
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.formAccountPwChk}
        />
        <Button text='Create Account' />
      </form>
      <SocialLoign />
    </div>
  );
}
