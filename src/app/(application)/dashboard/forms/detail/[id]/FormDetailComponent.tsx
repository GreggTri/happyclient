'use client'

import React, { useEffect, useState } from 'react'
import { Survey } from '@prisma/client'
import { z } from 'zod'
import { Calendar } from "@/components/ui/calendar"
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Icons } from '@/app/_components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from '@/hooks/use-toast'
import { createScheduleSender } from './actions'
import { useRouter } from 'next/navigation'

interface User {
  id: string;
  firstName: string;
  lastName: string;
}

const formSchema = z.object({
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
  scheduledSend: z.date(),
  intervalTiming: z.enum(['ONCE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALY', 'ANNUALY']),
  expirationDate: z.enum(['AFTER_1_DAY', 'AFTER_7_DAYS', 'AFTER_14_DAYS']),
  attachedUsers: z.array(z.object({
    userId: z.string().min(1, "Employee required, if input is shown"),
  })).optional(),
  surveyId: z.string()
})

type FormValues = z.infer<typeof formSchema>

function FormDetailComponent({survey}: {survey: Survey}) {

  const router = useRouter()
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = useState<Date>()
  const [usersData, setUsersData] = useState<User[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputEmailValue, setInputEmailValue] = React.useState('');
  const [invalidEmails, setInvalidEmails] = useState<string[]>([]);
  const [duplicateEmails, setDuplicateEmails] = useState<string[]>([]);
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: [],
      scheduledSend: new Date(),
      intervalTiming: 'ONCE',
      expirationDate: 'AFTER_7_DAYS',
      attachedUsers: [{ userId: '' }],
      surveyId: survey.id
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachedUsers",
  })

  //we grab all users if customer wants to add users to schedule group.
  useEffect(() => {
    async function fetchUsers(){
      try{
        const allUsers = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/users`)
        if (allUsers.status == 500) {
          throw new Error('Network response was not ok');
        }
        const result = await allUsers.json();
        setUsersData(result);
      } catch(error){
        if (error instanceof Error) {
          console.log(error);
          setError(error.message);  // Now TypeScript knows error is of type Error
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    fetchUsers()

  }, [])

  //this is if an error occurs trying to get userData
  if (error) {
    return <div className='flex justify-center text-red-500 my-20'>Error! Please contact Support.</div>;
  }
  

  //this is for loading
  if (!usersData) {
    return (
      <div className='flex h-full w-screen justify-center items-center my-20'>
        <Icons.spinner width={20} height={20} className=' animate-spin'/>
      </div>
    );
  }


  const onSubmit = async (data: FormValues) => {
    try {
        
      const newGroup = await createScheduleSender(data);
      console.log(newGroup);

      if( newGroup && 'id' in newGroup){
        toast({
          title: "Scheduled Send has been created!",
          description: "Scheduled ${newGroup.emailcount} clients to be emailed!",
          variant: "destructive",
          className: "bg-green-500 border-none"
        })

        router.refresh()
      } else {
        throw new Error("Failed to create Schedule")
      }
          
    } catch (error) {
      toast({
        title: "Could not send out Schedule!",
        description: "Something went wrong! Please try again later and/or contact support!",
        variant: "destructive",
        className: "bg-red-500 border-none"
      })
    }
  }
  
  return (
    <div className="min-h-screen bg-background text-white flex items-center justify-center">
      <div className="w-full max-w-3xl p-8 space-y-8">
        <h1 className="text-4xl font-semibold tracking-tight">
          Send Out Survey: <br /> <b className='text-primary'>{survey.surveyTitle}</b>
        </h1>
        <p className="text-lg text-WHITE/50">
          Configure when and how your survey should be sent.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

            <div className='flex flex-col'>
              <FormLabel>Attached Users</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`attachedUsers.${index}.userId`}
                    render={({ field }) => (
                      <FormItem>
                        <Select onValueChange={field.onChange} defaultValue={field.value} >
                          <FormControl>
                            <SelectTrigger className="border-WHITE/50">
                              <SelectValue placeholder="Select An Employee" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className='z-15 bg-black rounded-md border-WHITE/50'>
                            {usersData && usersData.map((user) => (
                                <SelectItem 
                                  key={user.id} 
                                  value={user.id}
                                  className='hover:bg-WHITE/50 rounded-md'
                                >
                                  {user.firstName} {user.lastName}
                                </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage className='text-red-500' />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className=''
                    onClick={() => remove(index)}
                  >
                    <Icons.close className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-[20%]"
                onClick={() => append({ userId: '' })}
              >
                <Icons.FilePlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>

            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter client emails separated by commas or spaces"
                      className=" border-WHITE/50 mt-1 max-h-48 min-h-[100px] overflow-y-auto placeholder:text-WHITE/50"
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
            
            
            
            <FormField
              control={form.control}
              name="scheduledSend"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Scheduled Send Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full justify-start text-left font-normal border-WHITE/50",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        className='bg-black rounded-md'
                        selected={field.value}
                        onSelect={(selectedDate) => {
                          setDate(selectedDate); // Update local state for UI
                          field.onChange(selectedDate); // Update form field data
                        }}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="intervalTiming"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Interval Timing</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} >
                    <FormControl>
                      <SelectTrigger className="border-WHITE/50">
                        <SelectValue placeholder="Select interval" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='z-15 bg-black rounded-md border-WHITE/50'>
                      <SelectItem value="ONCE" className='hover:bg-WHITE/50 rounded-md'>Once</SelectItem>
                      <SelectItem value="WEEKLY" className='hover:bg-WHITE/50 rounded-md'>Weekly</SelectItem>
                      <SelectItem value="BIWEEKLY" className='hover:bg-WHITE/50 rounded-md'>Biweekly</SelectItem>
                      <SelectItem value="MONTHLY" className='hover:bg-WHITE/50 rounded-md'>Monthly</SelectItem>
                      <SelectItem value="QUARTERLY" className='hover:bg-WHITE/50 rounded-md'>Quarterly</SelectItem>
                      <SelectItem value="SEMIANNUALY" className='hover:bg-WHITE/50 rounded-md'>Semi-annually</SelectItem>
                      <SelectItem value="ANNUALY" className='hover:bg-WHITE/50 rounded-md'>Annually</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="expirationDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expiration Date</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="border-WHITE/50">
                        <SelectValue placeholder="Select expiration" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent className='bg-black rounded-md border-WHITE/50 p-1 '>
                      <SelectItem value="AFTER_1_DAY" className='hover:bg-WHITE/50 rounded-md'>After 1 Day</SelectItem>
                      <SelectItem value="AFTER_7_DAYS" className='hover:bg-WHITE/50 rounded-md'>After 7 Days</SelectItem>
                      <SelectItem value="AFTER_14_DAYS" className='hover:bg-WHITE/50 rounded-md'>After 14 Days</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="surveyId"
              render={({  }) => (
                <FormItem className='hidden'>
                  <input type="hidden" value={survey.id} />
                </FormItem>
              )}
            />
            
            <Button type="submit" className="w-full bg-primary text-black hover:bg-primary/90">
              Set Schedule!
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default FormDetailComponent