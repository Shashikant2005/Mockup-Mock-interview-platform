"use client"
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {v4 as uuidv4} from "uuid"
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { chatSession } from '@/utils/GeminiAiModel';
import { LoaderCircle } from 'lucide-react';
import { db } from '@/utils/db';
import { MockInterviewScheme } from '@/utils/schema';
import { useUser } from '@clerk/nextjs';
import moment from 'moment/moment';
import { useRouter } from 'next/navigation';

function AddNewInterview() {
  const [openDialog, setOpenDialog] = useState(false);
  const [jobPosition, setJobposition] = useState('');
  const [jobDescription, setjobDescription] = useState('');
  const [jobExperience, setjobExperience] = useState();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [jsonResp , setjsonResp] = useState([])

  const {user} = useUser()
  const router = useRouter()
  const clearInputs = () => {
    setJobposition('');
    setjobDescription('');
    setjobExperience();
  };

  const onSubmit = async () => {
    // Reset error message
    setErrorMessage('');

    // Validation: Check for empty fields
    if (!jobPosition || !jobDescription || jobExperience < 0) {
      setErrorMessage('All fields are required. Please fill in the missing information.');
      return; // Stop the function if validation fails
    }

    setLoading(true);

    const inputPrompt = `Job Position: ${jobPosition}, Job Description: ${jobDescription}, Years of Experience: ${jobExperience}, Based on this information, please provide 5 interview questions with answers in JSON format.`;

    try {
      const result = await chatSession.sendMessage(inputPrompt);
      const mockQuesAnswers = result.response.text().replace(/```json|```/g, '');
      const parsedData = JSON.parse(mockQuesAnswers);

      console.log(parsedData); // Check the parsed data here
      setjsonResp(parsedData)

      //save in DB
   if(mockQuesAnswers){
      const resp =await db.insert(MockInterviewScheme)
      .values({
        mockId:uuidv4(),
        jsonMockResp:mockQuesAnswers,
        jobPosition:jobPosition,
        jobDescription:jobDescription,
        jobExperience:jobExperience,
        createdBy:user?.primaryEmailAddress?.emailAddress,
        createdAt:moment().format('DD-MM-yyyy')
      }).returning({mockId:MockInterviewScheme.mockId})

      if(resp) {
         router.replace('/dashboard/interView/'+resp[0]?.mockId)
      }
    }
      clearInputs();
      setOpenDialog(false); // Close the dialog on successful submission
    } 
    catch (error) {
      setErrorMessage('Failed to generate interview questions. Please try again.');
      console.error('Error during API call:', error);
    } 
    finally {
      setLoading(false);
    }
  };



  return (
    <div>
      <div 
        onClick={() => setOpenDialog(true)} 
        className='p-10 border rounded-lg bg-secondary hover:scale-105 hover:shadow-md cursor-pointer transition-all'
      >
        <h2 className='text-lg text-center'>+ Add New</h2>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='text-2xl'>Tell us more about your job interview</DialogTitle>
            <DialogDescription>
              <div>
                <h2>Add details about your job position/role, job description, and years of experience</h2>
                {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                <div className='mt-7 my-2'>
                  <label htmlFor="">Job role/Job position</label>
                  <Input 
                    placeholder='Ex. Full stack Developer' 
                    required 
                    value={jobPosition} 
                    onChange={(event) => setJobposition(event.target.value)} 
                  />
                </div>
                <div className='my-3'>
                  <label htmlFor="">Job Description/ Tech Stack (In Short)</label>
                  <Input 
                    required 
                    placeholder='Ex. React, Angular, SpringBoot, Firebase etc' 
                    value={jobDescription} 
                    onChange={(event) => setjobDescription(event.target.value)} 
                  />
                </div>
                <div className='my-3'>
                  <label htmlFor="">Years of Experience</label>
                  <Input 
                    required 
                    placeholder='Ex. 5' 
                    type="number" 
                    value={jobExperience} 
                    onChange={(event) => setjobExperience(Number(event.target.value))} 
                  />
                </div>
              </div>
              <div className='flex gap-5 justify-end'>
                <Button 
                  type='button' 
                  variant='ghost' 
                  onClick={() => setOpenDialog(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type='submit' 
                  disabled={loading} 
                  onClick={onSubmit}
                >
                  {loading ? <><LoaderCircle className='animate-spin' /> Generating from AI</> : 'Start Interview'}
                </Button>
              </div>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddNewInterview;
