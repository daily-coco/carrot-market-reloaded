import FormInput from '@/components/form-input'
import FormButton from '@/components/form-btn'
import SocialLoign from '@/components/soial-login'

export default function createAcount() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
        <div className='flex flex-col gap-2 *:font-medium'>
            <h1 className='text-2xl'>안녕하세요!</h1>
            <h2 className='text-xl'>Fill in the form below to join!</h2>
        </div>
        <form className='flex flex-col gap-3'>
            <FormInput type="text" name="formAcccountName" placehoder='UserName' required={true} errors={['user name is short']}/>
            <FormInput type="email" name="formAcccountEamail" placehoder='Email' required={true} errors={['Eamil is short']}/>
            <FormInput type="password" name="formAccountPw" placehoder='Password' required={true} errors={['password name is short']}/>
            <FormInput type="password" name="formAccountPwChk" placehoder='Confirm password' required={true} errors={['password name is short']}/>
            <FormButton loading={false} text="Create Account" />
        </form>
        <SocialLoign/>

    </div>
  )
}