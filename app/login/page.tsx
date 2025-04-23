import FormInput from '@/components/input';
import FormButton from '@/components/button';
import SocialLoign from '@/components/soial-login';
import { redirect } from 'next/navigation';
import { useFormState } from 'react-dom';
import { handleForm } from './action';

export default function Login() {
  const [state, action] = useFormState(handleForm, null);

  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
      <div className='flex flex-col gap-2 *:font-medium'>
        <h1 className='text-2xl'>안녕하세요!</h1>
        <h2 className='text-xl'>Log in with email and password</h2>
      </div>
      <form action={action} className='flex flex-col gap-3'>
        <FormInput
          type='email'
          name='formEmail'
          placehoder='Email'
          required={true}
          // errors={['']}
        />
        <FormInput
          type='password'
          name='formPassword'
          placehoder='Password'
          required={true}
          // errors={['']}
        />
        <FormButton text='Create Account' />
      </form>
      <SocialLoign />
    </div>
  );
}
