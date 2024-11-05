'use server'
import 'server-only'

import { verifySession } from "@/app/_lib/session";
import { prisma } from "@/utils/prisma";
import { revalidatePath } from 'next/cache';
import { Resend } from 'resend';
import InviteUserEmail from '@/app/_components/emailTemplates/inviteuser';
import { generateToken } from '@/app/_lib/tokens';
import { AddRoleSchema } from '@/app/_lib/definitions';
const resend = new Resend(process.env.RESENT_API_KEY);

export const sendUserInvite = async(formData: FormData) => {
    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return null;

    const newUserEmail: string = String(formData.get('email'))

    const getUser = await prisma.user.findUnique({where: {
        id: session.userId,
        tenantId: String(session.tenantId!)
    }, select: {
        firstName: true,
        lastName: true
    }})

    const getOrg = await prisma.org.findUnique({
        where: {
            id: String(session.tenantId!)
        },
        select: {
            id: true,
            companyName: true,
            invites: true
        }
    })

    if(!getOrg || !getUser){
        throw new Error("Could not send email ot this user from this org with important information!")
    }

    if(getOrg.invites.some(item => item.email === newUserEmail && item.expiresAt.getTime() < Date.now())){
       throw new Error("This email has already been invited to this org!") 
    }

    const newToken = generateToken()
    const expiresAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);

    const emailResponse = await resend.emails.send({
        from: 'HappyClient <onboarding@gethappyclient.com>',
        to: [newUserEmail],
        subject: `${getUser.firstName} ${getUser.lastName} invited you to Happy Client for ${getOrg.companyName}`,
        react: InviteUserEmail({}), // figure this out still and add info props some how.
      });

    if (!emailResponse){
        throw new Error("Resend failed to send email!")
    }

    const updateInvitesOrg = await prisma.org.update({
        where:{
            id: getOrg.id
        },
        data: {
            invites: {
                set: {
                    email: newUserEmail,
                    token: newToken,
                    expiresAt: expiresAt,
                    resendEmailId: emailResponse.data!.id
                }
            } 
        },
        select: {
            id: true
        }
    })

    if(!updateInvitesOrg){
        throw new Error("couldn't save invite to db, user will not be able to create account via email")
    }

    revalidatePath("/settings/team")
}


export const AddRoleToOrg = async(formData: FormData) => {

    

    const session = await verifySession(true)//adding true here means admin only endpoint
    if (!session) return null;

    
    const validationResult = AddRoleSchema.safeParse({
        newRole: formData.get('newRole'),
    })
    
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { newRole } = validationResult.data

    const lowercaseNewRole = newRole.toLowerCase()

    try{

        const getOrgRoles = await prisma.org.findUnique({
            where: {
                id: String(session.tenantId)
            },
            select: {
                id: true,
                roles: true
            }
        })

        if (!getOrgRoles) {
            throw new Error("Organization not found");
        }

        if(getOrgRoles.roles.some(item => item.name === lowercaseNewRole)){
            throw new Error("This Role already exists!") 
        }

        const addRole = await prisma.org.update({
            where: {
                id: getOrgRoles.id
            },
            data: {
                roles: {
                    push: {
                        name: lowercaseNewRole
                    }
                }
            }
        })
        
        if(!addRole){
            throw new Error("DB could not update org with new role")
        }
        
    } catch(error){
        console.log(error)
        return {
            success: false,
            message: "Something went wrong! Please contact Support!"
        }
    }

    revalidatePath("/settings/team")
}



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

