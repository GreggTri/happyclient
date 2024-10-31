'use server'

import { getSurveyDetails } from "@/app/_data/survey";
import FormDetailComponent from "./FormDetailComponent";
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import SurveySendGroupRow from "./SurveySendGroupRow";
import { Icons } from "@/app/_components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface SurveyPageProps {
  params: { id: string };
}

export default async function FormDetailPage({ params }: SurveyPageProps) {
  const surveyId = params.id;
  const survey = await getSurveyDetails(surveyId);
  if (!survey || survey.surveyState === "DRAFT") {
    return <div>Survey not found or not available.</div>;
  }


  if(survey.SurveySendGroup.length === 0){
    return <FormDetailComponent survey={survey}/>;
  }
  
  return (
    <div className="mx-[6.5%] my-20 bg-[#1e1e1e] rounded-md p-2">
      <div className="flex justify-between my-2">

        <span className="text-xl">{survey.surveyTitle}</span>
        <Link href={`/dashboard/forms/detail/${surveyId}/add`}>
          <Button className="text-black">
            <Icons.add height={20} width={20}/> Add Group
          </Button>
        </Link>
        
      </div>
      <Table className="">
        <TableCaption>Employee Groups for Survey</TableCaption>
        <TableHeader>
          <TableRow className="border-white/50">
            <TableHead className="">Names</TableHead>
            <TableHead>Next Send Out Date</TableHead>
            <TableHead className="">Emails Per Group</TableHead>
            <TableHead className="w-[150px]">Add Emails</TableHead>
            <TableHead className="w-[150px]">Remove Emails</TableHead>
            <TableHead className="w-[150px]">Deactivate Group</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="">
          {survey.SurveySendGroup.sort((a, b) => {
            // Groups with isArchived false should come first
            if (a.isArchived === b.isArchived) return 0;
            return a.isArchived ? 1 : -1;
          })
          .map((group) => (
            <SurveySendGroupRow key={group.id} group={
              {
                'id': group.id,
                'attachedUsers': group.attachedUsers,
                'activeEmailCount': group.activeEmailCount,
                'scheduledSend': group.scheduledSend,
                'intervalTiming': group.intervalTiming,
                'isArchived': group.isArchived
              }
            }/>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
