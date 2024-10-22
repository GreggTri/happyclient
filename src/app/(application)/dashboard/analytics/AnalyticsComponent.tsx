'use client'

import React, { useEffect, useState } from 'react'
import {  } from '@prisma/client'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SurveyAnalyticsComponent from './SurveyAnalyticsComponent';

function AnalyticsComponent({surveys }: {surveys:{
    id: string;
    surveyTitle: string;
}[]}) {
    
    const [selectedSurvey, setSelectedSurvey] = useState(surveys[0].id)
    const [surveyData, setSurveyData] = useState(null);

    useEffect(() => {
        if (selectedSurvey) {
            // Fetch the survey data when the selectedSurvey changes
            const fetchSurveyData = async () => {
                const res = await fetch(`/api/surveys/${selectedSurvey}`, {
                    headers: {
                        Accept: "application/json",
                        method: "GET"
                    }
                });
                const data = await res.json();
                setSurveyData(data); // Store fetched data for the server component
            };

            fetchSurveyData();
        }
    }, [selectedSurvey]);

    return (
        <div className='flex flex-col my-10 px-[6%] w-full'>
            <div className='flex flex-row space-x-2 items-center my-5'>
                <span className='text-md text-white/80'>Select survey:</span>
                <Select value={selectedSurvey} onValueChange={setSelectedSurvey}>
                    <SelectTrigger className="w-[250px] bg-[#111111] border-[#f4e300]">
                        <SelectValue placeholder="Select a survey" />
                    </SelectTrigger>
                    <SelectContent>
                        {surveys.map((survey) => (
                        <SelectItem key={survey.id} value={survey.id} className='bg-black border-black rounded-md'>
                            {survey.surveyTitle}
                        </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            {/* we add server component here that takes in the surveyId and name */}
            <SurveyAnalyticsComponent surveyData={surveyData}/>
        </div>
    )
}

export default AnalyticsComponent