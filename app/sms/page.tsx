import FormInput from '@/components/form-input'
import FormButton from '@/components/form-btn'
import SocialLoign from '@/components/soial-login'

export default function SMS() {
  return (
    <div className='flex flex-col gap-10 py-8 px-6'>
        <div className='flex flex-col gap-2 *:font-medium'>
            <h1 className='text-2xl'>SMS Login</h1>
            <h2 className='text-xl'>Verify your phone numer.</h2>
        </div>
        <form className='flex flex-col gap-3'>
            <FormInput type="number"  name="inputSMS" placehoder='Phone Number' required={true} errors={['']}/>
            <FormInput type="number"  name="inputSMSChk" placehoder='Verification code' required={true} errors={['']}/>
            <FormButton loading={false} text="Verify" />
        </form>
    </div>
  )
}