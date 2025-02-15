"use client";

import { Label } from "@/components/ui/label";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form";
import { ElementsType, FormElement, FormElementInstance, SubmitFunction } from "../FormElements"
import { Input } from "@/app/_components/ui/input";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import useDesigner from "../hooks/UseDesigner"; 
import { Switch } from "@/app/_components/ui/switch";
import { cn } from "@/lib/utils";
import { BsFillCalendarDateFill } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

const type: ElementsType = "DateField";

const extraAttributes = {
    label: "Date field",
    helperText: "Choose a date",
    required: false,
}

export const DateFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: BsFillCalendarDateFill,
        label: "Date Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
      const element = formElement as CustomInstance;
      if(element.extraAttributes.required) {
        return currentValue. length > 0;
      }

      return true;
    }
}

type CustomInstance = FormElementInstance & {
    extraAttributes: typeof extraAttributes
}

function DesignerComponent({
    elementInstance
}: {
    elementInstance: FormElementInstance
}) {

    const element = elementInstance as CustomInstance
    const { label, required, helperText } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && <span className="text-white/50 px-2 text-xs">(Required)</span>}
            </Label>
            <Button variant={"outline"} className="w-full justify-start text-left">
              <CalendarIcon className="mr-2 h-4 w-6"/>
              <span>Choose a date</span>
            </Button>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p> }
        </div>
    );
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(150),
    helperText: z.string().max(250),
    required: z.boolean().default(false),
})

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}){

    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

        const { label, helperText, required} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {label, helperText, required}
        })
    }

    return (
        <Form {...form}>
          <form
            onBlur={form.handleSubmit(applyChanges)} 
            className="space-y-3"
            onSubmit={(e) => {
                e.preventDefault()
            }}
        >
            <FormField
              control={form.control}
              name="label"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input 
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.currentTarget.blur();
                            }
                        }}
                        className="border"
                    />
                  </FormControl>
                  <FormDescription className="text-WHITE/50">
                    What question would you like your clients to answer?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="helperText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Helper Text</FormLabel>
                  <FormControl>
                    <Input 
                        {...field}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.currentTarget.blur();
                            }
                        }}
                        className="border"
                    />
                  </FormControl>
                  <FormDescription className="text-WHITE/50">
                    This is a little bit of flavor text <br /> to help guide your client in answering the question.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                  <div className="space-y-0.5">
                    <FormLabel>Required</FormLabel>
                    <FormDescription className="text-WHITE/50">
                        This forces the respondant to answer this question.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                    />
                  </FormControl>
                  
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      );
      
}


function FormComponent({elementInstance, submitValue, isInvalid, defaultValue}: {elementInstance: FormElementInstance, submitValue?: SubmitFunction, isInvalid?: boolean, defaultValue?: string}){
    
  const element = elementInstance as CustomInstance
  const { label, required, helperText } = element.extraAttributes;
  const [date, setDate] = useState<Date | undefined>(
    defaultValue ? new Date(defaultValue) : undefined
  )
  const [error, setError] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false); // New state to control popover open

  useEffect(() => {
    setError(isInvalid == true);

  }, [isInvalid])

  return (
      <div className="flex flex-col gap-2 w-full">
          <Label className={cn(error && "text-red-500")}>
              {label}
              {required && <span className="text-white/50 px-2 text-xs">(Required)</span>}
          </Label>
          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                  variant={"outline"} 
                  className={cn(
                    "w-full justify-start text-left font-normal border-WHITE/50",
                    !date && "text-muted-foreground",
                    error && "border-red-500"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-6"/>
                  {date ? format(date, "PPP") : <span>Choose a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent 
              className="w-auto p-0" 
              align="start" 
            >
              <Calendar
                mode="single"
                
                className='bg-black rounded-md'
                selected={date}
                onSelect={(selectedDate) => {
                  setDate(selectedDate); // Update local state for UI
                  console.log(selectedDate);
                  if (!submitValue) return;

                  const value = selectedDate?.toUTCString() || "";

                  const valid = DateFieldFormElement.validate(element, value)
                  setError(!valid)
                  
                  submitValue(element.id, value)
                  // Close popover after selection
                  setIsPopoverOpen(false);

                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {helperText && <p className={cn(error && "border-red-500 placeholder:text-red-500", "text-muted-foreground text-[0.8rem]")}>{helperText}</p> }
      </div>
  );
}