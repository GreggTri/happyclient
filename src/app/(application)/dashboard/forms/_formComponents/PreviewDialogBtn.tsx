"use client";

import React from "react";
import useDesigner from "./hooks/UseDesigner";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button";
import { MdPreview } from "react-icons/md";
import { FormElements } from "./FormElements";

// interface PreviewDialogBtnProps {
//   backgroundColor: string;
//   textColor: string;
//   primaryColor: string;
// }

function PreviewDialogBtn() {

  const { elements } = useDesigner()

  return (  
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"} className="border-primary text-primary hover:bg-primary hover:text-BLACK gap-2">
          <MdPreview className="w-6 h-6"/>
          Preview
        </Button>
      </DialogTrigger>
      <DialogContent className="w-screen h-screen max-h-screen max-w-full flex flex-col p-0 gap-0">
        <div className="px-4 py-2 border-b">
          <p className="text-lg font-bold text-WHITE">
            Form Preview
          </p>

          <p className="text-sm text-WHITE/50">
            This is how your form will look to your clients.

          </p>
        </div>
        <div className=" flex flex-col flex-grow items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-[620px] flex flex-col gap-4 bg-background h-full w-full rounded-2xl p-8 overflow-y-auto">
              {elements.map((element) => {
                  const FormComponent = FormElements[element.type].formComponent;

                  return <FormComponent key={element.id} elementInstance={element}/>
              })}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default PreviewDialogBtn;

