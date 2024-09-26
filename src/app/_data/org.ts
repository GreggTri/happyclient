'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";
import { cache } from 'react'
import { prisma } from "@/utils/prisma";

export const getRoles = cache(async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        const getOrgRoles = await prisma.org.findUnique({where: {
            id: String(session.tenantId!)
        }, select: {
            roles: true
        }})
    
        if (getOrgRoles === null){
            return {success: true, roles: [], message: "No Roles found in your org. Let create some!"}
        }
    
        //succesful response
        return {success: true, roles: getOrgRoles.roles}

    } catch(error){
        console.log(error);

        return {
            success: false,
            roles: [],
            error: "something went wrong trying to grab roles!"
        }
    }
})