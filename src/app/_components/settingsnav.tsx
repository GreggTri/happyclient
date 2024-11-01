"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";



const SettingsNavBar = () => {
    const pathname = usePathname(); // Get current path

    const isActive = (route: string) => pathname === route;

  return (
    <div className="flex flex-col space-y-5">
        <div className="flex flex-col">
            <h2>General</h2>
            <div className="flex flex-col space-y-1 text-text/85">
                <Link 
                    href="/settings/profile" 
                    className={`ml-3 p-1 ${isActive("/settings/profile") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Your Profile
                </Link>
            </div>
        </div>
        <div className="flex flex-col">
            <h2>Admin</h2>

            <div className="flex flex-col space-y-1 text-text/85">
                <Link 
                    href="/settings/team" 
                    className={`ml-3 p-1 ${isActive("/settings/team") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Manage Team
                </Link>
                {/* <Link 
                href="/settings/integrations" 
                className={`ml-3 p-1 ${isActive("/settings/integrations") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Integrations
                </Link> */}
                <Link 
                href="/settings/emailBranding" 
                className={`ml-3 p-1 ${isActive("/settings/emailBranding") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Email Sending Setup
                </Link>
                <Link 
                href="/settings/customDomain" 
                className={`ml-3 p-1 ${isActive("/settings/customDomain") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Survey Custom Domain
                </Link>
                
                
                <Link 
                    href="/settings/account" 
                    className={`ml-3 p-1 ${isActive("/settings/account") ? 'bg-WHITE/10 p-1 rounded-md' : 'hover:bg-WHITE/10 hover:p-1 hover:rounded-md'}`}
                >
                    Org Account
                </Link>
            </div>
        </div>
    </div>
    )
}

export default SettingsNavBar