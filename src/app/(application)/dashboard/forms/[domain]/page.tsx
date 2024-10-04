// app/surveys/[id]/page.tsx
import { getSurvey } from "@/app/_data/survey";
import ClientSurvey from "../formComponents/ClientSurvey";

interface SurveyPageProps {
  params: { id: string };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const surveyId = params.id;
  const survey = await getSurvey(surveyId);

  if (!survey || !survey.isPublished) {
    return <div>Survey not found or not available.</div>;
  }

  return <ClientSurvey survey={survey} />;
}
