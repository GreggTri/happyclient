'use server'

import { fetchUser } from "@/app/_data/user";
import UpdateProfileForm from "./form";


const ProfileSettingsPage = async () => {
  
  const result = await fetchUser()
  
  return (
    <div className="flex flex-col space-y-2 border-l-2 border-gray-500 px-4">
      <h1 className="font-bold">Profile Settings</h1>
      
      <UpdateProfileForm user={result?.user}/>
    </div>
  );
};

export default ProfileSettingsPage;