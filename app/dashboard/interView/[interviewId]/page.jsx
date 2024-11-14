"use client"
import { Button } from '@/components/ui/button'
import { db } from '@/utils/db'
import { MockInterviewScheme } from '@/utils/schema'
import { eq } from 'drizzle-orm'
import { Lightbulb, WebcamIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import Webcam from "react-webcam";

function Page({ params }) {
  const [interviewData, setInterviewData] = useState(null);
  const [isOpenWebcam, setIsOpenWebcam] = useState(false);

  const path = usePathname()
  useEffect(() => {
    GetInterviewDetails();
  }, []);

  // Used to get MockInterview details
  const GetInterviewDetails = async () => {
    const result = await db.select().from(MockInterviewScheme)
      .where(eq(MockInterviewScheme.mockId, params.interviewId));
    setInterviewData(result[0]);
  };

  return (
    <div className='my-10 '>
      <h2 className='font-bold text-2xl'>Let's Get Started</h2>
      
      <div className='grid  grid-cols-1 md:grid-cols-2 gap-10'>

           {/* information div */}
           <div className='flex flex-col my-5 gap-5 '>

              <div className='flex flex-col  p-5 rounded-lg border gap-5'>
                <h2 className='text-lg'><strong>Job Role/ Job Position: </strong>{interviewData?.jobPosition}</h2>
                <h2 className='text-lg'><strong>Job Description/ Tech Stack: </strong>{interviewData?.jobDescription}</h2>
                <h2 className='text-lg'><strong>Years of Experience: </strong>{interviewData?.jobExperience}</h2>
               </div>
               <div className='p-5 border rounded-lg border-yellow-300 bg-yellow-200'>
                   <h2 className='flex gap-2 items-center text-yellow-600'><Lightbulb/> <strong>Information</strong></h2> 
                    <h2 className='mt-3 text-yellow-700'> To start your mock interview, click the **"Enable Webcam"** button. Allow access to your webcam when prompted by your browser. Once your webcam is active, you'll see your video feed. If you need to stop the webcam, just click the **"Close Webcam"** button.</h2>
               </div>

           </div>

            {/* camera div */}
          <div>
            {isOpenWebcam ? (
              <>
                <Webcam style={{ height: 300, width: 300 }} onUserMedia={()=>setIsOpenWebcam(true)} onUserMediaError={()=>setIsOpenWebcam(false)} mirrored={true}/>
                <Button variant='ghost' className="" onClick={() => setIsOpenWebcam(false)}>Close Webcam</Button>
              </>
            ) : (
              <>
                <WebcamIcon className='h-72 my-7 w-full p-20 bg-secondary rounded-lg border' />
                <Button variant='ghost' onClick={() => setIsOpenWebcam(true)}>Enable Webcam and Microphone</Button>
              </>
            )}
          </div>         
      </div>
      
      <div className='flex justify-end items-end'>
         <Link href={path+'/start'}> <Button className>Start Interview</Button> </Link>
      </div>
     
     
    </div>
  );
}

export default Page;
