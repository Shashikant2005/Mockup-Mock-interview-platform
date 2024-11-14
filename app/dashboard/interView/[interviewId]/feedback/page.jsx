"use client"
import { db } from '@/utils/db'
import { UserAnswerSchema } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ChevronsUpDownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'


function Feedback({params}) {

  const [feedbackList , setfeedbackList] = useState([])
    useEffect(()=>{
      getFeedback()
    },[])
    
    const getFeedback =async ()=>{
          const result = await db.select().from(UserAnswerSchema)
          .where( eq(UserAnswerSchema.mockIdRef , params?.interviewId))
          .orderBy(UserAnswerSchema.id)

          console.log(result)
          setfeedbackList(result)
    }

     // Calculate total rating and average rating
  const totalRating = feedbackList.reduce((sum, item) => sum + item?.rating, 0)
  const averageRating = feedbackList.length > 0 ? (totalRating / feedbackList.length): 0

  return (
    <div className='p-10'>
        {
        feedbackList?.length==0 ? (<h2 className='font-bold textxl text-gray-500'>No feedback Record Found</h2>)
         : 
         (
         <>  
              <h2 className='text-3xl font-bold text-green-500'>Congratulation</h2>
              <h2  className='font-bold text-2xl'>Here is Your Interview Feedback</h2>
              <h2 className='text-primary text-lg my-3'>
              Your Overall Interview Rating: <strong>{averageRating}/</strong>
              </h2>
              <h2 className='text-sm text-gray-500'>Find Below Interview Question with Correct answer and your answer and feedback for improvement  </h2>
   
      
                { feedbackList  && feedbackList.map((item,index)=>{
                return(
                  <Collapsible key={index} className='mt-7'>
                      <CollapsibleTrigger className='p-2 flex justify-between bg-gray-200 rounded-lg my-2 text-left gap-7 w-full'>{item?.question} <ChevronsUpDownIcon className='h-5 w-5' /> </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className='flex flex-col gap-2'>
                          <h2 className='text-red-500 p-2 border rounded-lg'><strong>rating</strong> : {item?.rating}</h2>
                          <h2 className='p-2 border rounded-lg bg-red-50 text-sm text-red-900'><strong>Your Answer: </strong> : {item?.UserAns}</h2>
                          <h2 className='p-2 border rounded-lg bg-green-50 text-sm text-green-900'><strong>Correct Answer: </strong> : {item?.correctAns}</h2>
                          <h2 className='p-2 border rounded-lg bg-blue-50 text-sm text-primary'><strong>Feedback: </strong> : {item?.feedback}</h2>

                        </div>
                      </CollapsibleContent>    
                  </Collapsible>
                )
            })}
             </>
        )
       }
        

       
       <Link href='/dashboard'><Button>Go Home</Button></Link>  
    </div>
  )
}

export default Feedback