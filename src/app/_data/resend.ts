'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const retrieveDomain = async(resendDomainId: string) => {
    const session = await verifySession(true)
    if (!session) return null;

    const {data, error} = await resend.domains.get(resendDomainId);

    if(error){
        console.log("Failed to retrieve domain data from resend.");
        return null;
    }

    return {
        'id': data!.id,
        'name': data!.name,
        'records': data!.records,
        'status': data!.status,
    }
}

export const verifyDomain = async(resendDomainId: string) => {
    const session = await verifySession(true)
    if (!session) return null;

    const {data, error} = await resend.domains.verify(resendDomainId);

    if(error){
        console.log("Failed to retrieve domain data from resend.");
        return null;
    }

    return data;
    
}