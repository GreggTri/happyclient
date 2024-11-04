'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";
import { Resend } from 'resend';
import { cache } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export const retrieveEmailDomain = cache(async(resendDomainId: string) => {
    const session = await verifySession(true)
    if (!session) return null;

    const {data, error} = await resend.domains.get(resendDomainId);

    if(error){
        console.log({
            'error': error,
            'message': 'failed to retrieve domain from resend.'
        });
        return null;
    }

    return {
        'id': data!.id,
        'name': data!.name,
        'records': data!.records,
        'status': data!.status,
    }
})

