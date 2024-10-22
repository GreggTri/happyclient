"use server"

import { getOrgSurveys } from "@/app/_data/survey";
import Pagination from "@/app/_components/pagination";
import Search from "../../settings/team/search";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/_components/ui/card";
import { Badge } from "@/components/ui/badge"
import CreateSurveyBtn from "./_formComponents/CreateSurveyBtn";
import { formatDistance } from "date-fns"
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FaEdit } from 'react-icons/fa'
import { Icons } from "@/app/_components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import RenameSurveyBtn from "./_formComponents/RenameSurveyBtn";
import { State } from '@prisma/client';
import CopySurveyBtn from "./_formComponents/CopySurveyBtn";
import ArchiveSurveyBtn from "./_formComponents/ArchiveSurveyBtn";
import { Separator } from "@/components/ui/separator";

type StateType = keyof typeof State;
interface Survey {
  id: string
  surveyTitle: string
  surveyDescription: string | null
  surveyState: StateType
  createdAt: Date
}


const FormsPage = async ({ searchParams }: {searchParams: any}) => {
    const q = searchParams?.q || "";
    const page: number = searchParams?.page || 1;
    const orgSurveyData = await getOrgSurveys(q, page)

    console.log(orgSurveyData);

    return (
      <div className="flex flex-col my-10 px-[6%] w-full">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div> 
            <span className="text-lg">{orgSurveyData?.getOrg?.companyName} Surveys</span>
            <span className="text-primary"> ({orgSurveyData!.count})</span>
          </div>
          <div className="mt-4 md:mt-0">
            <Search placeholder="Search..." />
          </div>
        </div>
        
        <Separator orientation='horizontal' className='my-4 bg-WHITE/20'/>
        
        
        <div className="flex flex-col container my-8">
          <div className="flex flex-col md:flex-row flex-wrap gap-6 justify-center">
            
          <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 ">
            <CreateSurveyBtn />
          </div>
            
            {orgSurveyData?.success && orgSurveyData.count > 0 ? (
              orgSurveyData.getOrgSurveys!.map((survey: Survey) => (
                <Card key={survey.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border-WHITE/20">
                  <CardHeader>
                    <CardTitle className="flex flex-row items-center gap-2 justify-between">
                      <span className="truncate font-bold">{survey.surveyTitle}</span>
                      
                      <div className="flex flex-row gap-2 justify-center items-center">
                        {survey.surveyState === "DRAFT" && <Badge className="bg-red-500" variant={"destructive"}>Draft</Badge>}
                        {survey.surveyState === "PUBLISHED" && <Badge className="bg-green-500">Published</Badge>}
                        {survey.surveyState === "ARCHIVED" && <Badge className="border-red-500 text-red-500 bg-transparent hover:bg-transparent">Archived</Badge>}
                        <Popover>
                          <PopoverTrigger>
                              <Icons.ellipsis width={20} height={20}/>
                          </PopoverTrigger>
                          <PopoverContent className="flex flex-col bg-black text-xs cursor-default space-y-2 m-0 p-2 items-end">
                            <CopySurveyBtn surveyId={survey.id}/>
                            <RenameSurveyBtn survey={survey}/>
                            <ArchiveSurveyBtn surveyId={survey.id}/>
                          </PopoverContent>
                        </Popover>
                        
                      </div>
                      
                    </CardTitle>
                    <CardDescription className="flex flex-col space-y-2 text-WHITE/50">
                      <span className="underline underline-offset-2">
                        {formatDistance(survey.createdAt, new Date(), {
                          addSuffix: true
                        })}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {survey.surveyDescription ? survey.surveyDescription : "No description set."}
                  </CardContent>
                  <CardFooter>
                      {(survey.surveyState !== "DRAFT") && 
                        <Button asChild variant={'outline'} className="w-full justify-center border-primary text-primary text-base gap-1">
                          <Link href={`/dashboard/forms/detail/${survey.id}`}>
                              <span>Go to form details</span> <Icons.chevronRight width={25} height={25}/>
                          </Link>
                        </Button>
                      }
                      {survey.surveyState === "DRAFT" &&
                        <Button asChild className="w-full text-BLACK text-base gap-3">
                          <Link href={`/dashboard/forms/builder/${survey.id}`}>
                            <span>Edit form</span> <FaEdit/>
                          </Link>
                        </Button>
                      }
                      
                  </CardFooter>
                </Card>
              ))
            ) : (
              <></>
            )}
          </div>
          <Pagination count={orgSurveyData!.count} />
        </div>
      </div>
    );
    
  }



export default FormsPage