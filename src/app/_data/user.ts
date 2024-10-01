'use server'
import "server-only"

import { prisma } from "@/utils/prisma";
import { cache } from 'react'
import { verifySession } from "../_lib/session";

export const fetchUser = cache(async () => {

    const session = await verifySession(false)
    if (!session) return null;

    try {
        await prisma.$connect()

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
        await prisma.$disconnect()

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
        await prisma.$connect()

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

        await prisma.$disconnect()

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