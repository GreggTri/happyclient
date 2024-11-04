'use client'

import React from 'react'
import { addEmailDomain } from './actions';
import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation'
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/app/_components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  domain: z.string().regex(
    /^(?:[a-z0-9]+(?:-[a-z0-9]+)*\.)+[a-z]{2,}$/i,
    "Must be a valid domain with a subdomain"
  )
})

type FormValues = z.infer<typeof formSchema>

function SetupResendEmailForm() {

  const router = useRouter()
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      domain: ""
    },
  })
  

  const onSubmit = async (data: FormValues) => {
    try {
        
      const domain = await addEmailDomain(data);
      console.log(domain);

      if( domain && 'id' in domain){
        toast({
          title: "Domain has been created!",
          description: "You can now send your surveys to your clients!",
          variant: "destructive",
          className: "bg-green-500 border-none"
        })

        router.refresh()
      } else {
        throw new Error("Failed to create Schedule")
      }
          
    } catch (error) {
      toast({
        title: "Could not create your domain!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  }

  return (
    <div className='my-4 w-full'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

          <FormField
            control={form.control}
            name="domain"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Domain</FormLabel>
                <FormControl>
                  <Input 
                      {...field}
                      placeholder='Domain to send emails from...'
                      className="border border-gray-500"
                  />
                </FormControl>
                <FormMessage className='text-red-500'/>
                <FormDescription className="text-left my-5">
                  It is <i className='text-red-500 underline'>imperative</i> that you use a subdomain for this domain. <br />
                  Ex: &lt;subdomain&gt;.lawfirm.com
                </FormDescription>
              </FormItem>
            )}
          />
          <p className='border rounded-md p-5 border-red-500 text-red-300'>Deliveratibility of emails is super important. 
            If in any case your email domains trust factor is tarnished, we only want that trust to be lost for the specific 
            subdomain that we selected and not your regular domain.
             <br /> So we use subdomains instead!
          </p>
          <Button className='text-black'>Create email domain</Button>
        </form>
      </Form>
    </div>
  )
}

export default SetupResendEmailForm