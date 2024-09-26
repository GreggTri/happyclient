'use server'

import bcrypt from 'bcrypt';

import { AuthFormState, RegisterFormSchema } from '@/app/_lib/definitions'
import { prisma } from "@/utils/prisma";
import { createSession } from '@/app/_lib/session';
import { redirect } from 'next/navigation';


export async function registerUser(state: AuthFormState, formData: FormData){
    // validate fields 

    const validationResult = RegisterFormSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password')
    })
    
    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { email, password } = validationResult.data

    try {
        await prisma.$connect()

        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (existingUser){
            return {
                message: 'Email already exists, please use a different email or login.'
            }
        }
        
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword,
                isAdmin: true,
                org: {
                    create: {
                        companyName: email + " Created"
                    }
                }
            }

        })

        await prisma.$disconnect()
        
        //we add these too the session because we have viewing priveleges of certain routes via admin 
        //and we must contain/filter all queries via the tenantId
        await createSession(user.id, user.isAdmin, user.tenantId, null)

        
    } catch (error){
        console.log(error);

        return {
            message: "Something went wrong when registering user!"
        }
    }


    redirect('/settings/account')


}
