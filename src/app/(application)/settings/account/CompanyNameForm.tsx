'use client'

import { Input } from '@/app/_components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from '@/hooks/use-toast'
import React, { useState, useTransition } from 'react'
import { updateCompanyName } from './actions'
import { useRouter } from 'next/navigation'
import { Label } from '@/components/ui/label'
import { Icons } from '@/app/_components/icons'

function CompanyNameForm({ companyName }: { companyName: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [company, setCompany] = useState(companyName);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      try {
        const updatedOrg = await updateCompanyName(company);

        if (updatedOrg && 'id' in updatedOrg) {
          toast({
            title: "Success!",
            description: `New Org name is: ${updatedOrg.companyName}`,
            variant: "destructive",
            className: "bg-green-500 border-none",
          });

          router.refresh();
        } else {
          throw new Error("Renaming organization failed!");
        }
      } catch (error) {
        toast({
          title: "Renaming Org Failed!",
          description: "Something went wrong! Please try again later and/or contact support!",
          variant: "destructive",
          className: "bg-red-500 border-none",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-[50%]">
      <div>
        <Label>Company Name</Label>
        <Input
          className=' border-WHITE/50' 
          value={company} 
          onChange={(e) => setCompany(e.target.value)} 
          disabled={isPending} 
        />
      </div>
      <Button
        type="submit"
        disabled={isPending}
        className="mt-4 bg-primary text-BLACK w-full"
      >
        {isPending ? <Icons.spinner className='animate-spin' height={15} width={15}/> : "Update"}
      </Button>
    </form>
  );
}

export default CompanyNameForm;
