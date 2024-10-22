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

        const getOrgDomain = await prisma.org.findUnique({
            where:{ 
                id: String(session.tenantId)
            }, 
            select: {
                id: true, 
                domain: true, 
                isUsingCustomDomain: true
            }
        })

        if(!getOrgDomain) return null

        if(getOrgDomain.isUsingCustomDomain){
            // since using a custom domain we do not want to update the domain.
            return await prisma.org.update({
                where: {
                    id: String(session.tenantId)
                },
                data: {
                    companyName: companyName
                },
                select: {
                    companyName: true
                }
            })
        } else {
            //we want to use new companyName for the subdomain.
            const modifiedCompanyNameForSubDomain = companyName
            .replace(/&/g, 'and')              // Replace & with "and"
            .replace(/[^a-zA-Z0-9-]/g, '')     // Remove all other disallowed characters
            .toLowerCase();    
            
            console.log(modifiedCompanyNameForSubDomain);
            return await prisma.org.update({
                where: {
                    id: String(session.tenantId)
                },
                data: {
                    companyName: companyName,
                    domain: `${modifiedCompanyNameForSubDomain}.${process.env.BASE_DOMAIN}`
                },
            })
        }
    } catch(error){
        console.log(error);

        return null;
    }
}