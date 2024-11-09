"use client"

import { DndContext, MouseSensor, TouchSensor, useSensor, useSensors } from "@dnd-kit/core";
import Designer from "./Designer";
import DesignerSidebar from "./DesignerSidebar";
import PreviewDialogBtn from "./PreviewDialogBtn";
import PublishFormBtn from "./PublishFormBtn";
import SaveFormBtn from "./SaveFormBtn";
import DragOverlayWrapper from "./DragOverlayWrapper";
import { Survey } from "@prisma/client";
import useDesigner from "./hooks/UseDesigner";
import { useEffect } from "react";
  

function FormBuilder({ survey }: {survey: Survey}){

    const { setElements } = useDesigner()

    const mouseSensor = useSensor(MouseSensor, {
        activationConstraint: {
            distance: 10, //10 px
        }
    })

    const touchSensor = useSensor(TouchSensor, {
        activationConstraint: {
            delay: 300, //300 ms,
            tolerance: 5
        }
    })


    const sensors = useSensors(mouseSensor, touchSensor)

    useEffect(() => {
        const elements = survey.fields.map((field) =>({
            id: field.id,
            type: field.fieldType as 'TextField', //Add more as needed (I should make this an enum in db)
            extraAttributes: {
                label: field.fieldQuestion,
                helperText: field.helperText,
                placeholder: field.placeholder,
                required: field.required,
                sentimentAnalysis: field.sentimentAnalysis,
                rows: field.rows,
                height: field.height,
                options: field.options
            }
        }))

        setElements(elements)
    }, [survey, setElements])

    return (
        <DndContext sensors={sensors}>
            <div className="flex flex-col h-[calc(100vh-50px)]">
                <nav className="flex flex-row border-b border-WHITE/20 shadow-md py-3 px-12 justify-between">
                    <div className="flex flex-row gap-2 m-1 justify-center items-center">
                        <span className="text-WHITE/70 text-sm">Survey:</span>
                        <input className="text-WHITE bg-transparent rounded-md text-lg" placeholder="Title..." type="text" defaultValue={survey.surveyTitle} readOnly />
                    </div>

                    <div className="flex flex-row gap-5">
                        <PreviewDialogBtn />
                        <SaveFormBtn surveyId={survey.id}/>
                        <PublishFormBtn surveyId={survey.id}/>
                    </div>
                
                </nav>
        
                <div className="flex flex-row flex-grow bg-black/20 bg-paper gap-4 items-stretch justify-between">

                    <div>
                    {/* this empty div is to push Designer to middle */}
                    </div>
                    <div className="py-2">
                        <Designer/>
                    </div>
                    

                    <div className="">
                        <DesignerSidebar/>
                    </div>
                
                </div>
            </div>
            <DragOverlayWrapper/>
      </DndContext>
    );
  };
  
  export default FormBuilder;
