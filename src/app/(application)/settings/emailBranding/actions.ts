'use server'
import "server-only"

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { z } from "zod";
import { Resend } from 'resend';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

const resend = new Resend(process.env.RESEND_API_KEY);

const formSchema = z.object({
    domain: z.string().regex(
      /^(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
      "Must be a valid domain with a subdomain"
    )
})
  
type FormValues = z.infer<typeof formSchema>

export async function addEmailDomain(formData: FormValues){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return null;

    const { domain } = formData

    const {data, error} = await resend.domains.create({ name: domain });

    if(error){
        console.log({
            'error': error,
            'message': 'failed to create domain with resend.'
        });
        throw new Error(error.message)
    }

    const updateOrg = await prisma.org.update({
        where: {
            id: String(session.tenantId)
        },
        data: {
            resendDomainId: data!.id,
            surveyEmail: `surveys@${domain}`
        }
    })

    if(!updateOrg){
        console.log({
            'updateOrg': updateOrg,
            'resendData': data,
            'message': 'was not able to update org!'
        });
        throw new Error('could not update org with new email domain')
    }

    return updateOrg
}


export async function deleteEmailDomain(formData: FormData){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return redirect('/login');

    const domainId = formData.get('domainId') as string;

    const {data, error} = await resend.domains.remove(domainId)

    if(error){
        console.log({
            'error': error,
            'message': 'failed to delete domain with resend.'
        });
        throw new Error(error.message)
    }

    const updateOrg = await prisma.org.update({
        where: {
            id: String(session.tenantId)
        },
        data: {
            resendDomainId: {
                unset: true
            },
            surveyEmail: {
                unset: true
            }
        }
    })

    if(!updateOrg){
        console.log({
            'updateOrg': updateOrg,
            'resendData': data,
            'message': 'was not able to delete Email domain!'
        });
        throw new Error('could not update org with new email domain')
    }


    revalidatePath('/settings/emailBranding')

}

export const verifyEmailDomain = async(resendDomainId: string) => {
    const session = await verifySession(true)
    if (!session) return null;

    const {data, error} = await resend.domains.verify(resendDomainId);

    if(error){
        console.log({
            'error': error,
            'message': 'failed to verify domain with resend.'
        });
        return null;
    }

    return data;
    
}