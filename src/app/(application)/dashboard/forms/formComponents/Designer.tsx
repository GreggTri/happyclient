"use client"

import { cn } from "@/app/lib/utils";
import { useDroppable } from "@dnd-kit/core";
import { useState } from "react";

function Designer() {
    const [elements, setElements] = useState<FormElementInstance[]>([])
    const droppable = useDroppable({
        id: "designer-drop-area",
        data: {
            isDesignerDropArea: true,
        }
    })

    return (
      <div
        ref={droppable.setNodeRef}
        
        className={cn("flex-grow h-full bg-background rounded-xl p-4 flex justify-center w-[600px] shadow-lg",
            droppable.isOver && "ring-2 ring-primary/20"
        )}
      > 
        {!droppable.isOver && (
            <p className="text-3xl text-muted-foreground self-center font-bold">Drop Here</p>
        )}
        {droppable.isOver && (
            <div className="w-full">
                <div className="h-[100px] rounded-md bg-primary/20 self-start">

                </div>
            </div>
        )}
      </div>
    );
  }
  
  export default Designer;
  