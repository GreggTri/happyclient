'use server'

import { fetchUsers } from "@/app/_data/user";
import Search from "./search";
import Link from "next/link";
import Pagination from "@/app/components/pagination";
import User from "./user";
import { Icons } from "@/app/components/icons";

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
  const {count, users} = await fetchUsers(q, page);
  
  return (
    <div className="flex flex-col px-3 space-y-2">
      <h1 className="font-bold">Team</h1>
      
      <div className="rounded-lg  bg-BLACK p-5 mt-5">
            <div className="flex items-center justify-between">
                <Search placeholder="Search..."/>
                <Link href="/dashboard/users/add">
                    <button className="p-2 bg-primary rounded-md flex flex-row justify-center items-center text-sm text-BLACK"><Icons.add width={20} height={20}/>Add New</button>
                </Link>
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
                    {users.map((user: user) => (
                        <User key={user.id} user={user}/>
                    ))}
                </tbody>
            </table>
            <Pagination count={count}/>
        </div>
      
    </div>
  );
};

export default TeamSettingsPage;