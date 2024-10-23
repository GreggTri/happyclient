import React from 'react'
import { FormElements } from './FormElements'
import SidebarBtnElement from './SidebarBtnElement'
import { Separator } from '@/components/ui/separator'

function FormElementsSidebar() {
  
  
  return (
    <div>
        <span className='text-sm text-white/70'>Drag & Drop Elements</span>
        <Separator orientation='horizontal' className='my-2 bg-WHITE/30'/>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-2 place-items-center'>
          <span className='text-sm text-white/50 col-span-1 md:col-span-2 my-2 place-self-start'>
            Layout Elements
          </span>
          <SidebarBtnElement formElement={FormElements.TitleField}/>
          <SidebarBtnElement formElement={FormElements.SubtitleField}/>
          <SidebarBtnElement formElement={FormElements.SeparatorField}/>
          <SidebarBtnElement formElement={FormElements.SpacerField}/>
          <span className='text-sm text-white/50 col-span-1 md:col-span-2 my-2 place-self-start'>
            Survey Elements
          </span>

          <SidebarBtnElement formElement={FormElements.TextField}/>
          <SidebarBtnElement formElement={FormElements.NumberField}/>
          <SidebarBtnElement formElement={FormElements.TextareaField}/>
          <SidebarBtnElement formElement={FormElements.DateField}/>
          <SidebarBtnElement formElement={FormElements.SelectField}/>
        </div>
        
    </div>
  )
}

export default FormElementsSidebar