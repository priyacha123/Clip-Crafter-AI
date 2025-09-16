'use client'

import { CircleUser, FileVideo, PanelsTopLeft, ShieldPlus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const SideNav = () => {
    const path = usePathname();
    console.log(path);

    const MenuOption = [
        {
            id:1,
            name:'Dashboard',
            path:'/dashboard',
            icon:PanelsTopLeft
        },
        {
            id:2,
            name:'Create New',
            path:'/dashboard/create-new',
            icon:FileVideo,
        },
        {
            id:3,
            name:'Upgrade',
            path:'/upgrade',
            icon:ShieldPlus,
        },
        {
            id:4,
            name:'Account',
            path:'/account',
            icon:CircleUser,
        },
    ]
  return (
    <div className='w-60 h-screen shadow-md p-5'>
        <div className='grid gap-3'>
            {MenuOption.map((item, index) => {
                return (
            <Link href={item.path}  key={index}>
                <div className={`flex gap-3 p-3 items-center hover:bg-primary hover:text-white rounded-md cursor-pointer
                ${path == item.path && 'bg-primary text-white'}`}>
                    <item.icon />
                    <h2>{item.name}</h2>
                </div> 
            </Link>
                )})}
        </div>
    </div>
  )
}

export default SideNav