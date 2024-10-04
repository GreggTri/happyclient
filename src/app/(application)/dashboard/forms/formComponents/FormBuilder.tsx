"use client"

import { DndContext } from "@dnd-kit/core";
import Designer from "./Designer";
import DesignerSidebar from "./DesignerSidebar";
import PreviewDialogBtn from "./PreviewDialogBtn";
import PublishFormBtn from "./PublishFormBtn";
import SaveFormBtn from "./SaveFormBtn";
import DragOverlayWrapper from "./DragOverlayWrapper";

type FieldOptions = {
    value:   string
    label:   string 
}

type SurveyFields = {
    fieldQuestion:  string;
    fieldInputType: string;     // E.g., text, radio, checkbox, select, date
    options: FieldOptions[] | null;  // Optional; only needed for radio, checkbox, or select fields
    position: number
}

type SurveyData = {
    id: string;
    surveyTitle: string;
    surveyDescription: string,
    isPublished: boolean,
    fields: SurveyFields[],
    tenantId: string
};
  
interface FormBuilderProps {
    surveyData?: SurveyData; // Optional prop
}
  
const FormBuilder: React.FC<FormBuilderProps> = ({ surveyData }) => {

    return (
        <DndContext>
            <div className="flex flex-col h-[calc(100vh-50px)]">
                <nav className="flex flex-row border-b border-WHITE/20 shadow-md py-3 px-12 justify-between">
                    <div className="flex flex-row gap-2 m-2 justify-center items-center">
                        <span className="text-muted-foreground">Survey: </span>
                        <input className="text-BLACK px-1 rounded-md bg-WHITE/10" placeholder="Title..." type="text" defaultValue={surveyData?.surveyTitle || ""} />
                    </div>

                    <div className="flex flex-row gap-5">
                        <PreviewDialogBtn/>
                        <SaveFormBtn/>
                        <PublishFormBtn/>
                    </div>
                
                </nav>
        
                <div className="flex flex-row flex-grow bg-black/50 bg-paper gap-4 items-stretch justify-between">

                    <div>

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
