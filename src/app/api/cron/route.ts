'use server'

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SurveySendGroup } from "@prisma/client";
import { generateToken } from "@/app/_lib/tokens";
import { Resend } from 'resend';
import FormLinkTemplate from "@/app/_components/emailTemplates/FormLinkTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest){
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
        status: 401,
        });
    }

    const orgs = await prisma.org.findMany()


    for(const org of orgs){

        const surveySendGroups = await prisma.surveySendGroup.findMany({
            where: {
              isArchived: false,
              tenantId: org.id
            }
        });
        
        // Filter groups that are scheduled for today based on scheduledSend or interval timing
        const todaySurveySendGroups = surveySendGroups.filter(group => isScheduledToday(group));

        const clientEmailsofGroups = await prisma.surveySendEmail.findMany({
            where: {
                surveySendGroupId: {
                    in: todaySurveySendGroups.map((group) => group.id)
                }
            }
        })
        
        for(const client of clientEmailsofGroups){

            const result = await prisma.$transaction(async (prisma) => {

                //get surveyGroup from todaySurveySendGroups where client.surveysendgroupId = group.id of todaySurveySendGroups 
                const surveyGroup = todaySurveySendGroups.find(group => group.id === client.surveySendGroupId);

                if (surveyGroup) {
                    const surveyId = surveyGroup.surveyId;
        
                    // You can now use the surveyId for further processing, e.g., sending the email
                    console.log(`Processing surveyId: ${surveyId} for client email: ${client.email}`);
                    
        

                    const clientSurveyData = await prisma.surveyData.create({
                        data:{
                            tenantId: org.id,
                            surveyId: surveyId,
                            attachedUsers: surveyGroup.attachedUsers,
                            expirationDate: surveyGroup.expirationDate,
                            token: generateToken()
                        }
                    })

                    if (!clientSurveyData){
                        console.log({
                            'error': "could not create new clientSurveyData",
                            'surveyId': surveyId,
                            'tenantId': org.id,
                            'client': client.email
                        });
                        throw new Error("could not create new clientSurveyData")
                    }

                    //send email to client with template using org's email/domain stuff
                    const { data, error } = await resend.emails.send({
                        from: 'Acme <onboarding@resend.dev>',
                        to: [`${client.email}`],
                        subject: `${org.companyName} would like you to fill out their survey!`,
                        react: FormLinkTemplate({ firstName: 'John' }),
                    });

                    if (error) {
                        console.log({
                            'message': "Failed to Send email.",
                            'clientEmail':  client.email,
                            'tenantId': org.id,
                            'surveyId': surveyId,
                            'error': error
                        });

                        throw new Error(error.message)
                    }

                    if(!data){
                        console.log("There was no error but data response from resend is empty")

                        throw new Error("There was no error but data response from resend is empty")
                    }

                    //update clientSurveyData with ResendEmailId
                    const updateClientSurveyData = await prisma.surveyData.update({
                        where: {
                            tenantId: clientSurveyData.tenantId,
                            id: clientSurveyData.id
                        },
                        data: {
                            resendEmailId: data.id
                        }

                    })

                    if(!updateClientSurveyData){
                        console.log({
                            'message': "could not update resendEmailId for client",
                            'clientEmail': client.email,
                            'resendEmailId': data.id
                        });
                    }
                } else {
                    console.log({
                        'message': "Seems that SurveyGroup is empty when comparing with client surveyGroups",
                        'SurveyGroup': surveyGroup,
                        'client': client
                    });

                    throw new Error("Seems that SurveyGroup is empty when comparing with client surveyGroups")
                }
            })

            console.log(result);
        }

    }
    

    return NextResponse.json({
        message: "Cron Job Ran " + new Date(),
    }, {status: 200})

}

function isScheduledToday(group: SurveySendGroup): boolean {
    const { scheduledSend, intervalTiming } = group;
    const today = new Date();
    today.setHours(0, 0, 0, 0);  // Midnight comparison
    
    // Convert to a proper Date object if necessary
    const scheduledDate = new Date(scheduledSend);

    // Check if scheduledSend is today
    const isTodayScheduledSend = scheduledDate.toDateString() === today.toDateString();

    if (isTodayScheduledSend) {
        return true;
    }

    // If not today, calculate the next interval send date
    const nextSendDate = nextIntervalDate(scheduledSend, intervalTiming);

    // Check if the calculated next send date is today
    return nextSendDate instanceof Date && nextSendDate.toDateString() === today.toDateString();
}

function nextIntervalDate(InitialScheduleDate: Date, intervalTiming: string) {
    const today = new Date();

    const nextDate = new Date(InitialScheduleDate);  // Start with the initial scheduled date

    // Keep adding intervals until the nextDate is in the future
    while (nextDate <= today) {
        switch (intervalTiming) {
            case 'ONCE':
                // If it's a one-time schedule and the date has passed, return null
                return nextDate > today ? nextDate : "never";

            case 'WEEKLY':
                nextDate.setDate(nextDate.getDate() + 7);  // Add 7 days
                break;
                
            case 'BIWEEKLY':
                nextDate.setDate(nextDate.getDate() + 14);  // Add 14 days
                break;
                
            case 'MONTHLY':
                nextDate.setMonth(nextDate.getMonth() + 1);  // Add 1 month
                break;
                
            case 'QUARTERLY':
                nextDate.setMonth(nextDate.getMonth() + 3);  // Add 3 months
                break;
                
            case 'SEMIANNUALY':
                nextDate.setMonth(nextDate.getMonth() + 6);  // Add 6 months
                break;
                
            case 'ANNUALY':
                nextDate.setFullYear(nextDate.getFullYear() + 1);  // Add 1 year
                break;
                
            default:
                throw new Error(`Unknown interval timing: ${intervalTiming}`);
        }
    }
    
    return nextDate.toDateString()
}
  