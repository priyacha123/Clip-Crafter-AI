'use client'

import { useState } from 'react'
import { EmptyState } from './_components/EmptyState'
import Link from 'next/link';
import { Button } from '@/components/ui/button';


export default function page() {
  const [videoList, setVideoList] = useState([]);
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Dashboard</h2>
         <Link href={'/dashboard/create-new'}>
        <Button>Create New</Button>
        </Link>
      </div>

      {videoList?.length == 0 && <div>
      <EmptyState />   
      </div> }
    </div>
  )
}

 