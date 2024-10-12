'use server'

import { fetchUsers } from "@/app/_data/user";
import Search from "./search";
import Pagination from "@/app/_components/pagination";
import User from "./user";
import { Icons } from "@/app/_components/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@/app/_components/ui/popover";
import { sendUserInvite } from "./actions";

interface user {
  id: string
  firstName: string | null
  lastName: string | null
  email: string
  role: string
  isAdmin: boolean
}

const TeamSettingsPage = async ({ searchParams }: {searchParams: any}) => {
  const q = searchParams?.q || "";
  const page: number = searchParams?.page || 1;
  const {success, count, users} = await fetchUsers(q, page);
  
  return (
    <div className="flex flex-col px-3 space-y-2">
      <h1 className="font-bold">Team</h1>
      
      <div className="rounded-lg  bg-BLACK p-5 mt-5">
            <div className="flex items-center justify-between">
                <Search placeholder="Search..."/>
                <Popover>
                    <PopoverTrigger className='flex flex-row items-center gap-1 p-2 bg-primary rounded-md justify-center text-sm text-BLACK'><Icons.add width={20} height={20}/>Invite</PopoverTrigger>
                    <PopoverContent className='bg-black'>
                        <div >
                            <form action={sendUserInvite} className='flex flex-row gap-2'>
                                <input type="text" name='email' className="rounded-md px-1 bg-BLACK" placeholder="Email"/>
                                <button className='flex flex-row justify-center items-center bg-primary text-BLACK rounded-md px-1 py-1 gap-1'>Send<Icons.Send width={15} height={15}/></button>
                            </form>
                        </div>
                    </PopoverContent>
                </Popover>
            </div>

            <table className='w-full mt-4'>
                <thead>
                    <tr>
                        <td className='p-2.5'>Name</td>
                        <td className='p-2.5'>Email</td>
                        <td className='p-2.5'>Role</td>
                        <td className='p-2.5'>Admin</td>
                        <td className='p-2.5'>Action</td>
                        
                    </tr>
                </thead>
                <tbody>
                    {success && count > 0 ? users!.map((user: user) => (
                        <User key={user.id} user={user}/>
                    )) : <p className="text-red-500">Error: Could not find any users! Please contact support!</p>}
                </tbody>
            </table>
            <Pagination count={count}/>
        </div>
      
    </div>
  );
};

export default TeamSettingsPage;