'use client'
import Link from "next/link"
import { Icons } from "./icons";
import { useState } from 'react';
import { usePathname } from "next/navigation";
import { logout } from "../(auth)/login/actions";

const AppNavBar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname(); // Get current path

    const isActive = (route: string) => pathname === route;
    
    return (
        <div className="flex flex-row w-full py-3 px-[3%] sticky top-0 space-x-10 bg-background justify-start border-b border-WHITE/20 z-30">
            
            {/* Hamburger Menu Button (always visible) */}
            <button 
                className="flex z-30" // Hamburger button always visible on all screens
                onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
                <Icons.menu />
            </button>

            {/* Logo and Title */}
            <div className="flex items-center gap-2">
                <Icons.logo className="h-6 w-6" />
                <h1 className="text-primary font-bold text-base">Happy Client</h1>
            </div>

            {/* Horizontal Navigation (for large screens only) */}
            <div className="hidden lg:flex gap-7">
                <Link 
                    href="/dashboard" 
                    className={`${isActive("/dashboard") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`} 
                >
                    Dashboard
                </Link>
                <Link 
                    href="/dashboard/analytics"
                    className={`${isActive("/dashboard/analytics") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`}
                >
                    Analytics
                </Link>
                <Link 
                    href="/dashboard/forms"
                    className={`${isActive("/dashboard/forms") ? 'border-b border-WHITE' : 'hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md'} px-1`}    
                >
                    Forms
                </Link>
            </div>

            {/* Vertical Navigation Menu (triggered by Hamburger Menu, visible on smaller screens and includes additional links) */}
            <div 
                className={`${isMenuOpen ? 'flex' : 'hidden'} z-9 fixed top-12 left-0 h-auto w-auto bg-background border rounded-md border-WHITE/20 shadow-lg flex-col space-y-5 px-3 py-2 z-20`}
            >
                {/* Original links also included in the vertical menu when screen is small */}
                <Link 
                    href="/dashboard"
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Dashboard
                </Link>
                <Link 
                    href="/dashboard/analytics"  
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Analytics
                </Link>
                <Link 
                    href="/dashboard/forms" 
                    className="lg:hidden text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Forms
                </Link>

                {/* Links visible only in the vertical menu */} 
                <Link 
                    href="/settings/profile" 
                    className="text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Settings
                </Link>
                <Link 
                    href="/support" 
                    className="text-lg hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                    Support
                </Link>
                <button 
                    className="text-lg text-red-500 hover:bg-WHITE/20 hover:px-1 hover:py-0 hover:rounded-md px-1" 
                    onClick={async() => await logout()}
                >
                    Log out
                </button>
            </div>
        </div>
    );
}

export default AppNavBar;

