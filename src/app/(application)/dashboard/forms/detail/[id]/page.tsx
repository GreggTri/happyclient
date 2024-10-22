'use server'

import { getSurveyDetails } from "@/app/_data/survey";
import FormDetailComponent from "./FormDetailComponent";

interface SurveyPageProps {
  params: { id: string };
}

export default async function FormDetailPage({ params }: SurveyPageProps) {
  const surveyId = params.id;
  const survey = await getSurveyDetails(surveyId);

  if (!survey || survey.surveyState === "DRAFT") {
    return <div>Survey not found or not available.</div>;
  }

  return <FormDetailComponent survey={survey}/>;
}
