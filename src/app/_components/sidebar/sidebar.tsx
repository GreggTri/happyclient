import MenuLink from './menulink';
import Image from 'next/image';
// import { 
//     MdDashboard, 
//     MdSupervisedUserCircle, 
//     MdShoppingBag,
//     MdLogout,
//     MdAttachMoney,
//     MdWork,
//     MdAnalytics,
//     MdPeople,
//     MdOutlineSettings,
//     MdHelpCenter
//     } from 'react-icons/md';


const menuItems = [
    {
        title: "Pages",
        list: [
            {
                title: "Dashboard",
                path: "/dashboard",
            //    icon: <MdDashboard/>
            },
            {
                title: "Analytics",
                path: "/Analytics",
            //    icon: <MdShoppingBag/>
            },
            {
                title: "Forms",
                path: "/Forms",
            //    icon: <MdSupervisedUserCircle/>
            },

        ]
    },
    {
        title: "Admin",
        list: [
            {
                title: "Org",
                path: "/",
             //   icon: <MdWork/>
            },
            
            {
                title: "Team",
                path: "/dashboard/teams",
              //  icon: <MdPeople/>
            },
            {
                title: "setup",
                path: "/Setup",
           //     icon: <MdAnalytics/>
            },
        ]
    },
    {
        title: "User",
        list: [
            {
                title: "Settings",
                path: "/dashboard/settings",
             //   icon: <MdOutlineSettings/>
            },
            {
                title: "Help Center",
                path: "/dashboard/help",
              //  icon: <MdHelpCenter/>
            }
        ]
    },

]

const SideBar = () => {

    return(
        <div className="sticky  h-screen px-3 bg-background">
            <div className='flex items-center gap-5 mb-5'>
                <Image className='rounded-lg object-cover' src="/vercel.svg" alt="" width={50} height={50} />
                <div className='flex flex-col'>
                    <span className="font-bold text-sm">
                        Gregg Trimarchi
                    </span>
                    <span className='text-xs text-gray-300'>
                        Administrator
                    </span>
                </div>
            </div>
            <ul className='list-none'>
                {menuItems.map(category=>(
                    <li 
                    className=''
                    key={category.title}>
                        <span className='font-bold text-xs mt-2.5 text-gray-300'>{category.title}</span>
                        {category.list.map(item=>(
                            <MenuLink item={item} key={item.title}/>
                        ))}
                    </li>
                ))}
                <button className='container flex items-center gap-2.5 p-2.5 m-1 hover:bg-sky-900 active:bg-sky-900 rounded-lg'>Logout</button>
            </ul>
            
        </div>
    )
}

export default SideBar