'use server'

import { getOrg } from "@/app/_data/org";
import { retrieveEmailDomain } from "@/app/_data/resend";
import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";
import SetupResendEmailForm from "./SetupResendEmailForm";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import RecordRow from "./RecordRow";
import { deleteEmailDomain } from "./actions";
import VerifyButton from "./VerifyButton";

const OrgSettingsPage = async() => {
  const session = await verifySession(true)
  if (!session) return redirect('/login');
  if(!session.isAdmin) return redirect('/dashboard/analytics');

  const org = await getOrg()

  if(!org){
    return <div className="text-red-500 flex justify-center items-center">No Org Found. Please reach out to support.</div>;
  }
  
  let domainData;
  if(org.resendDomainId){
    domainData = await retrieveEmailDomain(org.resendDomainId)

    if(!domainData) return null;
  }

    
  return (
    <div className="flex flex-col border-l-2 border-gray-500 px-4">
      <div className="">
        <h1 className="font-bold text-lg">Email setup for sending survey emails!</h1>
        
        {org.resendDomainId == null ? 
          <SetupResendEmailForm /> 
        :
          <>
          {domainData && domainData.status == "verified" && (
            <div className="flex flex-col my-4 h-full w-full place-content-between">
              <div className="space-x-4">
                <span>{org.surveyEmail}</span>
                <Badge className="text-black bg-green-500">Verified</Badge>
              </div>
              <form action={deleteEmailDomain}>

                <input type="hidden" name="domainId" value={org.resendDomainId} />
                <Button type="submit" className="bg-red-500 hover:bg-red-400">
                  Delete domain
                </Button>
              </form>
              
            </div>
          )}
          {domainData && domainData.status != "verified" && (
            <div className="flex flex-col my-4">
              <div className="flex flex-row items-center gap-2 mb-4">
                
                <span>{org.surveyEmail}</span>
                <Badge
                  className={cn(
                    domainData!.status == "not_started" && 'bg-gray-500',
                    domainData!.status == "pending" && "bg-orange-500",
                    domainData!.status == "temporary_failure" && "bg-red-500/50"
                  )}
                >
                  {domainData!.status == "not_started" && "Not Started"}
                  {domainData!.status == "pending" && "Pending"}
                  {domainData!.status == "temporary_failure" && "Temp. Failure"}
                </Badge>
                  
              </div>

              <div className="overflow-x-auto">
                <Table className="min-w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-gray-500">
                      <TableHead className="w-12">Type</TableHead>
                      <TableHead className="w-36">Name</TableHead>
                      <TableHead className="w-40">Value</TableHead>
                      <TableHead className="w-12">TTL</TableHead>
                      <TableHead className="w-12">Priority</TableHead>
                      <TableHead className="w-24">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domainData && domainData.records.map((record) => (

                      <RecordRow key={record.value} record={record}/>
                      
                    ))}
                  </TableBody>
                </Table>
                <p className="my-8 text-gray-00">
                  Once you have added these records to your DNS Host,
                  <br />Click the &quot;Verify DNS Records&quot; button below
                </p>
                
                <VerifyButton domainId={org.resendDomainId}/>
              </div>
            </div>
          )}
          </>
          
        }
      </div>
    </div>
  );
};

export default OrgSettingsPage;