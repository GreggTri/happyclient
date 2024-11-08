'use server'
import "server-only"

import { prisma } from "@/utils/prisma";
import { cache } from 'react'
import { verifySession } from "../_lib/session";
import { AttachedUsers } from '@prisma/client';


export const fetchUser = cache(async () => {

    const session = await verifySession(false)
    if (!session) return null;

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: session.userId,
                org: {
                    id: String(session.tenantId)
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isAdmin: true
            }
        })


        return {
            success: true,
            user: {...user}
        }
    } catch(error){
        console.log(error);

        return {
            success: false,
            user: null,
            error: `Failed to create user! Please try again!`
        }
    }   
})

// type FetchUsersResult = {
//     success: boolean;
//     count: number;
//     users: {
//         id: string;
//         email: string;
//         firstName: string | null;
//         lastName: string | null;
//         role: string;
//         isAdmin: boolean;
//     }[];
//     error?: unknown;
//     message?: string;
// };

//ADMIN-ONLY function
export const fetchUsers = cache(async (q: string, page: number) => {

    const {isAuth, tenantId} = await verifySession(true)

    if (!isAuth) return {
        success: false,
        count: 0,
        users: [],
        message: "Unauthorized"
    };
    //const regex = new RegExp(q, "i");
    const ITEM_PER_PAGE = 10;

    try {

        const count = await prisma.user.count({
            where: {
                OR: [
                    {firstName: {
                        contains: q,
                        mode: 'insensitive'
                    }},
                    {lastName: {
                        contains: q,
                        mode: 'insensitive'
                    }},
                    {email: {
                        contains: q,
                        mode: 'insensitive'
                    }}
                ],
                org: {
                    id: String(tenantId)
                }
            },
            
        })

        const users = await prisma.user.findMany({
            where: {
                OR: [
                    {firstName: {
                        contains: q,
                        mode: 'insensitive'
                    }},
                    {lastName: {
                        contains: q,
                        mode: 'insensitive'
                    }},
                    {email: {
                        contains: q,
                        mode: 'insensitive'
                    }}
                ],
                org: {
                    id: String(tenantId)
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                isAdmin: true
            },
            take: ITEM_PER_PAGE,
            skip: ITEM_PER_PAGE * (page - 1)
        })

        return {success: true, count, users};

    } catch(error){
        console.log(error);

        return {
            success: false,
            count: 0,
            users: [],
            error: error,
            message: "Failed to fetch users!"
        }
    }   
})

export async function getAttachedUsers(users: AttachedUsers[]){
    try{
        const session = await verifySession(true)

        if (!session || session.isAuth === false) return null;

        const getGroupedUsers = await prisma.user.findMany({
            where: {
                tenantId: String(session.tenantId),
                AND: {
                    id: {
                        in: users.map((user) => user.userId)
                    }
                }
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                password: false
            }
        })

        if(!getGroupedUsers) return null;

        return getGroupedUsers
    } catch(error){
        console.log(error);
    }

    
}

export const getUsers = cache(async() => {
    try{
        const session = await verifySession(true)

        if (!session || session.isAuth === false) return null;

        const getGroupedUsers = await prisma.user.findMany({
            where: {
                tenantId: String(session.tenantId),
            },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                password: false
            }
        })

        if(!getGroupedUsers) return null;

        return getGroupedUsers
    } catch(error){
        console.log(error);
    }
})