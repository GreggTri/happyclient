'use server'

import { TableCell, TableRow } from '@/components/ui/table'
import React from 'react'
import { AttachedUsers } from '@prisma/client';
import { getAttachedUsers } from '@/app/_data/user';
import { verifySession } from '@/app/_lib/session';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import FinishEmailsButtonComponent from './FinishEmailsButtonComponent';
import AddEmailsButtonComponent from './AddEmailsButtonComponent';
import DeactivateGroupbuttonComponent from './DeactivateGroupbuttonComponent';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';



async function SurveySendGroupRow({group}: 
{group: {
    id: string;
    attachedUsers: AttachedUsers[];
    scheduledSend: Date;
    intervalTiming: string;
    activeEmailCount: number;
    isArchived: boolean
}}) {
    const {isAuth} = await verifySession(true)

    if (!isAuth) {
        revalidatePath('/')
        redirect('/')
    }

    const groupedUsers = await getAttachedUsers(group.attachedUsers)
    
    if (!groupedUsers) {
        revalidatePath(`/dashboard/forms/detail/`)
        redirect('/dashboard/forms')
    }

    function nextIntervalDate(InitialScheduleDate: Date, intervalTiming: string) {
        const today = new Date();

        const nextDate = new Date(InitialScheduleDate);  // Start with the initial scheduled date
    
        // Keep adding intervals until the nextDate is in the future
        while (nextDate <= today) {
            switch (intervalTiming) {
                case 'ONCE':
                    // If it's a one-time schedule and the date has passed, return null
                    return nextDate > today ? nextDate : "never";

                case 'WEEKLY':
                    nextDate.setDate(nextDate.getDate() + 7);  // Add 7 days
                    break;
                    
                case 'BIWEEKLY':
                    nextDate.setDate(nextDate.getDate() + 14);  // Add 14 days
                    break;
                    
                case 'MONTHLY':
                    nextDate.setMonth(nextDate.getMonth() + 1);  // Add 1 month
                    break;
                    
                case 'QUARTERLY':
                    nextDate.setMonth(nextDate.getMonth() + 3);  // Add 3 months
                    break;
                    
                case 'SEMIANNUALY':
                    nextDate.setMonth(nextDate.getMonth() + 6);  // Add 6 months
                    break;
                    
                case 'ANNUALY':
                    nextDate.setFullYear(nextDate.getFullYear() + 1);  // Add 1 year
                    break;
                    
                default:
                    throw new Error(`Unknown interval timing: ${intervalTiming}`);
            }
        }
        
        return nextDate.toDateString()
    }

    return (
        <TableRow className={cn(group.isArchived && 'opacity-50' ,'place-content-center border-white/50 hover:bg-[#2a2a2a] cursor-default')}>
            {/* Names */}
            <TableCell className="flex flex-col font-medium">
                {groupedUsers.map((user) => (
                    <span key={user.id}>{user.firstName} {user.lastName}</span>
                ))}
            </TableCell>

            {/* Next Send Out Date  */}
            <TableCell>{group.isArchived ? "Never" : `${nextIntervalDate(group.scheduledSend, group.intervalTiming)}`}</TableCell>

            {/* Number of Emails */}
            <TableCell>{group.activeEmailCount}</TableCell>

            {/* Actions */}
            <TableCell>
                <AddEmailsButtonComponent groupId={group.id} isArchived={group.isArchived}/>
            </TableCell>
            <TableCell >
                <FinishEmailsButtonComponent groupId={group.id} isArchived={group.isArchived}/>
            </TableCell>
            <TableCell >
                {group.isArchived ? 
                    <Badge className='border border-red-500 text-red-500 bg-transparent text-base px-4 py-1'>Archived</Badge>
                :
                    <DeactivateGroupbuttonComponent groupId={group.id} isArchived={group.isArchived}/>
                }
                
            </TableCell>

        </TableRow>
    )
}

export default SurveySendGroupRow