'use client'

import React, { useCallback, useRef, useState, useTransition } from 'react'
import { FormElementInstance, FormElements } from '../../dashboard/forms/_formComponents/FormElements'
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/app/_components/icons';
import { submitSurveyData } from './formActions';

function FormSubmitComponent({token, surveyContent}: {token: string, surveyContent: FormElementInstance[]}) {
    
    const formValues = useRef<{ [key: string]: string}>({})
    const formErrors = useRef<{ [key: string]: boolean}>({})
    const [renderKey, setRenderKey] = useState(new Date().getTime())

    const [submitted, setSubmitted] = useState(false)
    const [pending, startTransition] = useTransition()

    const validateForm: () => boolean = useCallback(() => {
        for( const field of surveyContent){
            const actualValue = formValues.current[field.id] || "";
            const valid = FormElements[field.type].validate(field, actualValue)

            if(!valid){
                formErrors.current[field.id] = true
            }
        }
        
        if(Object.keys(formErrors.current).length > 0) {
            return false
        }
        
        return true;

    }, [surveyContent])

    const submitValue = (key: string, value: string) => {
        formValues.current[key] = value
    }

    const submitSurvey = async() => {
        formErrors.current = {}
        const validForm = validateForm();

        if(!validForm){
            setRenderKey(new Date().getTime());
            toast({
                title: "Error!",
                description: "Please check the form for errors. There may be required fields.",
                variant: "destructive",
                className: "bg-red-500 border-none"
            })
            return;
        }

        try{
            const jsonContent = JSON.stringify(formValues.current)
            const surveyDataResponse = await submitSurveyData(token, jsonContent)

            if(!surveyDataResponse){
                throw new Error("submitSurveyData Server Action failed.")
            }

            setSubmitted(true)
            
        } catch(error){
            toast({
                title: "Could not submit form!",
                description: "Something went wrong. Please let your law firm know!",
                variant: "destructive",
                className: "bg-red-500 border-none"
            })
        }
    }
  
    if(submitted) {
        return (
            <div className='flex flex-col justify-center w-full h-full items-center p-8'>
                <h1 className='text-2xl'>Form Submitted</h1>
                <span>Thank you for responding to our survey!</span>
                <span>You can close this page now.</span>
            </div>
        )
    }
    return (
        <div className='flex justify-center w-full h-full items-center p-8'>
            <div key={renderKey} className='max-w-[620px] flex flex-col gap-4 bg-background w-full p-8'>
                {surveyContent.map((element) => {
                    const FormElement = FormElements[element.type].formComponent;
                    return (
                        <FormElement 
                            key={element.id} 
                            elementInstance={element}
                            submitValue={submitValue}
                            isInvalid={formErrors.current[element.id]}
                            defaultValue={formValues.current[element.id]}
                        />
                    );
                })}
            </div>
            <Button 
                onClick={() => {
                    startTransition(submitSurvey)
                }}
                disabled={pending}
                className='mt-8'
            >
                {pending ? <Icons.spinner className='animate-spin' width={20} height={20}/> : "Submit"}
            </Button>
        </div>
    )
}

export default FormSubmitComponent