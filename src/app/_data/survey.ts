import { cache } from "react";
import { verifySession } from "../_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";

export const getOrgSurveys = cache(async(q: string, page: number) => {
    const session = await verifySession(false) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const ITEM_PER_PAGE = 5;

    try{

        const getOrg = await prisma.org.findUnique({
            where: {
                id: String(session.tenantId)
            },
            select: {
                id: true,
                companyName: true
            }
        })

        const count = await prisma.survey.count({
            where: {
                surveyTitle: {
                    contains: q,
                    mode: 'insensitive'
                },
                org: {
                    id: String(session.tenantId)
                }
            }
        })

        const getOrgSurveys = await prisma.survey.findMany({
            where: {
                surveyTitle: {
                    contains: q,
                    mode: 'insensitive'
                },
                org: {
                    id: String(session.tenantId)
                }
            },
            select: {
                id: true,
                surveyTitle: true,
                surveyDescription: true,
                surveyState: true,
                createdAt: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (page - 1)
        })

        revalidatePath('/dashboard/forms')

        return {success: true, count, getOrg, getOrgSurveys};

    } catch(error){
        console.log(error);

        return {
            success: false,
            count: 0,
            error: error,
            message: "Something went wrong! Contact support!"
        }
    }

})


export const getSurvey = cache(async(surveyId: string) => {

    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    try{
        if(surveyId){
            const surveyData = await prisma.survey.findUnique({
                where: {
                    id: surveyId,
                    org: {
                        id: String(session.tenantId)
                    },
                    surveyState: "DRAFT"
                }
            })
            
            return surveyData;
        }
        
    } catch(error){
        console.log(error);
        throw new Error('Could not get Survey Data')
    }
})