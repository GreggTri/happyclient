'use client'

import React from 'react'
import { Survey } from '@prisma/client'
import { z } from 'zod'
import { Calendar } from "@/components/ui/calendar"
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/app/_components/ui/input'
import { Button } from '@/components/ui/button'
import { Icons } from '@/app/_components/icons'
import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/ui/popover'
import { cn } from '@/lib/utils'
import { Calendar as CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'



const formSchema = z.object({
  emails: z.array(z.string().email()).min(1, "At least one email is required"),
  scheduledSend: z.date(),
  intervalTiming: z.enum(['ONCE', 'WEEKLY', 'BIWEEKLY', 'MONTHLY', 'QUARTERLY', 'SEMIANNUALY', 'ANNUALY']).optional(),
  expirationDate: z.enum(['AFTER_1_DAY', 'AFTER_7_DAYS', 'AFTER_14_DAYS']),
  attachedUsers: z.array(z.object({
    userId: z.string().min(1, "User ID is required"),
    role: z.string().min(1, "Role is required"),
  })),
})

type FormValues = z.infer<typeof formSchema>

function FormDetailComponent({survey}: {survey: Survey}) {

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [date, setDate] = React.useState<Date>()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      emails: [],
      scheduledSend: new Date(),
      intervalTiming: undefined,
      expirationDate: 'AFTER_7_DAYS',
      attachedUsers: [{ userId: '', role: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "attachedUsers",
  })

  const onSubmit = (data: FormValues) => {
    console.log(data)
    // Here you would typically send the form data to your backend
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
            <FormField
              control={form.control}
              name="emails"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Emails</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter emails separated by commas or spaces"
                      className=" border-WHITE/50 mt-1 max-h-48 min-h-[100px] overflow-y-auto placeholder:text-WHITE/50"
                      onChange={(e) => {
                        const emails = e.target.value.split(/[\s,]+/).filter(Boolean)
                        field.onChange(emails)
                      }}
                      value={field.value.join(', ')}
                    />
                  </FormControl>
                  <FormDescription className="text-right">
                    {field.value.length} email(s) entered
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className='flex flex-col'>
              <FormLabel>Attached Users</FormLabel>
              {fields.map((field, index) => (
                <div key={field.id} className="flex space-x-2 mt-2">
                  <FormField
                    control={form.control}
                    name={`attachedUsers.${index}.userId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="User ID"
                            {...field}
                            className="border-WHITE/50"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`attachedUsers.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            placeholder="Role"
                            {...field}
                            className="border-WHITE/50"
                          />
                        </FormControl>
                        <FormMessage />
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
                onClick={() => append({ userId: '', role: '' })}
              >
                <Icons.FilePlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </div>
            
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