import { FormElements } from "./FormElements";
import FormElementsSidebar from "./FormElementsSidebar";
import useDesigner from "./hooks/UseDesigner";
import PropertiesFormSidebar from "./PropertiesFormSidebar";

function DesignerSidebar() {

  const { selectedElement } = useDesigner()

  return (
    <div className="w-[250px] h-full bg-BLACK p-4 text-white border-l border-WHITE/20">
      {selectedElement ? 
        <PropertiesFormSidebar/> 
      : 
        <FormElementsSidebar/>
      }

    </div>
  );
}
  
export default DesignerSidebar;
  