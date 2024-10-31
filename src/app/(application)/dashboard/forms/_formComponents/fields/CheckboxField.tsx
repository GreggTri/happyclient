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
import { IoMdCheckbox } from "react-icons/io";
import { Input } from "@/app/_components/ui/input";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import useDesigner from "../hooks/UseDesigner"; 
import { Switch } from "@/app/_components/ui/switch";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";

const type: ElementsType = "CheckboxField";

const extraAttributes = {
    label: "Checkbox field",
    helperText: "Helper text",
    required: false,
}

export const CheckboxFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: IoMdCheckbox,
        label: "Checkbox Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: (formElement: FormElementInstance, currentValue: string): boolean => {
      const element = formElement as CustomInstance;
      if(element.extraAttributes.required) {
        return currentValue === "true"
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
    const id = `checkbox-${element.id}`

    return (
        <div className="flex items-top space-x-2">
            <Checkbox id={id}/>
            <div className="grid pag-1.5 leading-none">
              <Label htmlFor={id}>
                  {label}
                  {required && <span className="text-white/50 px-2 text-xs">(Required)</span>}
              </Label>
              
              {helperText && <p className="text-white/50 text-[0.8rem]">{helperText}</p> }
            </div>
            
        </div>
    );
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(150),
    helperText: z.string().max(250),
    required: z.boolean().default(false)
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
  const [value, setValue] = useState<boolean>(defaultValue === "true" ? true : false)
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid == true);

  }, [isInvalid])

  const id = `checkbox-${element.id}`

  return (
      <div className="flex items-top space-x-2">
          <Checkbox 
            id={id} 
            checked={value}
            className={cn(error && "border-red-500")}
            onCheckedChange={(checked) => {
              let value = false;

              if (checked === true) value = true;

              setValue(value)
              if(!submitValue) return;

              const stringValue = value ? "true" : "false"
              const valid = CheckboxFieldFormElement.validate(element, stringValue)
              setError(!valid)

              submitValue(element.id, stringValue)
            }} 
          />
          <div className="grid pag-1.5 leading-none">
            <Label htmlFor={id} className={cn(error && 'border-red-500')}>
                {label}
                {required && <span className="text-white/50 px-2 text-xs">(Required)</span>}
            </Label>
            
            {helperText && <p className={cn(error && 'border-red-500', "text-white/50 text-[0.8rem]")}>{helperText}</p> }
          </div>
          
      </div>
  );
}