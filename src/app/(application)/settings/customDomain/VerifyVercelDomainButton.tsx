'use client'

import { Icons } from '@/app/_components/icons';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { verifyVercelDomain } from './actions';

function VerifyVercelDomainButton({domain}: {domain: string}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false);
    
    const onSubmit = async () => {
        try {
            setIsLoading(true); // Start loading
            const vercelResponse = await verifyVercelDomain(domain);
            console.log(domain);
        
            if(vercelResponse){
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

export default VerifyVercelDomainButton