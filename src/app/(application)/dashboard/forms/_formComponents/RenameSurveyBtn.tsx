"use client"

import React from 'react'
import { Icons } from "@/app/_components/icons";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { renameSurvey } from '../actions';
import { toast } from "@/hooks/use-toast"
import { State } from '@prisma/client';

type StateType = keyof typeof State;
const renameSurveyFormSchema = z.object({
    id: z.string(),
    surveyTitle: z.string().min(2).max(100),
    surveyDescription: z.string().optional()
})
  
type renameSurveySchemaType = z.infer<typeof renameSurveyFormSchema>
interface Survey {
    id: string
    surveyTitle: string
    surveyDescription: string | null
    surveyState: StateType
    createdAt: Date
  }

function RenameSurveyBtn({survey}: {survey: Survey}) {
    
    const form = useForm<renameSurveySchemaType>({
        resolver: zodResolver(renameSurveyFormSchema),
        defaultValues: {
            id: survey.id,
            surveyTitle: survey.surveyTitle,
            surveyDescription: survey.surveyDescription || ""
        }
    })

    const onSubmit = async (data: renameSurveySchemaType) => {
        try {
          const renamedSurvey = await renameSurvey(data);

          if( renamedSurvey && 'id' in renamedSurvey){
            toast({
                title: "Success!",
                description: `Survey ${data.surveyTitle} was renamed to ${renamedSurvey.surveyTitle}`,
                variant: "destructive",
                className: "bg-green-500 border-none"
            })
          } else {
            throw new Error("Renaming survey failed!")
          }
          
        } catch (error) {
          toast({
            title: "Renaming survey failed!",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    };

  return (
    <Dialog>
        <DialogTrigger>
            <span className="hover:bg-WHITE/20 hover:rounded-md p-1">Rename</span>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Rename Survey</DialogTitle>
                <DialogDescription className='text-WHITE/50'>
                    Rename your survey before collecting responses
                </DialogDescription>
            </DialogHeader>

            <Form {...form}>
                <form className="space-y-2">
                <FormField
                    control={form.control}
                    name="id"
                    render={({field}) => (
                    <FormItem hidden>
                        <FormLabel>
                        </FormLabel>
                        <FormControl>
                            <Input {...field} defaultValue={survey.id}/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="surveyTitle"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Title
                        </FormLabel>
                        <FormControl>
                            <Input {...field} defaultValue={survey.surveyTitle}/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                <FormField
                    control={form.control}
                    name="surveyDescription"
                    render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Description
                        </FormLabel>
                        <FormControl>
                            <Textarea rows={5} {...field} defaultValue={survey.surveyDescription || ""}/>
                        </FormControl>
                    </FormItem>
                    )}  
                />
                </form>
            
                <DialogFooter>
                    <Button
                    disabled={form.formState.isSubmitting} 
                    className="mt-4 bg-primary text-BLACK w-full"
                    onClick={form.handleSubmit(onSubmit)}
                    >
                    {form.formState.isSubmitting ? <Icons.spinner className='animate-spin' height={15} width={15}/> : "Rename"}
                    </Button>
                </DialogFooter>
            </Form>
        </DialogContent>
    </Dialog>
)
}

export default RenameSurveyBtn