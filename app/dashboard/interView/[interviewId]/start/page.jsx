"use client"
import { db } from '@/utils/db'
import { MockInterviewScheme } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import Questionsection from './_components/Questionsection'
import Recoredanswer from './_components/Recoredanswer'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'


function StartInterview({params}) {

    const [ interviewdata ,setinterviewdata] = useState()
    const [ mockinterviewQuestion ,setmockinterviewQuestion] = useState()
    const[activequestionindex,setactivequestionindex] = useState(0)
    const router = useRouter()

    useEffect(()=>{
        GetInterviewDetails()
    },[])

    const nextQuestion = () => {
      setactivequestionindex(prev => prev + 1)
  };

    const GetInterviewDetails = async () => {
        const result = await db.select().from(MockInterviewScheme)
          .where(eq(MockInterviewScheme.mockId, params.interviewId));
      
          const jsonMockresp = JSON.parse(result[0].jsonMockResp)
          console.log(jsonMockresp)
          setinterviewdata(result[0])
          setmockinterviewQuestion(jsonMockresp)
      };
  return (
    <div>
         <div className='grid grid-cols-2 md:grid-col-2 lg:grid-col-2 gap-10'>
         {/* <div className='flex flex-col gap-10 md:flex-row'> */}
            {/* Questions */}
            <Questionsection activequestionindex={activequestionindex} mockinterviewQuestion={mockinterviewQuestion} />


            {/* Video + Audio recording */}
            <Recoredanswer nextQuestion={nextQuestion}  interviewdata={interviewdata} activequestionindex={activequestionindex} mockinterviewQuestion={mockinterviewQuestion}/>

         </div>

         <div className='flex justify-end gap-6'>
         { activequestionindex>0 && <Button onClick={()=>setactivequestionindex(activequestionindex-1)}>Prev Question</Button>}
        {  activequestionindex!=mockinterviewQuestion?.length-1 && <Button onClick={()=>nextQuestion()}>Next Question</Button>}
        { activequestionindex==mockinterviewQuestion?.length-1 &&<Button onClick={()=>router.replace('/dashboard/interView/'+interviewdata?.mockId+"/feedback")}>End Interview</Button>}
         </div>
    </div>
  )
}

export default StartInterview