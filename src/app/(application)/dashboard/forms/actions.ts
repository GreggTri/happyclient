"use server";

import { prisma } from "@/utils/prisma";

interface FieldData {
  fieldQuestion: string;
  fieldInputType: string;
  options: string[];
  position: number;
}

interface SurveyData {
  id?: string;
  surveyTitle: string;
  fields: FieldData[];
  backgroundColor: string;
  textColor: string;
  primaryColor: string;
}

export async function saveSurvey(data: SurveyData) {
  if (data.id) {
    await prisma.survey.update({
      where: { id: data.id },
      data: {
        surveyTitle: data.surveyTitle,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        primaryColor: data.primaryColor,
        fields: data.fields,  // Embed fields directly with `position`
      },
    });
    
  } else {
    await prisma.survey.create({
      data: {
        surveyTitle: data.surveyTitle,
        backgroundColor: data.backgroundColor,
        textColor: data.textColor,
        primaryColor: data.primaryColor,
        fields: data.fields,  // Embed fields directly with `position`
      },
    });
    
  }
}



export async function publishSurvey(surveyId: string) {
    await prisma.survey.update({
      where: { id: surveyId },
      data: {
        isPublished: true,
      },
    });
  }
  