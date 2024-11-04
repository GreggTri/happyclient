'use client'

import { Input } from '@/app/_components/ui/input'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { toast } from '@/hooks/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { upsertCustomDomain } from './actions'

const domainFormSchema = z.object({
    domain: z
    .string()
    .regex(
      /^(?=.{4,253}$)(([a-zA-Z0-9][-a-zA-Z0-9]{0,62})\.)+([a-zA-Z]{2,63})$/,
      'Invalid domain format'
    )
    .refine(
      (val) => val.split('.').length >= 3,
      'Domain must include a subdomain (e.g., subdomain.domain.com)'
    ),
})
  
type domainSchemaType = z.infer<typeof domainFormSchema>

function CustomDomainForm() {

    const form = useForm<domainSchemaType>({
        resolver: zodResolver(domainFormSchema),
        defaultValues: {
            domain: ""
        }
    })

    const onSubmit = async (data: domainSchemaType) => {
        try {
          const customDomainOrg = await upsertCustomDomain(data);

          if(customDomainOrg){
            toast({
                title: "Success!",
                description: `Custom domain has been created`,
                variant: "destructive",
                className: "bg-green-500 border-none"
            })
          } else {
            throw new Error("Renaming survey failed!")
          }
          
        } catch (error) {
          toast({
            title: "Domain Creation failed.",
            description: "Something went wrong, contact our team if this happens again!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
            <FormField
                control={form.control}
                name="domain"
                render={({field}) => (
                <FormItem>
                    <FormLabel>
                        Domain
                    </FormLabel>
                    <FormControl>
                        <Input {...field} className='border border-gray-500'/>
                    </FormControl>
                </FormItem>
                )}  
            />
            
            <Button className='text-black'>Create Survey Domain</Button>
            </form>
        </Form>
    )
}
export default CustomDomainForm