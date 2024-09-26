import SettingsNavBar from "@/app/components/settingsnav";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-row justify-center items-center my-20 h-full cursor-default">
            <div className="flex flex-row bg-black/30 rounded-md gap-5 p-4 ">
                
                <SettingsNavBar/>
                
                <div className="w-px bg-gray-300 "></div>
                
                {children}
            </div>

        </div>
    )
}

export default Layout;