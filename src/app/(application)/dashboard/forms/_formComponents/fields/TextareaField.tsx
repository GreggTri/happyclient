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
import { BsTextareaResize } from "react-icons/bs";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";

const type: ElementsType = "TextareaField";

const extraAttributes = {
  label: "Text area",
  helperText: "Helper text",
  required: false,
  placeholder: "Value here...",
  rows: 3
}

export const TextareaFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: BsTextareaResize,
        label: "Textarea Field"
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
    const { label, required, placeholder, helperText } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Textarea readOnly disabled placeholder={placeholder} className="placeholder:text-WHITE/50 border"/>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p> }
        </div>
    );
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(150),
    helperText: z.string().max(250),
    required: z.boolean().default(false),
    placeholder: z.string().max(50),
    rows: z.number().min(1).max(10)
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
            placeholder: element.extraAttributes.placeholder,
            rows: element.extraAttributes.rows
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

        const { label, helperText, placeholder, required, rows} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {label, helperText, placeholder, required, rows}
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
              name="placeholder"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placeholder</FormLabel>
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
                    The placeholder of the field.
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
              name="rows"
              render={({ field }) => (
                <FormItem className="pb-4">
                  <FormLabel>Rows: {form.watch("rows")}</FormLabel>
                  <FormControl>
                    <Slider 
                      defaultValue={[field.value]}
                      min={1}
                      max={10}
                      step={1}
                      onValueChange={(value) => {
                        field.onChange(value[0])
                      }}
                      
                    />
                  </FormControl>
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
  const { label, required, placeholder, helperText, rows } = element.extraAttributes;
  const [value, setValue] = useState(defaultValue || "")
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid == true);

  }, [isInvalid])

  return (
      <div className="flex flex-col gap-2 w-full">
          <Label className={cn(error && "text-red-500")}>
              {label}
              {required && "*"}
          </Label>
          <Textarea
            rows={rows} 
            onChange={(e) => setValue(e.target.value)}
            onBlur={(e) => {
              if (!submitValue) return;
              const valid = TextareaFieldFormElement.validate(element, e.target.value)
              setError(!valid)
              if(!valid) return;

              submitValue(element.id, e.target.value)
            }}
            value={value}
            placeholder={placeholder}
            className={cn(error && "border-red-500 placeholder:text-red-500", "placeholder:text-WHITE/50 border")}
          />
          {helperText && <p className={cn(error && "border-red-500 placeholder:text-red-500", "text-muted-foreground text-[0.8rem]")}>{helperText}</p> }
      </div>
  );
}