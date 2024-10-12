import React from 'react'
import useDesigner from './hooks/UseDesigner'
import { FormElements } from './FormElements'
import { AiOutlineClose } from "react-icons/ai"
import { Button } from '@/app/_components/ui/button';
import { Separator } from '@/components/ui/separator';

function PropertiesFormSidebar() {

    const { selectedElement, setSelectedElement } = useDesigner()

    if(!selectedElement) return null;

    const PropertiesForm = FormElements[selectedElement.type].propertiesComponent

    
    return (
        <div className='flex flex-col p-2'>
            <div className='flex flex-row justify-between items-center'>
                <span>Element Properties</span>
                    
                <Button 
                    size={"sm"} 
                    variant={"ghost"} 
                    className='hover:bg-WHITE/10'
                    onClick={() => {
                        setSelectedElement(null)
                    }}
                >
                    <AiOutlineClose/>
                </Button>
            </div>
            <Separator orientation='horizontal' className='mb-4 bg-WHITE/30'/>
            <PropertiesForm elementInstance={selectedElement}/>
        </div>
    )
}

export default PropertiesFormSidebar