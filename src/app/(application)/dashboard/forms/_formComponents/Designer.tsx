"use client"

import { cn } from "@/app/lib/utils";
import { DragEndEvent, useDndMonitor, useDraggable, useDroppable } from "@dnd-kit/core";
import { ElementsType, FormElementInstance, FormElements } from "./FormElements";
import { v4 as uuidv4 } from 'uuid';
import useDesigner from "./hooks/UseDesigner";
import { useState } from "react";
import { Icons } from "@/app/_components/icons";
import { Button } from "@/app/_components/ui/button";

function Designer() {
    
  const {elements, addElement, selectedElement, setSelectedElement, removeElement} = useDesigner()
    
  const droppable = useDroppable({
      id: "designer-drop-area",
      data: {
          isDesignerDropArea: true,
      }
  })

  useDndMonitor({
    onDragEnd: (event: DragEndEvent) => {
        const {active, over} = event;
        if(!active || !over) return;

        //FIRST SCENARIO
        const isDesignerBtnElement = active.data?.current?.isDesignerBtnElement;
        const isDroppingOverDesignerDropArea = over.data?.current?.isDesignerDropArea

        const droppingSidebarBtnOverDesignerDropArea = isDesignerBtnElement && isDroppingOverDesignerDropArea
        
        if(droppingSidebarBtnOverDesignerDropArea){
          const type = active.data?.current?.type;
          const newElement = FormElements[type as ElementsType].construct(
            uuidv4()
          )

          addElement(elements.length, newElement)
        
          
         
        }

        const isDesignerElement = active.data?.current?.isDesignerElement
        const droppingDesignerElementOverDropArea = isDesignerElement && isDroppingOverDesignerDropArea

        if(droppingDesignerElementOverDropArea){
          const activeElementIndex = elements.findIndex((el) => el.id === active.data?.current?.elementId)
          const activeElement = {...elements[activeElementIndex]}
          
          removeElement(active.data?.current?.elementId)
          
          addElement(elements.length, activeElement)

        }


        //SECOND SCENARIO
        const isDroppingOverDesignerElement = over.data?.current?.isTopHalfDesignerElement || over.data?.current?.isBottomHalfDesignerElement

        const droppingSidebarBtnOverDesignerElement = isDesignerBtnElement && isDroppingOverDesignerElement

        
        if(droppingSidebarBtnOverDesignerElement){
          const type = active.data?.current?.type;
          const newElement = FormElements[type as ElementsType].construct(
            uuidv4()
          )
          const overId = over.data?.current?.elementId
          const overElementIndex = elements.findIndex((el) => el.id === overId)

          if(overElementIndex === -1){
            throw new Error("element not found!")
          }
          let indexForNewElement = overElementIndex //assume top half

          //check for if bottom half
          if(over.data?.current?.isBottomHalfDesignerElement){
            indexForNewElement = overElementIndex + 1
          }
          addElement(indexForNewElement, newElement)
        }


        //THIRD SCENARIO
        const isDraggingDesignerElement = active.data?.current?.isDesignerElement

        const draggingDesignerElementOverAnother = isDroppingOverDesignerElement && isDraggingDesignerElement

        if(draggingDesignerElementOverAnother){
          const activeId = active.data?.current?.elementId;
          const activeElementIndex = elements.findIndex((el) => el.id === activeId);
          const activeElement = { ...elements[activeElementIndex] };

          // Find where the element is being dropped
          const overId = over.data?.current?.elementId;
          const overElementIndex = elements.findIndex((el) => el.id === overId);

          if (activeElementIndex === -1 || overElementIndex === -1) {
            throw new Error("element not found");
          }

          // Calculate where to add the element before removing it
          let indexForNewElement = overElementIndex; // default to top half

          // Adjust for bottom half case
          if (over.data?.current?.isBottomHalfDesignerElement) {
            indexForNewElement = overElementIndex + 1;
          }

          // Adjust indexForNewElement if removing the active element causes a shift
          if (activeElementIndex < indexForNewElement) {
            indexForNewElement -= 1;
          }

          // Remove active element after calculating the index
          removeElement(activeId);

          // Add the active element at the correct new position
          addElement(indexForNewElement, activeElement);
        }
    },
  })

  return (
    <div
      ref={droppable.setNodeRef}
      onClick={() => {
        if(selectedElement) setSelectedElement(null)
      }}
      className={cn("flex-grow h-full bg-background rounded-xl p-4 flex justify-center w-[600px] shadow-lg",
          droppable.isOver && "ring-2 ring-primary/20"
      )}
    > 
      {!droppable.isOver && elements.length === 0 && (
          <p className="text-3xl text-muted-foreground self-center font-bold">Drop Here</p>
      )}
      {droppable.isOver && elements.length === 0 &&(
          <div className="w-full">
              <div className="h-[100px] rounded-md bg-primary/20 self-start">

              </div>
          </div>
      )}

      {elements.length > 0 && (
        <div className="flexl flex-col w-full gap-2 p-1">
            {elements.map((element) => (
              <DesignerElementWrapper key={element.id} element={element} />
            ))}
        </div>
      )}
    </div>
  );
}


function DesignerElementWrapper({element}: {element: FormElementInstance}){

  const { removeElement, selectedElement, setSelectedElement } = useDesigner()

  const DesignerElement = FormElements[element.type].designerComponent

  const [mouseIsOver, setMouseIsOver] = useState<boolean>(false);

  const topHalf = useDroppable({
    id: element.id + "-top",
    data: {
      type: element.type,
      elementId: element.id,
      isTopHalfDesignerElement: true
    }
  })

  const bottomHalf = useDroppable({
    id: element.id + "-bottom",
    data: {
      type: element.type,
      elementId: element.id,
      isBottomHalfDesignerElement: true
    }
  })

  const draggable = useDraggable({
    id: element.id + "-drag-handler",
    data: {
      type: element.type,
      elementId: element.id,
      isDesignerElement: true
    }
  })

  if (draggable.isDragging) return null;

  return (
    <div 
      ref={draggable.setNodeRef}
      {...draggable.listeners}
      {...draggable.attributes}
      className="relative h-[120px] mb-2 flex flex-col bg-black/20 text-text hover:cursor-pointer hover:bg-background rounded-md ring-1 ring-text/20 ring-inset"
      onMouseEnter={() => {
        setMouseIsOver(true)
      }}
      onMouseLeave={() => {
        setMouseIsOver(false)
      }}
      onClick={(e) => {
        e.stopPropagation()
        setSelectedElement(element)
      }}
    >
      <div 
        ref={topHalf.setNodeRef} 
        className="absolute  w-full h-1/2 rounded-t-md"
      />
      <div 
        ref={bottomHalf.setNodeRef} 
        className="absolute w-full bottom-0 h-1/2 rounded-b-md"
      />
      {mouseIsOver && (
        <>
          <div className="absolute right-0 h-full">
            <Button 
              className="flex justify-center h-full border-none rounded-md rounded-l-none bg-red-500"
              variant={"outline"}
              onClick={(e) => {
                e.stopPropagation()
                if(element.id === selectedElement?.id){
                  setSelectedElement(null)
                }
                
                removeElement(element.id)
              }}
            >
              <Icons.trash width={20} height={20}/>
            </Button>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse">
            <p className="text-muted-foreground text-sm">
              Click for properties or drag to move
            </p>
          </div>
        </>
      )}
      {topHalf.isOver && (<div className="absolute top-0 w-full rounded-md h-1 bg-primary rounded-b-none"></div>)}
      
      <div className={cn("flex w-full h-[120px] opacity-100 items-center rounded-md bg-accent/40 px-4 py-2 pointer-events-none",
        mouseIsOver && "opacity-30"
      )}>
        <DesignerElement elementInstance={element} />
      </div>
      {bottomHalf.isOver && (<div className="absolute bottom-0 w-full rounded-md h-1 bg-primary rounded-t-none"></div>)}
    </div>
  );
}

export default Designer;
  