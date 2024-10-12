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
import { createSurvey } from '../actions';
import { toast } from "@/hooks/use-toast"
import { useRouter } from 'next/navigation';

const createSurveyFormSchema = z.object({
    surveyTitle: z.string().min(2).max(100),
    surveyDescription: z.string().optional()
})
  
type createSurveySchemaType = z.infer<typeof createSurveyFormSchema>

function CreateSurveyBtn() {
    const router = useRouter();
    
    const form = useForm<createSurveySchemaType>({
        resolver: zodResolver(createSurveyFormSchema)
    })

    const onSubmit = async (data: createSurveySchemaType) => {
        try {
        
          const survey = await createSurvey(data);

          if( survey && 'id' in survey){
            router.push(`/dashboard/forms/builder/${survey.id}`)
          } else {
            throw new Error("Survey Creation Failed")
          }
          
        } catch (error) {
          toast({
            title: "Survey Creation failed!",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    };

  return (
    <Dialog>
        <DialogTrigger asChild>
        <Button variant={"outline"} className='flex flex-col h-full w-full p-10'>
            <Icons.FilePlus width={30} height={30} />
            <div className='text-lg font-bold'>
                Create A New Survey
            </div>
        </Button>
        </DialogTrigger>
        <DialogContent>
        <DialogHeader>
            <DialogTitle>Create Survey</DialogTitle>
            <DialogDescription>
            Create a new Survey to start collecting responses
            </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form className="space-y-2">
            <FormField
                control={form.control}
                name="surveyTitle"
                render={({field}) => (
                <FormItem>
                    <FormLabel>
                        Title
                    </FormLabel>
                    <FormControl>
                        <Input {...field}/>
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
                        <Textarea rows={5} {...field}/>
                    </FormControl>
                </FormItem>
                )}  
            />
            </form>
        </Form>
        <DialogFooter>
            <Button
            disabled={form.formState.isSubmitting} 
            className="mt-4 bg-primary text-BLACK w-full"
            onClick={form.handleSubmit(onSubmit)}
            >
            {form.formState.isSubmitting ? <Icons.spinner className='animate-spin' height={15} width={15}/> : "Create"}
            </Button>
        </DialogFooter>
        </DialogContent>
    </Dialog>
)
}

export default CreateSurveyBtn