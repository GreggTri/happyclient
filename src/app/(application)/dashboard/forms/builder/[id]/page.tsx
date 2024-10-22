"use server"

import { getSurvey } from "@/app/_data/survey"
import FormBuilder from "../../_formComponents/FormBuilder"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export default async function FormBuilderPage({ params }: {
    params: {
      id: string
    }
  }) {
  
    const surveyId = params.id
    const survey = await getSurvey(surveyId)
    
    console.log(survey);

    if(!survey){
      revalidatePath('/dashboard/forms')
      redirect('/dashboard/forms')
    };

    if(survey.surveyState !== "DRAFT"){
      revalidatePath('/dashboard/forms')
      redirect('/dashboard/forms')
    }
  
    return <FormBuilder survey={survey}/>
  }