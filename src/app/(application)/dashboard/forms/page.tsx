"use server"

import { getOrgSurveys } from "@/app/_data/survey";
import Pagination from "@/app/components/pagination";
import Search from "../../settings/team/search";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Icons } from "@/app/components/icons";
import Link from "next/link";

interface Survey {
  id: string
  surveyTitle: string
  surveyDescription: string | null
}

const FormsPage = async ({ searchParams }: {searchParams: any}) => {
    const q = searchParams?.q || "";
    const page: number = searchParams?.page || 1;
    const orgSurveyData = await getOrgSurveys(q, page)

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
        
        <hr className="my-4"/>
        
        <div className="flex flex-col container my-8">
          <div className="flex flex-col md:flex-row flex-wrap gap-4">
            <Link href="/dashboard/forms/create">
              <Card className="flex flex-col justify-center items-center cursor-default border-primary text-primary">
                <CardHeader>
                  <CardTitle className="flex justify-center">
                    <Icons.FilePlus width={20} height={20} />
                  </CardTitle>
                  <CardDescription>Create A New Survey</CardDescription>
                </CardHeader>
              </Card>
            </Link>
            {orgSurveyData?.success && orgSurveyData.count > 0 ? (
              orgSurveyData.getOrgSurveys!.map((survey: Survey) => (
                <Card key={survey.id} className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4">
                  <CardHeader>
                    <CardTitle>{survey.surveyTitle}</CardTitle>
                    <CardDescription>
                      {survey.surveyDescription ? survey.surveyDescription : "No description set."}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>Card Content</p>
                  </CardContent>
                  <CardFooter>
                    <p>Card Footer</p>
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