'use client'

import { Icons } from '@/app/_components/icons';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react'
import { deactivateGroup } from './actions';

function DeactivateGroupbuttonComponent({groupId, isArchived}: {groupId: string, isArchived: boolean}) {
    const [loading, startTransition] = useTransition();
    const router = useRouter()
  
    const onSubmit = async () => {
      try {
      
        const deactivatedGroup = await deactivateGroup(groupId);
  
        if( deactivatedGroup && 'id' in deactivatedGroup){
          
          toast({
              title: "deactivation was successful!",
              description: "You have successfully deactivated this survey group and all client emails",
              variant: "destructive",
              className: "bg-green-500 border-none"
          })
          
          router.refresh()
        } else {
          throw new Error("Survey Creation Failed")
        }
        
      } catch (error) {
        toast({
          title: "Failed to deactivate survey group!",
          description: "Something went wrong! Please try again later and/or contact support!",
          variant: "destructive",
          className: "bg-red-500 border-none"
        })
      }
    };
  
    return (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button disabled={isArchived} className='bg-red-500 hover:bg-red-600'>Deactivate</Button>
        </AlertDialogTrigger>
  
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to deactivate this survey group?</AlertDialogTitle>
            <AlertDialogDescription>This action will remove all active client emails and archive this survey group</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
            className="text-BLACK"
            disabled={loading} 
            onClick={(e) => {
              e.preventDefault()
              startTransition(onSubmit)
            }}>
              {loading ? <Icons.spinner className="animate-spin" width={15} height={15}/> : "Proceed"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
  )
}

export default DeactivateGroupbuttonComponent