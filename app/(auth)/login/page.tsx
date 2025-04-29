'use client';

import Input from '@/components/input';
import Button from '@/components/button';
import SocialLoign from '@/components/soial-login';
import { useFormState } from 'react-dom';
import { login } from './actions';
import { PASSWORD_MIN_LENGTH } from '@/lib/constants';

export default function Login() {
  const [state, dispatch] = useFormState(login, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Log in with email and password</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        <Input
          type='email'
          name='loginEmail'
          placeholder='Email'
          required={true}
          errors={state?.fieldErrors.loginEmail}
        />
        <Input
          type='password'
          name='loginPassword'
          placeholder='Password'
          required={true}
          minLength={PASSWORD_MIN_LENGTH}
          errors={state?.fieldErrors.loginPassword}
        />
        <Button text='Create Account' />
      </form>
      <SocialLoign />
    </div>
  );
}
