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
        <div className="flex flex-col my-20 py-2 bg-white mx-[12%] w-full rounded-md ">
          {/* <!-- Google Calendar Appointment Scheduling begin --> */}
          <iframe src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ1QrMx67nljr1hva1NpHVbXXe-Yjijo3JAGlGJI0OuQBzBINxbPOl6MDhESNfh-QQLp-Xtjt-Pm?gv=true" style={{border: 0}} width="100%" height="700" frameBorder="0"></iframe>
          {/* <!-- end Google Calendar Appointment Scheduling --> */}
        </div>
    </div>
  )
}