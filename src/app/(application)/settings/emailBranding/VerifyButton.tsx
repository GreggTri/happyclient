'use client'

import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast';
import React, { useState } from 'react'
import { verifyEmailDomain } from './actions';
import { useRouter } from 'next/navigation';
import { Icons } from '@/app/_components/icons';

function VerifyButton({domainId}: {domainId: string}) {

    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmit = async () => {
        try {
            setIsLoading(true); // Start loading
            const domain = await verifyEmailDomain(domainId);
            console.log(domain);
        
            if( domain && 'id' in domain){
                toast({
                title: "Domain is being verfied!",
                description: "Wait to send surveys till you see a verified badge!",
                variant: "destructive",
                className: "bg-green-500 border-none"
                })
        
                router.refresh()
            } else {
                throw new Error("Failed to verify domain")
            }
              
        } catch (error) {
            toast({
                title: "Domain verification failed.",
                description: "Something went wrong, contact support if this issue happens again.",
                variant: "destructive",
                className: "bg-red-500 border-none"
            })
        }finally {
            setIsLoading(false); // Stop loading
        }
      }

  return (
    <Button onClick={onSubmit} className="text-black flex items-center">
        {isLoading ? (
            <Icons.spinner className="animate-spin mr-2" /> // Spinner with animation
        ) : null}
        Verify DNS Records
    </Button>
  )
}

export default VerifyButton