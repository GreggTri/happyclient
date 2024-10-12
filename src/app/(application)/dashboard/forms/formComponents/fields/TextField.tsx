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
import { ElementsType, FormElement, FormElementInstance } from "../FormElements"
import { MdTextFields } from "react-icons/md";
import { Input } from "@/app/_components/ui/input";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import useDesigner from "../hooks/UseDesigner"; 
import { Switch } from "@/app/_components/ui/switch";

const type: ElementsType = "TextField";

const extraAttributes = {
    label: "Text field",
    helperText: "Helper text",
    required: false,
    placeholder: "Value here..."
}

export const TextFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: MdTextFields,
        label: "Text Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,
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
            <Input readOnly disabled placeholder={placeholder} className="placeholder:text-WHITE/50 border"/>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p> }
        </div>
    );
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(150),
    helperText: z.string().max(250),
    required: z.boolean().default(false),
    placeholder: z.string().max(50)
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
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

        const { label, helperText, placeholder, required} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {label, helperText, placeholder, required}
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
                  <FormLabel>Label</FormLabel>
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
                    The label of the field. <br /> It will be displayed above the field.
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
                    The label of the field. <br /> It will be displayed above the field.
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
                        The label of the field. <br /> It will be displayed above the field.
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


function FormComponent({elementInstance}: {elementInstance: FormElementInstance}){
    
    const element = elementInstance as CustomInstance
    const { label, required, placeholder, helperText } = element.extraAttributes;

    return (
        <div className="flex flex-col gap-2 w-full">
            <Label>
                {label}
                {required && "*"}
            </Label>
            <Input placeholder={placeholder} className="placeholder:text-WHITE/50 border"/>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p> }
        </div>
    );
}