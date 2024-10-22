import SettingsNavBar from "@/app/_components/settingsnav";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-row justify-center items-center m-20 h-full cursor-default">
            <div className="flex flex-row bg-black/30 rounded-md gap-5 p-4 w-[50%]">
                
                <div className=" text-nowrap">
                    <SettingsNavBar/>
                </div>
                
                <div className="w-px bg-gray-300 "></div>
                
                {children}
            </div>

        </div>
    )
}

export default Layout;