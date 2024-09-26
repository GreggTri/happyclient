'use server'

import { deleteUser, updateUserAdmin, updateUserRole } from './actions';
import { Icons } from '@/app/components/icons';
import { Switch } from '@/app/components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/components/ui/popover';
import { getRoles } from '@/app/_data/org';
import Role from './role';

interface user {
    id: string
    firstName: string | null
    lastName: string | null
    email: string
    role: string
    isAdmin: boolean
}

interface UserProps {
    user: user;
}

type RoleType = string;

const User: React.FC<UserProps> = async ({user}: UserProps) => {
    const roles = await getRoles()
    
    return(
        <tr className='cursor-default'>
            {/* Name */}
            <td className='p-2.5'>
                { (user.firstName == null && user.lastName == null) ? "No Name" : user.firstName + " " + user.lastName}
            </td>

            {/* Email */}
            <td className='p-2.5'>
                {user.email}
            </td>

            {/* Role */}
            <td className='p-2.5'>
                <Popover>
                    <PopoverTrigger className='flex flex-row items-center gap-1'>{user.role}<Icons.ChevronDown width={16} height={16}/></PopoverTrigger>
                    <PopoverContent className='bg-black space-y-2'>
                        <div>
                            Search
                        </div>
                        <div>
                            <form action={updateUserRole}>
                                <input id='userId' name='userId' type="hidden" value={user.id} />
                                {roles!.map((role: RoleType) => (
                                    // TODO::: add input or button to grab role from 
                                    //whatever is being clicked on and update role with the value
                                    <Role key={role} role={role}/>
                                ))}
                            </form>
                        </div>
                    </PopoverContent>
                </Popover>
            </td>
            
            
            {/* Created At */}
            <td className='p-2.5'>
                <form action={updateUserAdmin}>
                    <input id='userId' name='userId' type="hidden" value={user.id} />
                    <Switch name='isAdmin' defaultChecked={user.isAdmin} type='submit'/>
                </form>
            </td>

            {/* Action */}
            <td className='flex gap-2 p-2.5'>
                <form action={deleteUser}>
                    <input id='userId' name='userId' type="hidden" value={user.id} />
                    <button type='submit' className='px-3 py-1 rounded-md cursor-pointer bg-red-500 text-sm'><Icons.trash width={20} height={20}/></button>
                </form>
                
            </td>          
        </tr>
    )
}

export default User