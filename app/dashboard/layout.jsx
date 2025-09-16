import React from 'react'
import Header from './_components/Header'
import SideNav from './_components/SideNav'

const DashboardLayout = ({ children }) => {
  return (
    <>
    <div className='hidden md:block h-screen bg-white fixed mt-[75px]'>
      <SideNav />
    </div>
    <div>
    <Header />
    <div className='md:ml-64 p-5'>
        {children}
    </div>
    </div>
    </>
  )
}

export default DashboardLayout