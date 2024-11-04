'use server'

import { getOrgDomain } from "@/app/_data/org";
import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";
import CustomDomainForm from "./CustomDomainForm";
import { getDomainFromVercel } from "@/app/_data/vercel";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import VercelRecordRow from "./VercelRecordRow";
import VerifyVercelDomainButton from "./VerifyVercelDomainButton";
import { Badge } from "@/components/ui/badge";
//import DeleteVercelDomainButton from "./DeleteVercelDomainButton";



async function CustomDomainSettingsPage(){
  const session = await verifySession(true)
  if (!session) return redirect('/login');

  const org = await getOrgDomain();
  if(!org) return redirect('/settings/profile');

  let domainVerification
  if(org.domain){
    domainVerification = await getDomainFromVercel(org.domain)
  }

  return (
    <div className="flex flex-col border-l-2 border-gray-500 px-4 w-full" >
      <div>
        <h1 className="font-bold text-lg mb-4">Set Up A Custom Domain</h1>

        {/* Below is where the custom domain form would show after a toggle has been switched on 
        signaling customer wanting to use feature */}
        {org.domain ?
          <>
            {org.domainVerified == false && domainVerification && (
              
              <div className="overflow-x-auto">
                <Table className="min-w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-gray-500">
                      <TableHead className="w-6">Type</TableHead>
                      <TableHead className="w-20">Name</TableHead>
                      <TableHead className="w-32">Value</TableHead>
                      <TableHead className="w-28">Reason</TableHead>
                      <TableHead className="w-16">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {domainVerification && domainVerification.map((record: {
                      type: string,
                      domain: string,
                      value: string,
                      reason: string
                    }) => (

                      <VercelRecordRow key={record.value} record={record}/>
                      
                    ))}
                  </TableBody>
                </Table>
                <p className="my-8 text-gray-00">
                  Once you have added these records to your DNS Host,
                  <br />Click the &quot;Verify DNS Records&quot; button below
                </p>
                
                <VerifyVercelDomainButton domain={org.domain}/>
              </div>
            )}

            {org.domainVerified == true && domainVerification == null && (
              <div className="overflow-x-auto">
                <Table className="min-w-full table-fixed">
                  <TableHeader>
                    <TableRow className="border-gray-500">
                      <TableHead className="w-12">Type</TableHead>
                      <TableHead className="w-20">Name</TableHead>
                      <TableHead className="w-32">Value</TableHead>
                      <TableHead className="w-24">TTL</TableHead>
                      <TableHead className="w-16">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                  <TableRow>
                    <TableCell>CNAME</TableCell>
                    <TableCell>{org.domain.split('.')[0]}</TableCell>
                    <TableCell className="w-40">cname.vercel-dns.com</TableCell>
                    <TableCell>Default</TableCell>
                    <TableCell>
                    <Badge
                        className='bg-green-500'
                    >
                        Verified
                    </Badge>
                    </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                <p className="my-8 text-gray-00">
                  You should be all set :) Give some time for DNS propagation to complete or check a DNS propagation site to make sure everything is good
                </p>
                
                {/* <DeleteVercelDomainButton domain={org.domain}/> */}
              </div>
            )}
          </>
        :
          <CustomDomainForm />
        }
        
      </div>
    </div>
  );
};

export default CustomDomainSettingsPage; 