
type RoleType = string;

interface RoleProps {
    role: RoleType;
}


const Role = async ({role}: RoleProps) => {
    
    
    return (
      <div className="">
        {role}        
      </div>
    );
  };
  
  export default Role;