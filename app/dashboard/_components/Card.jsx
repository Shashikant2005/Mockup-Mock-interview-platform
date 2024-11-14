"use client"
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

function Card({item}) {

    const router = useRouter()
  
    return (
        <div className='border shadow-sm rounded-lg p-3'>
            <h2 className='font-bold text-primary'>{item?.jobPosition}</h2>
            <h2 className='text-sm text-gray-600'>{item?.jobExperience} Years of Experience</h2>
            <h2 className='text-xs text-gray-600'>Created At: {item?.createdAt}</h2>
            <div className='flex justify-between mt-2 gap-5'>
   
              <Button size="sm" variant='outline' className='w-full' onClick={()=>router.replace(`/dashboard/interView/${item?.mockId}/feedback`)}>FeedBack</Button> 
              <Button onClick={()=>router.replace(`/dashboard/interView/${item?.mockId}`)} size="sm"  className='w-full' >Start</Button>
            </div>
        </div>
  )
}

export default Card



