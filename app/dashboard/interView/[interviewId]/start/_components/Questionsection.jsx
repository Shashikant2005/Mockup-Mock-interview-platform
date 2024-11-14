import { LightbulbIcon, Volume2 } from 'lucide-react'
import React from 'react'

function Questionsection({mockinterviewQuestion,activequestionindex}) {

       const textToSpeech = (text)=>{
          if('speechSynthesis' in window){
            const speech =new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(speech)
          }
          else{
            alert("your browser Does not support this feature")
          }
       }
      

  return mockinterviewQuestion && (
    <div className='p-5 border rounded-lg my-10'>
        <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {
            mockinterviewQuestion && mockinterviewQuestion.map((question,index)=>{
               return (
                <h2 className={`p-2 border  rounded-full text-xs md:text-sm  text-center cursor-pointer ${activequestionindex==index && "bg-blue-600 text-white"}`}>Question #{index+1}</h2>
               )

            })
            }
        </div>
        <h2 className='my-5 text-md md:test-lg'>{mockinterviewQuestion[activequestionindex]?.question}</h2>
        
        <Volume2 className='cursor-pointer' onClick={()=>textToSpeech(mockinterviewQuestion[activequestionindex]?.question)}/>
        
        <div className='border rounded-lg p-5 bg-blue-100 mt-20'>
            <h2 className='flex gap-2 items-center text-primary'>
                <LightbulbIcon/>
                <strong>Note:</strong>
            </h2>
            <h2 className='text-sm text-primary my-2'> To start your mock interview, click the **"Enable Webcam"** button. Allow access to your webcam when prompted by your browser. Once your webcam is active, you'll see your video feed. If you need to stop the webcam, just click the **"Close Webcam"** button.</h2>
        </div>
    </div>
  )
}

export default Questionsection