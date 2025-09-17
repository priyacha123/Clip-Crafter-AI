import Image from 'next/image'
import React from 'react'
import logo from '../../../public/logo.jpg'
import { UserButton } from '@clerk/nextjs'
import { Button } from "../../../@/components/ui/button"
const Header = () => {
  return (
    <div className='p-3 px-5 flex items-center justify-between shadow-md '>
      <div className='flex gap-3 items-center'>
        <Image src={logo} alt='logo' width={50} height={50}/>
        <h2 className='font-bold text-xl'>AI Short video</h2>
      </div>
      <div className='flex gap-3 items-center'>
        <Button className="p-2" size={10} variant="secondary">Dashboard</Button>
        <UserButton />
      </div>
    </div>
  )
}

export default Header