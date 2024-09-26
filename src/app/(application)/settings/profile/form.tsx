'use client'

import { useFormState, useFormStatus } from "react-dom";
import { updateName } from "./actions";
import { Icons } from "@/app/components/icons";

interface User {
    id?: string | null | undefined
    email?: string | undefined
    firstName?: string | null | undefined
    lastName?: string | null | undefined
    role?: string | null | undefined
    isAdmin?: Boolean | null | undefined
    
}

interface UpdateProfileFormProps {
    user: User | null | undefined;
}

const UpdateProfileForm = ({ user }: UpdateProfileFormProps) => {
   const [state, action ] = useFormState(updateName, undefined)

  
  return (
    <form action={action} className="flex flex-col space-y-2 text-lg">
        <div className="flex flex-col">
            <label htmlFor="firstName">First Name</label>
            <input
            className="rounded-md text-BLACK pl-2"
            id="firstName"
            name="firstName"
            type="text"
            placeholder={user?.firstName ? user.firstName : ""}
            />
            {state?.errors?.firstName &&  <p className="text-sm text-red-500">{state.errors.firstName}</p>}
        </div>
        
        
        <div className="flex flex-col">
            <label htmlFor="lastName">Last Name</label>
            <input
            className="rounded-md text-BLACK pl-2"
            id="lastName"
            name="lastName"
            type="text"
            placeholder={user?.lastName ? user.lastName : ""}
            />
            {state?.errors?.lastName &&  <p className="text-sm text-red-500">{state.errors.lastName}</p>}
        </div>
        {state?.message &&  <p className="text-sm text-red-500">{state.message}</p>}
        <UpdateProfileButton/>
    </form>
  );
};

export default UpdateProfileForm;

export function UpdateProfileButton() {
    const { pending } = useFormStatus();
  
    return (
        <div className="flex justify-end align-bottom">
            <button 
                className="flex flex-row mt-5 px-4 py-1 bg-primary rounded-md text-sm text-BLACK" 
                disabled={pending}
                type="submit"
                >
                {pending ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                ) : "Save"}
            </button>
        </div>
      
    );
}