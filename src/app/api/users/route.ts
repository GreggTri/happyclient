'use server'

import 'server-only'

import { NextResponse } from "next/server"
import { getUsers } from '@/app/_data/user';


export async function GET(request: Request){
    
    try{

        console.log(request);
        const users = await getUsers()

        return NextResponse.json(users, {status: 200})
        
    } catch(error){
        return NextResponse.json({error: error}, {status: 500})
    }
    
}