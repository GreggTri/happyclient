'use server'
import 'server-only'

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from 'next/cache';

export const deleteUser =  async(formData: FormData) => {

    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return null;

    
    const id: string = String(formData.get('userId'))

    console.log(id);

    if(id == null || id === "") {
        return {
            success: false,
            message: "User does not exist!"
        }
    }

    await prisma.user.delete({
        where: {
            id: id
        }
    })
    revalidatePath('/settings/profile')
}

export const updateUserAdmin = async (formData: FormData) => {
    const session = await verifySession(true) //adding true here means admin only endpoint
    if (!session) return null;


    let isUserAdmin: boolean;

    if(formData.get('isAdmin') === "on"){
        isUserAdmin = true;
    } else {
        isUserAdmin = false;
    }

    const updatedUser = await prisma.user.update({
        where: {
            id: String(formData.get('userId')),
            org: {
                id: session.tenantId!
            }
        },
        data: {
            isAdmin: {
                set: isUserAdmin
            }
        }
    })

    console.log(`${updatedUser.email} is admin?: ${updatedUser.isAdmin}`);
    
    revalidatePath('/settings/profile')
}


export const updateUserRole = async (formData: FormData) => {
    const session = await verifySession(true)
    if (!session) return null;


    

    const updatedUser = await prisma.user.update({
        where: {
            id: String(formData.get('userId')),
            org: {
                id: session.tenantId!
            }
        },
        data: {
            role: {
                set: String(formData.get('role'))
            }
        }
    })

    console.log(`${updatedUser.email} new role: ${updatedUser.role}`);
    
    revalidatePath('/settings/profile')
}

