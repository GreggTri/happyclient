"use client"

import React, { useTransition } from 'react'
import { Icons } from "@/app/_components/icons";
import { archiveSurvey } from '../actions';
import { toast } from "@/hooks/use-toast"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useRouter } from 'next/navigation';

function ArchiveSurveyBtn({surveyId}: {surveyId: string}) {
  const [loading, startTransition] = useTransition();
  const router = useRouter()
  
  const onSubmit = async () => {
    try {
    
      const archivedSurvey = await archiveSurvey(surveyId);

      if( archivedSurvey && 'id' in archivedSurvey){
        
        toast({
            title: "Successfully archived survey!",
            description: `Survey ${archivedSurvey.surveyTitle} has been archived.`,
            variant: "destructive",
            className: "bg-green-500 border-none"
        })

        router.refresh()
      } else {
        throw new Error("Failed to archive survey")
      }
      
    } catch (error) {
      toast({
        title: "Failed to archive survey!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger>
        <span className="hover:bg-red-500 hover:text-WHITE hover:rounded-md p-1 text-red-500">Archive</span>
      </AlertDialogTrigger>

      <AlertDialogContent>
        
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to archive this survey?</AlertDialogTitle>
          <AlertDialogDescription>This will unpublish your survey and not allow any edits. <br /> You will not be allowed to unarchive this survey.</AlertDialogDescription>
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

export default ArchiveSurveyBtn