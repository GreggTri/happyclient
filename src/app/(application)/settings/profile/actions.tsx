'use server'

import 'server-only'

import { prisma } from '@/utils/prisma'
import { verifySession } from "@/app/_lib/session";
import { UpdateProfileFormState, updateProfileNameForm } from '@/app/_lib/definitions'
import { revalidatePath } from 'next/cache';

export const updateName =  async(state: UpdateProfileFormState, formData: FormData) => {

    const session = await verifySession()
    if (!session) return null;

    if (formData.get('firstName') == "" && formData.get('lastName') == "") {

        console.log("I enter room");
        return {message: "Fields are empty."}
    }

    const validationResult = updateProfileNameForm.safeParse({
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName')
    })

    if (!validationResult.success) {
        return {
            errors: validationResult.error.flatten().fieldErrors
        }
    }

    const { firstName, lastName} = validationResult.data

    const updatedUser = await prisma.user.update({
        where: {
            id: session.userId
        },
        data: {
            ...(firstName && {firstName: firstName}),
            ...(lastName && {lastName: lastName})
        }
    })

    revalidatePath('/settings/profile')
}