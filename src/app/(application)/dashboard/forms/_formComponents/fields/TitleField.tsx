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
import { LuHeading1 } from "react-icons/lu";
import { Input } from "@/app/_components/ui/input";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import useDesigner from "../hooks/UseDesigner"; 

const type: ElementsType = "TitleField";

const extraAttributes = {
  title: "Title field",
}

export const TitleFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: LuHeading1,
        label: "Title Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true
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
    const { title } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full">
            <Label className="text-white/50">Title Field</Label>
            <p className="text-3xl">{title}</p>
        </div>
    );
}

const propertiesSchema = z.object({
    title: z.string().min(2).max(150),
})

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}){

    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            title: element.extraAttributes.title
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

        const { title} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {title}
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
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
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
          </form>
        </Form>
      );
      
}


function FormComponent({elementInstance}: {elementInstance: FormElementInstance}){

  const element = elementInstance as CustomInstance
  const { title } = element.extraAttributes;

  return (
    <p className="text-3xl place-self-center">{title}</p>
  );
}