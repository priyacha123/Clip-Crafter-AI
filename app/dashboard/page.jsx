'use client'

import { useState } from 'react'
import { EmptyState } from './_components/EmptyState'
import { Button } from '../../components/ui/button';
import Link from 'next/link';


export default function page() {
  const [videoList, setVideoList] = useState();
  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='text-3xl font-bold'>Dashboard</h2>
         <Link href={'/dashboard/create-new'}>
        <Button>Create New</Button>
        </Link>
      </div>
      <EmptyState />
      

      {/* {videoList?.length === 0 && <div> */}
      {/* </div> } */}
    </div>
  )
}

 