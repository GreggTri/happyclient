"use server"

import { getSurvey } from "@/app/_data/survey";
import FormBuilder from "../../formComponents/FormBuilder";

export default async function FormBuilderPage({ params }: {
  params: {
    id: string
  }
}) {

  const surveyId = params.id
  const surveyData = await getSurvey(surveyId)


  return <FormBuilder surveyData={surveyData}/>
}
