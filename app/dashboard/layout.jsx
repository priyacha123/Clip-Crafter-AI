'use client'

import React, { useState } from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'
import { VideoDataContext } from 'app/_context/VideoDataContext'

const DashboardLayout = ({ children }) => {
  const [videoData, setVideoData] = useState()
  return (
    <>
    <VideoDataContext.Provider value={{videoData, setVideoData}}>

    <div className='hidden md:block h-screen bg-white fixed mt-[75px]'>
      <SideNav />
    </div>
    <div>
    <Header />
    <div className='md:ml-64 p-5'>
        {children}
    </div>
    </div>
    </VideoDataContext.Provider>
    </>
  )
}

export default DashboardLayout