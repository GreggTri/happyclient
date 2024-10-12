"use client"

import AppNavBar from "../_components/appnavbar";
import DesignerContextProvider from "./dashboard/forms/formComponents/context/DesignerContext";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-col">
            <AppNavBar />
            <DesignerContextProvider>
                {children}
            </DesignerContextProvider>
        </div>
    )
}

export default Layout;