'use client'

import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/ui/popover'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { FinishEmailsGroupScheduleSender } from './actions'
import { toast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Icons } from '@/app/_components/icons'

const EditEmailsToGroupForm = z.object({
    emails: z.array(z.string().email()).min(1, "At least one email is required"),
    groupId: z.string()
})

type EditEmailsToGroupFormSchema = z.infer<typeof EditEmailsToGroupForm>

function FinishEmailsButtonComponent({groupId, isArchived}: {groupId: string, isArchived: boolean}) {

    const router = useRouter()
    
    const [inputEmailValue, setInputEmailValue] = useState('');
    const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
    const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);

    const form = useForm<EditEmailsToGroupFormSchema>({
        resolver: zodResolver(EditEmailsToGroupForm),
        defaultValues: {
        emails: [],
        groupId: groupId
        },
    })

    const validateEmails = (emails: string[]) => {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email regex
        const validEmails: string[] = [];
        const invalidEmails: string[] = [];
        const duplicates: string[] = [];
        const emailSet = new Set<string>(); // To track duplicates
    
        emails.forEach((email) => {
          if (emailPattern.test(email)) {
            if (emailSet.has(email)) {
              duplicates.push(email); // Add to invalid if it's a duplicate
            } else {
              validEmails.push(email);
              emailSet.add(email); // Track the email to avoid duplicates
            }
          } else {
            invalidEmails.push(email); // Invalid format
          }
        });
    
        return { validEmails, invalidEmails, duplicates };
    };
    
    const onSubmit = async (data: EditEmailsToGroupFormSchema) => {
        try {
            
          const updatedGroup = await FinishEmailsGroupScheduleSender(data);
    
          if(updatedGroup){
            toast({
              title: "Client Emails have been removed from survey!",
              description: `Removed ${updatedGroup.activeEmailCount} client email(s)`,
              variant: "destructive",
              className: "bg-green-500 border-none"
            })
    
            router.refresh()
          } else {
            throw new Error("Failed to update Schedule")
          }
              
        } catch (error) {
          toast({
            title: "Could not remove client emails from survey group!",
            description: "Something went wrong! Please try again later and/or contact support!",
            variant: "destructive",
            className: "bg-red-500 border-none"
          })
        }
    }
      

  return (
    <Popover>
        <PopoverTrigger asChild>
            <Button disabled={isArchived} className="disabled:cursor-not-allowed bg-red-500 hover:bg-red-600 text-white py-0 gap-1">
              <Icons.Minus height={15} width={15}/> Emails
            </Button>
        </PopoverTrigger>
        <PopoverContent className="flex flex-col w-[250px] bg-black text-xs cursor-default space-y-2 m-0 p-4 items-end">
            <Form {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                  
                  <FormField
                    control={form.control}
                    name="emails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Remove Emails</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter client emails separated by commas or spaces"
                            className=" border-WHITE/50 mt-1  max-h-48 min-h-[100px] overflow-y-auto placeholder:text-WHITE/50"
                            onChange={(e) => {
                              const input = e.target.value;
                              setInputEmailValue(input); // Store raw input value while typing
                            }}
                            onBlur={() => {
                              const emails = inputEmailValue.split(/[\s,]+/).filter(Boolean); // split input by commas or spaces
                              const { validEmails, invalidEmails, duplicates } = validateEmails(emails); // Validate emails
              
                              field.onChange(validEmails); // Update form field with valid emails
                              setInvalidEmails(invalidEmails); // Store invalid emails to display errors
                              setDuplicateEmails(duplicates)
                              setInputEmailValue(validEmails.join(', ')); // Reformat input with only valid emails
                            }}
                            value={inputEmailValue}
                          />
                        </FormControl>
                        <FormDescription className="text-right">
                          {field.value.length} email(s) entered
                        </FormDescription>
                        {invalidEmails.length > 0 && (
                          <FormMessage className="text-red-500">
                            Invalid email(s): {invalidEmails.join(', ')}
                          </FormMessage>
                        )}
                        {duplicateEmails.length > 0 && (
                          <FormMessage className="text-red-500">
                            duplicate email(s): {duplicateEmails.join(', ')}
                          </FormMessage>
                        )}
                        
                      </FormItem>
                    )}
                  />
                  <Button type="submit" className="w-full bg-red-500 text-black hover:bg-red-500/90">
                    Remove Emails!
                  </Button>
                </form>
            </Form>
        </PopoverContent>
    </Popover>
  )
}

export default FinishEmailsButtonComponent