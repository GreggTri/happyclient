"use server"

import { addDomainToVercel, verifyDomainOnVercel } from "@/app/_data/vercel";
import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import fetch from 'node-fetch';
import { z } from "zod";

//const subdomainRegex = /^[a-zA-Z0-9-]+$/;



const domainFormSchema = z.object({
    domain: z
    .string()
    .regex(
      /^(?=.{4,253}$)(([a-zA-Z0-9][-a-zA-Z0-9]{0,62})\.)+([a-zA-Z]{2,63})$/,
      'Invalid domain format'
    )
    .refine(
      (val) => val.split('.').length >= 3,
      'Domain must include a subdomain (e.g., subdomain.domain.com)'
    ),
})
  
type domainSchemaType = z.infer<typeof domainFormSchema>

// Function to add a domain (either a subdomain of your main domain or an entire custom domain)
export async function upsertCustomDomain(formData: domainSchemaType) {
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return redirect('/dashboard/analytics');
    
    const { domain } = formData

    
    const dnsRecords = await addDomainToVercel(domain);

    if(!dnsRecords){
        console.log({
            'message': "DNS Records came back null",
            'dnsRecords': dnsRecords,
            'domain': domain
        });
    }

    const updateOrg = await prisma.org.update({
        where: {
            id: String(session.tenantId)
        },
        data: {
            domain: {
                set: domain
            },
            domainVerified: {
                set: dnsRecords.verified
            }
        }
    })

    if(!updateOrg){
        console.log({
            'updateOrg': updateOrg,
            'resendData': dnsRecords,
            'message': 'was not able to update org!'
        });
        throw new Error('could not update org with survey domain')
    }

    console.log(dnsRecords);

    return dnsRecords;
    
}

export async function verifyVercelDomain(domain: string){
    const session = await verifySession(true) //false means user does not need to be admin to hit endpoint
    if (!session) return redirect('/dashboard/analytics');

    const vercelResponse = await verifyDomainOnVercel(domain)

    if (vercelResponse!.verified) {
        
        const updateOrg = await prisma.org.update({
            where: {
                id: String(session.tenantId)
            },
            data: {
                domainVerified: true
            }
        })
    }

    revalidatePath('/settings/customDomain')

    return null;
}

  