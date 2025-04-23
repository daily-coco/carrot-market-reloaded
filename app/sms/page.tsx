"use client";

import Input from '@/components/input';
import Button from '@/components/button';
import { useFormState } from 'react-dom';
import { smsVerification } from './actions';
import errorMap from 'zod/locales/en.js';

const initialState = {
  token:false,
  error:undefined,
}

export default function SMSLogin() {
  const [state, dispatch] = useFormState(smsVerification,initialState);
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>SMS Login</h1>
        <h2 className='text-xl'>Verify your phone numer.</h2>
      </div>
      <form action={dispatch} className='flex flex-col gap-3'>
        {state.token ? (
        <Input
          type='number'
          name="token"
          placeholder='Verification code'
          required={true}
          min={100000}
          max={999999}
        />
      ) :<Input
        type='text'
        placeholder='Phone Number'
        name="phone"
        required={true}
        errors={state?.error?.formErrors}
      />}
        <Button text={state.token ? "Verfiy token" : "Send Verification SMS"} />
      </form>
    </div>
  );
}
