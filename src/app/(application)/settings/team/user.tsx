'use server'

import { AddRoleToOrg, deleteUser, updateUserAdmin, updateUserRole } from './actions';
import { Icons } from '@/app/_components/icons';
import { Switch } from '@/app/_components/ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '@/app/_components/ui/popover';
import { getRoles } from '@/app/_data/org';

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

type RoleType = {
    name: string;
};

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
                        <div className='flex flex-row'>
                            <form action={AddRoleToOrg} className='flex flex-row gap-2'>
                                <input type="text" name='newRole' className='rounded-md px-1 bg-BLACK'/>
                                <button className=' bg-primary text-BLACK rounded-md px-1 py-1'>add Role</button>
                            </form>
                        </div>

                        <div className="w-px bg-gray-300 "></div>
                        
                        <div>
                            {roles!.roles.map((role: RoleType) => (
                                <form action={updateUserRole} key={role.name} className='px-1'>
                                    <input id="userId" name="userId" type="hidden" value={user.id} />
                                    <input id="role" name="role" type="hidden" value={role.name} />
                                    <button type="submit">{role.name}</button>
                                </form>
                            ))}
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