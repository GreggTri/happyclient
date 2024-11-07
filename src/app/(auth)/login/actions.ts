'use server'

import bcrypt from 'bcrypt';

import { AuthFormState, LoginFormSchema } from '@/app/_lib/definitions'
import { createSession, deleteSession } from '@/app/_lib/session'
import { prisma } from "@/utils/prisma";
import { redirect } from 'next/navigation';

export async function loginUser(state: AuthFormState, formData: FormData){
    // validate fields 
    const validationResult = LoginFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { email, password } = validationResult.data

    try{
        console.log("I made it here now!");
        await prisma.$connect()

        console.log("is prisma connected " + prisma);

        const checkUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                password: true,
            }
        })

        // If user is not found, return early
        if (!checkUser) {
            return { message: 'Invalid login credentials.' };
        }
        

        const passwordMatch = await bcrypt.compare(
            password,
            checkUser.password,
        );

         // If the password does not match, return early
        if (!passwordMatch) {
            console.log("do passwords not match?");
            return { message: 'Invalid login credentials.' };
        }
        
        const authenticatedUser = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                id: true,
                password: false,
                role: true,
                isAdmin: true,
                tenantId: true,
            }
        });
        
        // Then, if you need the org data, make a second query for the organization
        const org = await prisma.org.findUnique({
            where: {
                id: authenticatedUser!.tenantId
            },
            select: {
                stripeSubscriptionId: true
            }
        });

        await prisma.$disconnect()

        await createSession(authenticatedUser!.id, authenticatedUser!.isAdmin, authenticatedUser!.tenantId, org!.stripeSubscriptionId );

       
    } catch(error){
        console.log(error);
        return {
            message: "Something went wrong when trying to login!"
        }
    }
    
    redirect('/dashboard');
}


export async function logout() {
    deleteSession();
    redirect('/login');
  }