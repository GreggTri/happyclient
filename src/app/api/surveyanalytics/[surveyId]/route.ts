'use server'

import 'server-only'

import { nextResponse } from "next/server"
import { prisma } from "@/utils/prisma";


export async function GET(request: Request, context: any){
    const { params } = context;

    const surveyId: string = params.surveyId

    const surveyData = await prisma.surveyData.
}

