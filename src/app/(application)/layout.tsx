
import AppNavBar from "../components/appnavbar";

interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({children}) => {
    return (
        <div className="flex flex-col">
            <AppNavBar />
            
            {children}
            
        </div>
    )
}

export default Layout;