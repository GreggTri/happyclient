'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";

import { prisma } from "@/utils/prisma";
import { cache } from "react";

export const getRoles = cache(async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        const getOrgRoles = await prisma.org.findUnique({where: {
            id: String(session.tenantId)
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

export const getOrgDomain = async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        const getOrgDomain = await prisma.org.findUnique({
            where: {
                id: String(session.tenantId)
            },
            select: {
                id: true,
                domain: true
            }
        })

        if (getOrgDomain === null){
            return null;
        }

        return {success: true, org: getOrgDomain}

    } catch(error){
        console.log(error);

        return null;
    }
}

export const getOrgCompanyName = async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        return await prisma.org.findUnique({
            where: {
                id: String(session.tenantId)
            },
            select: {
                companyName: true
            }
        })

    } catch(error){
        console.log(error);

        return null;
    }
}

export const getOrg = async() => {
    //this function handles all verification/authorization
    const session = await verifySession(true)
    if (!session) return null;

    try{
        return await prisma.org.findUnique({
            where: {
                id: String(session.tenantId)
            },
            select: {
                id: true,
                companyName: true,
                surveyEmail: true,
                resendDomainId: true,
            }
        })

    } catch(error){
        console.log(error);

        return null;
    }
}