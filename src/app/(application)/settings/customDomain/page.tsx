'use server'

import { Input } from "@/app/_components/ui/input";
import { getOrgDomain } from "@/app/_data/org";
import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";



async function CustomDomainSettingsPage(){
  const session = await verifySession(true)
  if (!session) return redirect('/login');

  const org = await getOrgDomain();
  if(!org || !org.org) return redirect('/settings/profile');

  return (
    <div className="flex flex-col px-5 w-full" >
      <div>
        <h1 className="font-bold text-lg">Set Up A Custom Domain</h1>
        <div className="flex flex-col items-center my-4" >
          <span className="text-white/80">Your default domain for surveys:</span>
          <Input
            className="border border-white/50 ring-transparent cursor-default " 
            readOnly 
            defaultValue={`${(org as { org: { domain: string } }).org.domain}`}
          />
        </div>
        
        {/* Below is where the custom domain form would show after a toggle has been switched on 
        signaling customer wanting to use feature */}
      </div>
    </div>
  );
};

export default CustomDomainSettingsPage; 