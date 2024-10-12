"use client";

import React, { useTransition } from "react";
import { saveSurvey } from "../actions";
import useDesigner from "./hooks/UseDesigner";
import { Button } from "@/components/ui/button";
import { HiSaveAs } from 'react-icons/hi'
import { toast } from "@/hooks/use-toast";
import { Icons } from "@/app/_components/icons";

function SaveFormBtn({ surveyId }: { surveyId: string }) {

  const { elements } = useDesigner()
  const [loading, startTransition] = useTransition();

  const updateSurveyContent = async () => {
    try {
      
      const JsonElements = JSON.stringify(elements)
      const savedSurvey = await saveSurvey(surveyId, JsonElements)

      if( savedSurvey && 'id' in savedSurvey){
  
        toast({
          title: "Success!",
          description: `Survey: ${savedSurvey.surveyTitle} has been saved!`,
          variant: "destructive",
          className: "bg-green-500 border-none"
        })

      } else {
        throw new Error("Something went wrong!")
      }

    } catch(error){
      
      toast({
        title: "Error: Survey couldn't be saved!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  }
  return (
    <Button 
      variant={'outline'} 
      className="gap-2 border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-WHITE"
      disabled={loading}
      onClick={() => {
        startTransition(updateSurveyContent)
      }}
    >
      {loading ? 
        <Icons.spinner className='animate-spin' width={15} height={15}/> 
      : 
        <>
          <HiSaveAs className="h-4 w-4"/>
          <span>Save</span>
        </>
      }
    </Button>
  );
}

export default SaveFormBtn;
