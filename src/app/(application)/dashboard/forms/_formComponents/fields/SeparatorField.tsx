"use client";

import { Label } from "@/components/ui/label";
import { ElementsType, FormElement } from "../FormElements"
import { RiSeparator } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";

const type: ElementsType = "SeparatorField";

export const SeparatorFieldFormElement: FormElement = {
    type,
    construct: (id: string) => ({
        id,
        type
    }),
    designerBtnElement: {
        icon: RiSeparator,
        label: "Separator Field"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    propertiesComponent: PropertiesComponent,

    validate: () => true
}

function DesignerComponent() {

  return (
    <div className="flex flex-col gap-2 w-full">
      <Label className="text-white/50">Separator Field</Label>
      <Separator className="bg-white/70 rounded-md"/>
    </div>
  );
}

function PropertiesComponent(){

  return <div>No properties for this element</div>
      
}


function FormComponent(){
  return <Separator className="bg-white/70 rounded-md"/>
}