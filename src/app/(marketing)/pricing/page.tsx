import Link from "next/link"

import { cn } from "@/app/lib/utils"
import { buttonVariants } from "@/app/_components/ui/button"
import { Icons } from "@/app/_components/icons"
import NavBar from "@/app/_components/navbar"

export const metadata = {
  title: "Pricing | Happy Client",
}

export default function PricingPage() {
  return (
    <div className="flex">
        <NavBar/>
        <div className="flex flex-col my-20 py-2 px-[12%]">
            <div className="">
                <h1 className="text-5xl font-bold mb-6">Simple, transparent pricing</h1>

                <h3 className="text-base mb-8">Unlock <b className="text-primary">ALL</b>  features including unlimited forms and responses.</h3>
            </div>
            
            <div className="grid w-full items-start gap-10 rounded-lg border border-primary/30 p-10 md:grid-cols-[1fr_200px]">
                <div className="grid gap-6">
                <h3 className="text-xl font-bold sm:text-2xl cursor-default">
                    What&apos;s included in the <b className="text-primary">PRO</b>  plan
                </h3>
                <ul className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2 cursor-default">
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Unlimited Forms/Responses
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Unlimited Users
                    </li>

                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Custom domain
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Dashboard Analytics
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Premium Support 
                    </li>
                    <li className="flex items-center hover:opacity-50 transition-opacity ease duration-300">
                    <Icons.check className="mr-2 h-4 w-4" /> Sentiment Analysis
                    </li>
                    
                </ul>
                </div>
                <div className="flex flex-col gap-4 text-center">
                    <div className="cursor-default">
                        <h4 className="text-7xl font-bold">$99</h4>
                        <p className="text-sm font-medium text-muted-foreground">
                        Billed Monthly
                        </p>
                    </div>
                    <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
                        <span>Get Started</span>
                        <Icons.chevronRight className="opacity-90" />
                    </Link>
                </div>
            </div>
        </div>
    </div>
  )
}