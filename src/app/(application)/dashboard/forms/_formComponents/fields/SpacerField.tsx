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
import { LuSeparatorHorizontal } from "react-icons/lu";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from "react";
import useDesigner from "../hooks/UseDesigner"; 
import { Slider } from "@/components/ui/slider";

const type: ElementsType = "SpacerField";

const extraAttributes = {
  height: 20, //px
}

export const SpacerFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: LuSeparatorHorizontal,
        label: "Spacer Field"
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
    const { height } = element.extraAttributes;
    return (
        <div className="flex flex-col gap-2 w-full items-center">
            <Label className="text-white/50">Spacer Field: {height}px</Label>
            <LuSeparatorHorizontal className="h-8 w-8"/>
        </div>
    );
}

const propertiesSchema = z.object({
    height: z.number().min(5).max(100),
})

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}){

    const element = elementInstance as CustomInstance;
    const { updateElement } = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onBlur",
        defaultValues: {
            height: element.extraAttributes.title
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

        const { height} = values;

        updateElement(element.id, {
            ...element,
            extraAttributes: {height}
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
              name="height"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Height (px): {form.watch("height")}</FormLabel>
                  <FormControl className="pt-2" >
                    <Slider 
                      value={[field.value]}
                      min={5}
                      max={100}
                      step={1}
                      onValueChange={(value) => {
                        field.onChange(value[0])
                      }}
                      
                    />
                  </FormControl>
                  <FormDescription className="text-WHITE/50">
                    Adds some extra spacing between different elements
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
  const { height } = element.extraAttributes;

  return <div style={{height, width: "100%"}}></div>
}