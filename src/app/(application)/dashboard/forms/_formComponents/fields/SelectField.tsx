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
import { RxDropdownMenu } from "react-icons/rx";
import { Input } from "@/app/_components/ui/input";
import { z } from "zod";
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from "react";
import useDesigner from "../hooks/UseDesigner"; 
import { Switch } from "@/app/_components/ui/switch";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectTrigger, SelectValue, SelectItem } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { AiOutlineClose, AiOutlinePlus } from "react-icons/ai";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";

const type: ElementsType = "SelectField";

const extraAttributes = {
    label: "Select field",
    helperText: "Helper text",
    required: false,
    options: []
}

export const SelectFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type,
        extraAttributes
    }),
    designerBtnElement: {
        icon: RxDropdownMenu,
        label: "Select Field"
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
            <Select>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select an answer..."/>
              </SelectTrigger>
            </Select>
            {helperText && <p className="text-muted-foreground text-[0.8rem]">{helperText}</p> }
        </div>
    );
}

const propertiesSchema = z.object({
    label: z.string().min(2).max(150),
    helperText: z.string().max(250),
    required: z.boolean().default(false),
    options: z.array(z.string()).default([])
})

type propertiesFormSchemaType = z.infer<typeof propertiesSchema>;

function PropertiesComponent({elementInstance}: {elementInstance: FormElementInstance}){

    const element = elementInstance as CustomInstance;
    const { updateElement, setSelectedElement } = useDesigner()
    const form = useForm<propertiesFormSchemaType>({
        resolver: zodResolver(propertiesSchema),
        mode: "onSubmit",
        defaultValues: {
            label: element.extraAttributes.label,
            helperText: element.extraAttributes.helperText,
            required: element.extraAttributes.required,
            options: element.extraAttributes.options
        }
    })

    useEffect(() => {
        form.reset(element.extraAttributes);

    }, [element, form])

    function applyChanges(values: propertiesFormSchemaType){

      const { label, helperText, required, options} = values;

      updateElement(element.id, {
          ...element,
          extraAttributes: {label, helperText, required, options}
      })

      toast({
        title: "Changes have been added!",
        description: "Please save survey in order to keep these changes",
        className: "bg-green-500 border-none text-lg"
      })

      setSelectedElement(null)
    }

    return (
      <ScrollArea >
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(applyChanges)} 
            className="space-y-3"
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
                        className="border border-white/50"
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
                        className="border border-white/50"
                    />
                  </FormControl>
                  <FormDescription className="text-WHITE/50">
                    This is a little bit of flavor text <br /> to help guide your client in answering the question.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-white/70"/>
            <FormField
              control={form.control}
              name="options"
              render={({ field }) => (
                <FormItem>
                  <div className="flex justify-between items-center">
                    <FormLabel>Options</FormLabel>
                    <Button className="gap-2 text-black" onClick={(e) => {
                      e.preventDefault()
                      form.setValue("options", field.value.concat("New option"))
                    }}>
                      <AiOutlinePlus/>
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2">
                      {form.watch("options").map((option, index) => (
                        <div key={index} className="flex items-center justify-between gap-1 ">
                          <Input
                            className="border border-white/50"
                            placeholder=""
                            value={option}
                            onChange={(e) => {
                              field.value[index] = e.target.value
                              field.onChange(field.value)
                            }}
                          />
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            onClick={e => {
                              e.preventDefault();
                              const newOptions = [...field.value]
                              newOptions.splice(index, 1)
                              field.onChange(newOptions)
                            }}
                          >
                            <AiOutlineClose/>
                          </Button>

                        </div>
                      ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator className="bg-white/70"/>
            <FormField
              control={form.control}
              name="required"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-lg border border-white/50 p-3 shadow-sm">
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
            <Separator className="bg-white/70"/>

            <Button className="w-full text-black shadow-md" type="submit">Complete Changes</Button>
          </form>
        </Form>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    );
      
}


function FormComponent({elementInstance, submitValue, isInvalid, defaultValue}: {elementInstance: FormElementInstance, submitValue?: SubmitFunction, isInvalid?: boolean, defaultValue?: string}){
    
  const element = elementInstance as CustomInstance
  const { label, required, helperText, options } = element.extraAttributes;
  const [value, setValue] = useState(defaultValue || "")
  const [error, setError] = useState(false)

  useEffect(() => {
    setError(isInvalid == true);

  }, [isInvalid])

  console.log(options);

  return (
      <div className="flex flex-col gap-2 w-full">
          <Label className={cn(error && "text-red-500")}>
              {label}
              {required && <span className="text-white/50 px-2 text-xs">(Required)</span>}
          </Label>
          <Select
            value={value}
            onValueChange={(value) => {
              setValue(value)
              if (!submitValue ) return;
              const valid = SelectFieldFormElement.validate(element, value)
              setError(!valid)
              
              submitValue(element.id, value)
            }}
          >
            <SelectTrigger 
              className={cn("w-full",
                error && "text-red-500"
              )}
            >
              <SelectValue placeholder="Select an answer..."/>
            </SelectTrigger>
            <SelectContent style={{ zIndex: 50 }} className=" bg-black rounded-md border-WHITE/50">
              {options.map(option => (
                <SelectItem 
                  key={option} 
                  value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {helperText && <p className={cn(error && "border-red-500 placeholder:text-red-500", "text-muted-foreground text-[0.8rem]")}>{helperText}</p> }
      </div>
  );
}