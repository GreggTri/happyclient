'use client'


import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Pencil } from 'lucide-react';
import React from 'react'

// interface SurveyData {

// }

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SurveyAnalyticsComponent({surveyData}: { surveyData: null}) {
  // const [selectedTab, setTab] = useState("Org");

  const handleEdit = () => {
    // Add your edit functionality here
    console.log("Edit button clicked")
  }

  return (
    <div className='flex flex-col'>
      <div className='flex flex-row'>
        <Tabs defaultValue="org" className="w-full">
         <div className="flex justify-between items-center">
            <TabsList className="bg-[#1e1e1e]">
              <TabsTrigger 
                value="org" 
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Organization
              </TabsTrigger>
              <TabsTrigger 
                value="role"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Role
              </TabsTrigger>
              <TabsTrigger 
                value="individual"
                className="data-[state=active]:bg-[#2a2a2a] data-[state=active]:text-white"
              >
                Me
              </TabsTrigger>
            </TabsList>
            <Button variant="outline" size="icon" onClick={handleEdit} className="bg-[#1e1e1e] border-[#333] hover:bg-[#2a2a2a] hover:text-white">
              <Pencil className="h-4 w-4" />
            </Button>
          </div>
          <TabsContent 
            value="org"
            className='bg-[#1e1e1e] py-4 rounded-md'
          >
            Make changes to your account here.
          </TabsContent>
          <TabsContent 
            value="role"
            className='bg-[#1e1e1e] py-4 rounded-md'
          >
            Change your password here.
          </TabsContent>
          <TabsContent 
            value="individual"
            className='bg-[#1e1e1e] py-4 rounded-md'
          >
            This data is yours!
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default SurveyAnalyticsComponent