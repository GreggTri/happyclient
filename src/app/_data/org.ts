'use server'
import "server-only"

//import { prisma } from "@/utils/prisma";
import { verifySession } from "@/app/_lib/session";
import { cache } from 'react'

export const getRoles = cache(async() => {
    const session = await verifySession()
    if (!session) return null;

    //verify user is admin
    //verify org
    //verify user is admin in org


    return ["Paralegal", "Attorney", "Legal Assistant"]
})