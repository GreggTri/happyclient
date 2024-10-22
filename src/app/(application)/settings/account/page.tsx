'use server'

import { getOrgCompanyName } from "@/app/_data/org";
import { verifySession } from "@/app/_lib/session";
import { redirect } from "next/navigation";
import CompanyNameForm from "./CompanyNameForm";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Icons } from "@/app/_components/icons";

async function OrgAccountSettingsPage(){
  const session = await verifySession(true)
  if (!session) return redirect('/login');

  const org = await getOrgCompanyName(); //just have a getOrg function
  console.log(org);
  if(!org) return redirect('/settings/profile');
  
  return (
    <div className="flex flex-col w-full px-2">
      <div>
        <h1 className="font-bold text-lg my-4">Organizations Account & Billing</h1>
        
        <div className="flex flex-col w-full items-center">
          <CompanyNameForm companyName={org.companyName}/>
        </div>
        
        <div className="my-6">
          <span>After entering your firms name, <br />Please activate your monthly subscription</span>
          <Button className="text-white w-full my-4 py-6 bg-green-500 hover:bg-green-600">
            <Link href={`${process.env.STRIPE_PAYMENT_LINK}`} target="_blank" className="flex flex-row justify-center items-center font-bold text-base">
              Activate Subscription<Icons.chevronRight width={25} height={25}/>
            </Link>
          </Button>
        </div>

        {/* add a contact button to cancel subcription etc later */}
      </div>
    </div>
  );
};

export default OrgAccountSettingsPage;