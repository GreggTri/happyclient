'use server'

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { z } from "zod";

const formSchema = z.object({
    emails: z.array(z.string().email()).min(1, "At least one email is required"),
    scheduledSend: z.date(),
    intervalTiming: z.enum(['ONCE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALY', 'ANNUALY']),
    expirationDate: z.enum(['AFTER_1_DAY', 'AFTER_7_DAYS', 'AFTER_14_DAYS']),
    attachedUsers: z.array(z.object({
      userId: z.string().min(1, "Employee required, if input is shown"),
    })).optional(),
    surveyId: z.string()
  })
  
  type FormValues = z.infer<typeof formSchema>

export async function createScheduleSender(formData: FormValues){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    console.log(formData);
    const { emails, surveyId, scheduledSend, intervalTiming, expirationDate, attachedUsers } = formData

    // cehck the email stuff
    const uniqueEmailSet = new Set(emails);
    const uniqueEmails = Array.from(uniqueEmailSet);

    const emailCount = uniqueEmails.length

    try{

        const result = await prisma.$transaction(async (prisma) => {

            const newGroup = await prisma.surveySendGroup.create({
                data: {
                    tenantId: String(session.tenantId),
                    surveyId: surveyId,
                    activeEmailCount: emailCount,
                    scheduledSend: scheduledSend,
                    intervalTiming: intervalTiming,
                    expirationDate: expirationDate,
                    attachedUsers: attachedUsers
                }
            })

            if(!newGroup){
                throw new Error("newGroup failed creation. return was null")
            }

            const newClientEmails = uniqueEmails.map((email) => {
                return {
                    'tenantId': String(session.tenantId),
                    'email': email,
                    'surveySendGroupId': newGroup.id
                }
            })
            const newGroupedEmails = await prisma.surveySendEmail.createMany({
                data: newClientEmails
            })

            if(!newGroupedEmails){
                throw new Error("newGroupedEmails failed creation. return was null")
            }
            return newGroup
        })

        return result

    } catch(error){
        console.log({
            'success': false,
            'function': 'createScheduleSender',
            'error': error,
            'message': "Failed to create Scheduled Send."
        });

        return null
    }
}


const EditEmailsToGroupForm = z.object({
    emails: z.array(z.string().email()).min(1, "At least one email is required"),
    groupId: z.string()
})

type EditEmailsToGroupFormSchema = z.infer<typeof EditEmailsToGroupForm>

export async function addEmailsGroupScheduleSender(formData: EditEmailsToGroupFormSchema){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const { groupId, emails } = formData

    const uniqueEmailSet = new Set(emails);
    const uniqueEmailsToBeAdded = Array.from(uniqueEmailSet);

    try{

        const result = await prisma.$transaction(async (prisma) => {
            
            //map surveySendEmail object
            const newClientEmails = uniqueEmailsToBeAdded.map((email) => {
                return {
                    'tenantId': String(session.tenantId),
                    'email': email,
                    'surveySendGroupId': groupId
                }
            })
            
            //add emails
            const updatedGroupedAddedEmails = await prisma.surveySendEmail.createMany({
                data: newClientEmails
            })

            if(!updatedGroupedAddedEmails){
                throw new Error("updatedGroupedAddedEmails failed creation. return was null")
            }

            //get count
            const updatedGroupEmailCount = await prisma.surveySendEmail.count({
                where: {
                    surveySendGroupId: groupId,
                    tenantId: String(session.tenantId),
                    AND: {
                        isFinished: {
                            equals: false
                        }
                    }
                }
            })

            if(!updatedGroupEmailCount){
                throw new Error("updated Email count failed! return was null")
            }

            //update group with new count
            const updatedGroup = await prisma.surveySendGroup.update({
                where: {
                    id: groupId,
                    tenantId: String(session.tenantId),
                },
                data: {
                    activeEmailCount: {
                        set: updatedGroupEmailCount
                    }
                }
            })

            if(!updatedGroup){
                throw new Error("newGroup failed creation. return was null")
            }

            
            return updatedGroup
        })

        return result

    } catch(error){
        console.log({
            'success': false,
            'function': 'addEmailsGroupScheduleSender',
            'error': error,
            'message': "Failed to create Scheduled Send."
        });

        return null
    }

}   


export async function FinishEmailsGroupScheduleSender(formData: EditEmailsToGroupFormSchema){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const { groupId, emails } = formData

    const uniqueEmailSet = new Set(emails);
    const uniqueEmailsToBeRemoved = Array.from(uniqueEmailSet);

    try{

        const result = await prisma.$transaction(async (prisma) => {
            
            //edit emails
            const updatedGroupedAddedEmails = await prisma.surveySendEmail.updateMany({
                data: {
                    isFinished: true
                },
                where: {
                    tenantId: String(session.tenantId),
                    surveySendGroupId: groupId,
                    email: {
                        in: uniqueEmailsToBeRemoved
                    }
                }
            })

            if(!updatedGroupedAddedEmails){
                throw new Error("updatedGroupedAddedEmails failed creation. return was null")
            }

            //get count
            const updatedGroupEmailCount = await prisma.surveySendEmail.count({
                where: {
                    surveySendGroupId: groupId,
                    tenantId: String(session.tenantId),
                    AND: {
                        isFinished: {
                            equals: false
                        }
                    }
                }
            })

            if(!updatedGroupEmailCount){
                throw new Error("updated Email count failed! return was null")
            }

            //update group with new count
            const updatedGroup = await prisma.surveySendGroup.update({
                where: {
                    id: groupId,
                    tenantId: String(session.tenantId),
                },
                data: {
                    activeEmailCount: {
                        set: updatedGroupEmailCount
                    }
                }
            })

            if(!updatedGroup){
                throw new Error("newGroup failed creation. return was null")
            }

            
            return updatedGroup
        })

        return result

    } catch(error){
        console.log({
            'success': false,
            'function': 'createScheduleSender',
            'error': error,
            'message': "Failed to create Scheduled Send."
        });

        return null
    }
}

export async function deactivateGroup(groupId: string){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    try{

        const result = await prisma.$transaction(async (prisma) => {
            
            //edit emails
            const updatedGroupedAddedEmails = await prisma.surveySendEmail.updateMany({
                data: {
                    isFinished: true
                },
                where: {
                    tenantId: String(session.tenantId),
                    surveySendGroupId: groupId,
                    AND: {
                        isFinished: {
                            equals: false
                        }
                    }
                }
            })

            if(!updatedGroupedAddedEmails){
                throw new Error("updatedGroupedAddedEmails failed creation. return was null")
            }


            //update group with new count
            const updatedGroup = await prisma.surveySendGroup.update({
                where: {
                    id: groupId,
                    tenantId: String(session.tenantId),
                },
                data: {
                    activeEmailCount: {
                        set: 0
                    },
                    isArchived: {
                        set: true
                    }
                }
            })

            if(!updatedGroup){
                throw new Error("newGroup failed creation. return was null")
            }

            
            return updatedGroup
        })

        return result

    } catch(error){
        console.log({
            'success': false,
            'function': 'createScheduleSender',
            'error': error,
            'message': "Failed to create Scheduled Send."
        });

        return null
    }
}