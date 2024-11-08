'use server'


import { getSurveyContentFromToken } from "@/app/_data/survey";
import FormSubmitComponent from "./FormSubmitComponent";
import { ElementsType } from "../../../dashboard/forms/_formComponents/FormElements";

interface SurveyPageProps {
  params: { token: string };
}

export default async function SurveyPage({ params }: SurveyPageProps) {
  const token = params.token;
  console.log(token);
  if(!token) return <div>Could not load your survey!</div>;

  const surveyContent = await getSurveyContentFromToken(token);

  if (!surveyContent || surveyContent.surveyState !== "PUBLISHED") {
    return <div>Survey not found or not available.</div>;
  }

  //this is to transform fields to what FormElementInstance needs it to be
  const transformedSurveyContent = surveyContent.surveyFields.map(field => {
    const { id, fieldType, ...otherAttributes } = field;

    // Create `extraAttributes` by including only properties that are not `null` or `undefined`
    const extraAttributes = Object.fromEntries(
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        Object.entries(otherAttributes).filter(([_, value]) => value !== null && value !== undefined)
    );

    return {
        id,
        type: fieldType as ElementsType, // Mapping `fieldType` to `type`
        extraAttributes
    };
  });

  return (
    <FormSubmitComponent token={token} surveyContent={transformedSurveyContent}/>
  );
}
