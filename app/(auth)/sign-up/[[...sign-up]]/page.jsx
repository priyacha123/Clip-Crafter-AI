import Image from 'next/image'
import login from '../../../../public/login.jpg'
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
        <div>
            <Image src={login} alt='login'
            className='w-full h-screen object-contain'/>
        </div>
        <div className='flex justify-center items-center'>
            <SignUp />
        </div>
    </div>
  )
}