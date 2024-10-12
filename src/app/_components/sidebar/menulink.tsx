import Link from "next/link"
import {IconType} from 'react-icons'

interface Item {
    title: string;
    path: string;
    //icon: JSX.Element;
}

interface LayoutProps {
    item: Item;
}

const MenuLink: React.FC<LayoutProps>  = ({item}) => {

    return(
        <Link href={item.path} className="container flex items-center gap-2.5 p-2.5 m-1 rounded-lg hover:bg-sky-800 active:bg-sky-900 focus:bg-sky-800">
            {/* {item.icon} */}
            {item.title}
        </Link>
        
    )
}

export default MenuLink