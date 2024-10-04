import React from 'react'
import { FormElement } from './FormElements'
import { useDraggable } from '@dnd-kit/core'
import { cn } from '@/app/lib/utils'

function SidebarBtnElement({
    formElement
}: {
    formElement: FormElement
}) {

    const { label, icon: Icon} = formElement.designerBtnElement
    const draggable = useDraggable({
        id: `designer-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtnElement: true
        }
    })
    return (
        <button 
            ref={draggable.setNodeRef} 
            className={cn('flex flex-col gap-2 h-[120px] cursor-grab border rounded-md',
                draggable.isDragging && "ring-2 ring-primary"
            )}
            {...draggable.listeners}
            {...draggable.attributes}
        >
            <Icon className="h-8 w-8 text-primary cursor-grab"/>
            <p className="text-xs">{label}</p>
        </button>
    )
}

export function SidebarBtnElementDragOverlay({
    formElement
}: {
    formElement: FormElement
}) {

    const { label, icon: Icon} = formElement.designerBtnElement
    const draggable = useDraggable({
        id: `designer-btn-${formElement.type}`,
        data: {
            type: formElement.type,
            isDesignerBtnElement: true
        }
    })
    return (
        <button 
            ref={draggable.setNodeRef} 
            className={'flex flex-col gap-2 h-[120px] cursor-grab border rounded-md'}
        >
            <Icon className="h-8 w-8 text-primary cursor-grab"/>
            <p className="text-xs">{label}</p>
        </button>
    )
}

export default SidebarBtnElement