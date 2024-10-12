//import Link from "next/link"

//import { cn } from "@/app/lib/utils"
//import { buttonVariants } from "@/app/components/ui/button"
//import { Icons } from "@/app/components/icons"
import NavBar from "@/app/_components/navbar"

export const metadata = {
  title: "Book a Demo | Happy Client",
}

export default function PricingPage() {
  return (
    <div className="flex">
        <NavBar/>
        <div className="flex flex-col my-20 py-2 px-[12%]">
            <h1>Book a Demo!</h1>
        </div>
    </div>
  )
}