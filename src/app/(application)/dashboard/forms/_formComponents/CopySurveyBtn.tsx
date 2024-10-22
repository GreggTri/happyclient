"use client"

import React, { useTransition } from 'react'
import { Icons } from "@/app/_components/icons";
import { copySurvey } from '../actions';
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

function CopySurveyBtn({surveyId}: {surveyId: string}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter()

  const onSubmit = async () => {
    try {
    
      const copiedSurvey = await copySurvey(surveyId);

      if( copiedSurvey && 'id' in copiedSurvey){
        
        toast({
            title: "Copy of survey was successful!",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-green-500 border-none"
        })

        router.refresh()
      } else {
        throw new Error("Survey Creation Failed")
      }
      
    } catch (error) {
      toast({
        title: "Failed to create survey copy!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <span className="hover:bg-WHITE/20 hover:rounded-md p-1">Copy</span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to copy this survey?</AlertDialogTitle>
          <AlertDialogDescription>This action will create an exact copy of the currently selected survey as a draft.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          className="text-BLACK"
          disabled={loading} 
          onClick={(e) => {
            e.preventDefault()
            startTransition(onSubmit)
          }}>
            {loading ? <Icons.spinner className="animate-spin" width={15} height={15}/> : "Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
)
}

export default CopySurveyBtn
//Are you sure you want to copy this survey?