import { FormElements } from "./FormElements";
import SidebarBtnElement from "./SidebarBtnElement";

function DesignerSidebar() {
    return (
      <div className="w-[250px] h-full bg-BLACK p-4 text-white border-l border-WHITE/20">
        Elements

        <SidebarBtnElement formElement={FormElements.TextField}/>
      </div>
    );
  }
  
  export default DesignerSidebar;
  