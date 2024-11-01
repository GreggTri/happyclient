'use server'

import { getOrg } from "@/app/_data/org";
import { retrieveDomain } from "@/app/_data/resend";
import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";
import SetupResendEmailForm from "./SetupResendEmailForm";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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
    domainData = await retrieveDomain(org.resendDomainId)

    if(!domainData) return null;
  }

    
  return (
    <div className="flex flex-col px-5">
      <div>
        <h1>Email setup for sending survey emails!</h1>
        
        {org.resendDomainId == null ? 
          <SetupResendEmailForm/> 
        :
          <div className="flex flex-col">
            <div>
              {/* show email taht will be used. */}
              <span>no-reply@{domainData!.name}</span>
              <Badge
                className={cn(
                  domainData!.status == "not_started" && 'bg-black/50',
                  domainData!.status == "pending" && "bg-black/50",
                  domainData!.status == "verified" && "bg-black/50",
                  domainData!.status == "temporary_failure" && "bg-black/50"
                )}
              >
                {domainData!.status == "not_started" && "Not Started"}
                {domainData!.status == "pending" && "Pending"}
                {domainData!.status == "verified" && "Verified"}
                {domainData!.status == "temporary_failure" && "Temp. Failure"}
              </Badge>
                
            </div>

            <div className="">
              <Table className="">
                <TableHeader>
                  <TableRow className="border-white/50">
                    <TableHead className="">Type</TableHead>
                    <TableHead>Record</TableHead>
                    <TableHead className="">Name</TableHead>
                    <TableHead>Value</TableHead>
                    <TableHead>TTL</TableHead>
                    <TableHead className="w-[150px]">Priority</TableHead>
                    <TableHead className="w-[150px]">Status</TableHead>
                  </TableRow>
                </TableHeader>
                {/* DNS records that must be added */}
                <TableBody>
                  
                  {domainData!.records.map((record) => (
                    <TableRow key={record.value} className="flex flex-row w-full">
                    
                      <TableCell>{record.type}</TableCell>
                      <TableCell>{record.record}</TableCell>
                      <TableCell>{record.name}</TableCell>
                      <TableCell>{record.value}</TableCell>
                      <TableCell>{record.ttl}</TableCell>
                      <TableCell>{record.priority}</TableCell>
                      <TableCell>
                        <Badge
                          className={cn(
                            record.status == "not_started" && 'bg-black/50',
                            record.status == "pending" && "bg-black/50",
                            record.status == "verified" && "bg-black/50",
                            record.status == "temporary_failure" && "bg-black/50"
                          )}
                        >
                          {record.status == "not_started" && "Not Started"}
                          {record.status == "pending" && "Pending"}
                          {record.status == "verified" && "Verified"}
                          {record.status == "temporary_failure" && "Temp. Failure"}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                
                <p>
                  Once you have added these records to your DNS Host, 
                  <br />Please click the &quot;Verify DNS Records&quot; button below
                </p>
                <Button>Verify DNS Records</Button>
              </Table>
            </div>
          </div>
        }
      </div>
    </div>
  );
};

export default OrgSettingsPage;