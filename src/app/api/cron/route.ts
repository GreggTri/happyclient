'use server'

import { prisma } from "@/utils/prisma";
import { NextRequest, NextResponse } from "next/server";
import { SurveySendGroup } from "@prisma/client";
import { generateToken } from "@/app/_lib/tokens";
import { Resend } from 'resend';
import FormLinkTemplate from "@/app/_components/emailTemplates/FormLinkTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function GET(request: NextRequest) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new Response('Unauthorized', {
            status: 401,
        });
    }

    const orgs = await prisma.org.findMany();

    for (const org of orgs) {
        const surveySendGroups = await prisma.surveySendGroup.findMany({
            where: {
                isArchived: false,
                tenantId: org.id,
            },
        });

        // Filter groups that are scheduled for today based on scheduledSend or interval timing
        const todaySurveySendGroups = surveySendGroups.filter(group => isScheduledToday(group));

        for (const surveyGroup of todaySurveySendGroups) {
            const surveyGroupId = surveyGroup.id;
            const surveyId = surveyGroup.surveyId;

            // Get clients in this surveyGroup
            const clients = await prisma.surveySendEmail.findMany({
                where: {
                    surveySendGroupId: surveyGroupId,
                },
            });

            const clientsData = [];

            // Create surveyData entries and prepare email data
            for (const client of clients) {
                const token = generateToken();

                // Create surveyData
                const clientSurveyData = await prisma.surveyData.create({
                    data: {
                        tenantId: org.id,
                        surveyId: surveyId,
                        attachedUsers: surveyGroup.attachedUsers,
                        expirationDate: surveyGroup.expirationDate,
                        token: token,
                    },
                });

                clientsData.push({
                    email: client.email,
                    surveyLink: `https://${org.domain}/${token}`,
                    clientSurveyDataId: clientSurveyData.id,
                    clientSurveyDataTenantId: clientSurveyData.tenantId,
                });
            }

            // Prepare batch emails
            const batchEmails = clientsData.map(clientData => ({
                from: `${org.companyName} <${org.surveyEmail}>`,
                to: [clientData.email],
                subject: `${org.companyName} sent you a survey!`,
                react: FormLinkTemplate({ surveyLink: clientData.surveyLink, companyName: org.companyName }),
            }));

            // Send batch emails using resend.batch.send
            try {
                const batchEmailResponse = await resend.batch.send(batchEmails);

                if (batchEmailResponse && batchEmailResponse.data && Array.isArray(batchEmailResponse.data)) {
                    const batchEmailResults = batchEmailResponse.data;

                    // Update surveyData entries with resendEmailIds
                    for (let i = 0; i < batchEmailResults.length; i++) {
                        const result = batchEmailResults[i];
                        const clientData = clientsData[i];

                        const resendEmailId = result.id; // Get the resendEmailId from the response

                        await prisma.surveyData.update({
                            where: {
                                id: clientData.clientSurveyDataId,
                            },
                            data: {
                                resendEmailId: resendEmailId,
                            },
                        });
                    }
                } else {
                    console.error(`Unexpected response from resend.batch.send for org ${org.id}:`, batchEmailResponse);
                    // Handle unexpected response
                }
            } catch (error) {
                console.error(`Failed to send batch emails for org ${org.id}:`, error);
                // Handle error appropriately, possibly continue to next org or survey group
            }
        }
    }

    return NextResponse.json({
        message: "Cron Job Ran " + new Date(),
    }, { status: 200 });
}

function isScheduledToday(group: SurveySendGroup): boolean {
    const { scheduledSend, intervalTiming } = group;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Midnight comparison

    const scheduledDate = new Date(scheduledSend);

    // Check if scheduledSend is today
    const isTodayScheduledSend = scheduledDate.toDateString() === today.toDateString();

    if (isTodayScheduledSend) {
        return true;
    }

    // Calculate the next interval send date
    const nextSendDate = nextIntervalDate(scheduledSend, intervalTiming);

    // Check if the calculated next send date is today
    return nextSendDate instanceof Date && nextSendDate.toDateString() === today.toDateString();
}

function nextIntervalDate(InitialScheduleDate: Date, intervalTiming: string) {
    const today = new Date();
    const nextDate = new Date(InitialScheduleDate); // Start with the initial scheduled date

    // Keep adding intervals until the nextDate is in the future
    while (nextDate <= today) {
        switch (intervalTiming) {
            case 'ONCE':
                return nextDate > today ? nextDate : null;

            case 'WEEKLY':
                nextDate.setDate(nextDate.getDate() + 7); // Add 7 days
                break;

            case 'BIWEEKLY':
                nextDate.setDate(nextDate.getDate() + 14); // Add 14 days
                break;

            case 'MONTHLY':
                nextDate.setMonth(nextDate.getMonth() + 1); // Add 1 month
                break;

            case 'QUARTERLY':
                nextDate.setMonth(nextDate.getMonth() + 3); // Add 3 months
                break;

            case 'SEMIANNUALY':
                nextDate.setMonth(nextDate.getMonth() + 6); // Add 6 months
                break;

            case 'ANNUALY':
                nextDate.setFullYear(nextDate.getFullYear() + 1); // Add 1 year
                break;

            default:
                throw new Error(`Unknown interval timing: ${intervalTiming}`);
        }
    }

    return nextDate;
}
