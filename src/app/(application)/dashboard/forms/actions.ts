"use server";

import "server-only"
import { prisma } from "@/utils/prisma";
import { z } from "zod";
import { verifySession } from "@/app/_lib/session";
import { revalidatePath } from "next/cache";


const createSurveyFormSchema = z.object({
  surveyTitle: z.string().min(2).max(100),
  surveyDescription: z.string().optional()
})

type createSurveySchemaType = z.infer<typeof createSurveyFormSchema>

export async function createSurvey(formData: createSurveySchemaType){

  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");

  const { surveyTitle, surveyDescription } = formData
  
  

  return await prisma.survey.create({
    data: {
      tenantId: String(session.tenantId),
      surveyTitle: surveyTitle,
      surveyDescription: surveyDescription
    }
  })
  
  
}

type Field = {
  id: string;
  type: string; // Corresponds to the fieldType in the schema (e.g., 'TextField', 'Checkbox')
  extraAttributes: {
    label: string;
    placeholder: string;
    helperText: string;
    required: boolean;
  };
};


export async function saveSurvey(id: string, jsonContent: string) {
  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");

  // Parse the JSON content to convert it into an object
  const data = JSON.parse(jsonContent);
  
  return await prisma.survey.update({
    where: {
      id: id,
      tenantId: String(session.tenantId)
    },
    data: {
      fields: {
        set: data.map((field: Field, index: number) => ({
          id: field.id,
          fieldQuestion: field.extraAttributes.label,
          fieldType: field.type,
          placeholder: field.extraAttributes.placeholder,
          helperText: field.extraAttributes.helperText,
          options: [], // You can map options here if needed
          required: field.extraAttributes.required,
          position: index
        }))
      }
    }
  });
  
}




//We done one more final save while publishing incase they missed a save beforehand
export async function publishSurvey(surveyId: string, jsonContent: string) {
  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");

  if(jsonContent.length < 3) throw Error("empty fields")

  // Parse the JSON content to convert it into an object
  const data = JSON.parse(jsonContent);

  return await prisma.survey.update({
      where: { id: surveyId, tenantId: String(session.tenantId) },
      data: {
        surveyState: "PUBLISHED",
        fields: {
          set: data.map((field: Field, index: number) => ({
            id: field.id,
            fieldQuestion: field.extraAttributes.label,
            fieldType: field.type,
            placeholder: field.extraAttributes.placeholder,
            helperText: field.extraAttributes.helperText,
            options: [], // You can map options here if needed
            required: field.extraAttributes.required,
            position: index
          }))
        }
      },
    });
}

export async function archiveSurvey(surveyId: string){
  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");


  const archived = await prisma.survey.update({
      where: { id: surveyId, tenantId: String(session.tenantId) },
      data: {
        surveyState: "ARCHIVED"
      },
  });

  revalidatePath('/dashboard/forms')

  return archived
}



export async function copySurvey(surveyId: string){
  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");

  const originalSurvey = await prisma.survey.findUnique({where: { id: surveyId, tenantId: String(session.tenantId) }});

  if(!originalSurvey) throw new Error("Survey does not exist to copy")
  const copy = await prisma.survey.create({
    data: {
      tenantId: String(originalSurvey.tenantId),
      surveyTitle: originalSurvey.surveyTitle + " Copy",
      surveyDescription: originalSurvey.surveyDescription,
      fields: originalSurvey.fields,
      domain: originalSurvey.domain,
      backgroundColor: originalSurvey.backgroundColor,
      textColor: originalSurvey.textColor,
      primaryColor: originalSurvey.primaryColor

    }
  })

  revalidatePath('/dashboard/forms')
  return copy
}


const renameSurveyFormSchema = z.object({
  id: z.string(),
  surveyTitle: z.string().min(2).max(100),
  surveyDescription: z.string().optional()
})

type renameSurveySchemaType = z.infer<typeof renameSurveyFormSchema>

export async function renameSurvey(survey: renameSurveySchemaType){
  const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
  if (!session) return new Error("Unauthorized");

  const renamed = await prisma.survey.update({
    where: { id: survey.id, tenantId: String(session.tenantId) },
    data: {
      surveyTitle: survey.surveyTitle,
      surveyDescription: survey.surveyDescription
    },
  });

  revalidatePath('/dashboard/forms')
  return renamed
}