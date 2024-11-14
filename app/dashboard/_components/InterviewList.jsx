"use client"
import { db } from '@/utils/db';
import { MockInterviewScheme } from '@/utils/schema';
import { useUser } from '@clerk/nextjs'
import { desc, eq } from 'drizzle-orm';
import React, { useEffect, useState } from 'react'
import Card from './Card';


function InterviewList() {

    const {user} = useUser();
    const [ interviewList , setinterviewList] = useState([])

    useEffect(()=>{
      user &&  GetInteviewList()
    },[user])

  async  function GetInteviewList (){      
        const result = await db.select().from(MockInterviewScheme)
        .where(eq(MockInterviewScheme.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(MockInterviewScheme.id))

        console.log(result)
        setinterviewList(result)
    }

  return (
    <div>
          <h2 className='font-medium text-xl'>
            Previus Mock Interviews
          </h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 my-3'>

            {interviewList  && interviewList.map((item,index)=>{
              return(
                 <Card item={item}></Card>
              )
            })}
          </div>
    </div>
  )
}

export default InterviewList