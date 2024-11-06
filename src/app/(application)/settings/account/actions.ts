'use server'
import "server-only"

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";

export async function updateCompanyName(companyName: string){
    //this function handles all verification/authorization
    const session = await verifySession(true) //true means adminOnly 
    if (!session) return null;

    console.log(companyName);
    try{   

        return await prisma.org.update({
            where: {
                id: String(session.tenantId)
            },
            data: {
                companyName: companyName
            },
            select: {
                id: true,
                companyName: true
            }
        })

    } catch(error){
        console.log(error);

        return null;
    }
}