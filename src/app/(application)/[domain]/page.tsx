'use server'

import { getSurvey } from "@/app/_data/survey";
import FormSubmitComponent from "./FormSubmitComponent";

interface SurveyPageProps {
  params: { token: string };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const token = params.token;

  if(!token) return 

  const surveyContent = await getSurveyContentFromToken(token);

  if (!surveyContent || !surveyContent.isPublished) {
    return <div>Survey not found or not available.</div>;
  }

  return (
    <FormSubmitComponent token={token} surveyContent={surveyContent}/>
  );
}
