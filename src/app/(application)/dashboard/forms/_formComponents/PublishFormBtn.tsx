"use client";

import React, { useTransition } from "react";
import { publishSurvey } from "../actions";
import { Icons } from "@/app/_components/icons";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Button } from "@/components/ui/button";
import { MdOutlinePublish } from "react-icons/md";
import { toast } from "@/hooks/use-toast";
import useDesigner from "./hooks/UseDesigner";
import { useRouter } from "next/navigation";
interface PublishFormBtnProps {
  surveyId: string;
}

function PublishFormBtn({ surveyId }: PublishFormBtnProps) {
  const [loading, startTransition] = useTransition();
  const router = useRouter()
  const { elements } = useDesigner()

  async function publishFormClient(){

    try{

      if (elements.length <= 0) throw new Error("Empty Survey");
        
      const JsonElements = JSON.stringify(elements)
      const publishedSurvey = await publishSurvey(surveyId, JsonElements)

      if( publishedSurvey && 'id' in publishedSurvey){
            
        toast({
            title: "Successfully published survey!",
            description: `Survey ${publishedSurvey.surveyTitle} has been published.`,
            variant: "destructive",
            className: "bg-green-500 border-none"
        })

        router.refresh()
      } else {
        throw new Error("Failed to archive survey")
      }
    } catch(error){
      if (elements.length <= 0){
        toast({
          title: "Cannot publish an empty survey!",
          description: "Please add some elements to your survey before publishing!",
          variant: "destructive",
          className: "bg-red-500 border-none"
        })
      } else {
        toast({
          title: "Failed to publish survey!",
          description: "Something went wrong! Please try again later and/or contact support!",
          variant: "destructive",
          className: "bg-red-500 border-none"
        })
      }  
    }
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button className="bg-transparent border border-green-500 text-green-500 hover:bg-green-500 hover:text-WHITE">
          <MdOutlinePublish className="w-4 h-4"/>
          Publish
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to publish this survey?</AlertDialogTitle>
          <AlertDialogDescription className="text-WHITE/50">
            This actions means you can no longer edit your survey and it will be available to clients to collect submissions
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction 
          className="text-BLACK"
          disabled={loading} 
          onClick={(e) => {
            e.preventDefault()
            startTransition(publishFormClient)
          }}>
            {loading ? <Icons.spinner className="animate-spin" width={15} height={15}/> : "Proceed"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default PublishFormBtn;
