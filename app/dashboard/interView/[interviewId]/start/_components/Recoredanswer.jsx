import { Button } from '@/components/ui/button'
import { db } from '@/utils/db';
import { chatSession } from '@/utils/GeminiAiModel';
import { UserAnswerSchema } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import { Mic } from 'lucide-react';
import moment from 'moment/moment';
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import useSpeechToText from 'react-hook-speech-to-text';
import Webcam from 'react-webcam'
import { toast, Toaster } from 'sonner';


function Recoredanswer({nextQuestion, activequestionindex, mockinterviewQuestion, interviewdata }) {
  const [userAnswer, setuserAnswer] = useState('')
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  
  const {
    error,
    interimResult,
    isRecording,
    results,
    setResults,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    // Concatenate results to form the final user answer
    results?.map((result) => {
      setuserAnswer((prevans) => prevans + result?.transcript)
    })
  }, [results])

  useEffect(() => {
    // When user answer is recorded, store it in the database after the user stops recording
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnwerInDB()
    }
  }, [userAnswer])


  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText()
    } else {
      startSpeechToText()
    }
  }

  const cleanMarkdown = (text) => {
    if (!text) return "";
    
    // Remove markdown for **bold**, *italic*, and lists with *
    return text
      .replace(/\*\*(.*?)\*\*/g, '$1')   // Remove bold (**text**)
      .replace(/\*(.*?)\*/g, '$1')       // Remove italic (*text*)
      .replace(/[\*\-]\s+/g, '')         // Remove list bullet points (* or -)
      .replace(/<\/?[^>]+(>|$)/g, "");    // Remove HTML tags (if any)
  };

 

  const UpdateUserAnwerInDB = async () => {
        console.log(userAnswer)
        setLoading(true)

        const feedbackPrompt = `Question:${mockinterviewQuestion[activequestionindex]?.question}, User answer:${userAnswer} Depends on question and answer for given interview question please give us rating ans answer and feedback as area of improvement if any in just 3 to 5 line to improve it in JSON format with rating field and feedback field`

        const result = await chatSession.sendMessage(feedbackPrompt)

        const mockjsonresp = (result.response.text()).replace(/```json|```/g, '');
        console.log(mockjsonresp)

        const jsonFeedbackresp = JSON.parse(mockjsonresp)

        const cleanedUserAnswer = cleanMarkdown(userAnswer);
        const cleanedFeedback = cleanMarkdown(jsonFeedbackresp?.feedback);
        const cleanedQuestion = cleanMarkdown(mockinterviewQuestion[activequestionindex]?.question);
        const cleanedCorrectAnswer = cleanMarkdown(mockinterviewQuestion[activequestionindex]?.answer);
      

        console.log(mockinterviewQuestion[activequestionindex])

        const resp = await db.insert(UserAnswerSchema).values({
          mockIdRef: interviewdata?.mockId,
          question: cleanedQuestion,  // Cleaned question
          correctAns: cleanedCorrectAnswer, // Cleaned correct answer
          UserAns: cleanedUserAnswer, // Cleaned user answer
          feedback: cleanedFeedback,   // Cleaned feedback
          rating: jsonFeedbackresp?.rating,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          createdAt: moment().format('DD-MM-yyyy'),
    })

    if (resp) {
      toast("Saved user answer successfully")
      console.log("Saved successfully")
      setResults([])
    // Clear user answer after saving
     setuserAnswer('')
    }
     
    setResults([])
    setLoading(false)
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col mt-5 justify-center items-center rounded-lg p-5 bg-black'>
        <Image className='absolute' src={'/webcam.avif'} height={200} width={200} alt='webcam' />
        <Webcam mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>
      <Button disabled={loading} onClick={() => StartStopRecording()} variant='outline' className='my-5'>
        {isRecording ? (<h2 className='flex justify-between gap-2 items-center text-red-500'><Mic></Mic> Recording</h2>) : (<h2>Record Answer</h2>)}
      </Button>
    </div>
  )
}

export default Recoredanswer
