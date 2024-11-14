"use client"
import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

function Header() {

      const path = usePathname();
      
      useEffect(()=>{

      },[])

  return (
    <div className='flex p-4 items-center justify-between bg-secondary shadow-sm'>
        <Image src={"/CourseGenLogo.png"} width={160} height={100} alt='logo'/>
        <ul className='hidden md:flex gap-6'>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard'  && 'text-primary'}`} >Dashboard</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/Questions'  && 'text-primary'}`}>Questions</li>
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/Upgrade'  && 'text-primary'}`}>Upgrade</li>  
            <li className={`hover:text-primary hover:font-bold transition-all cursor-pointer ${path=='/dashboard/HowitWorks'  && 'text-primary'}`}>How it Works?</li>
        </ul>
        <UserButton/>
    </div>
  )
}

export default Header