import React from 'react'
import { FormElements } from './FormElements'
import SidebarBtnElement from './SidebarBtnElement'
import { Separator } from '@/components/ui/separator'

function FormElementsSidebar() {
  
  
    return (
    <div>
        Elements
        <Separator orientation='horizontal' className='mb-4 bg-WHITE/30'/>
        <SidebarBtnElement formElement={FormElements.TextField}/>
    </div>
  )
}

export default FormElementsSidebar