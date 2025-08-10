'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, ShoppingBag, Megaphone, BarChart3, Settings, LogOut } from 'lucide-react';

interface SidebarProps {
    username?: string;
}

const Sidebar = ({ username = 'User' }: SidebarProps) => {
    const pathname = usePathname();

    const menuItems = [
        {
            href: '/my-items',
            label: 'My Items',
            icon: ShoppingBag,
        },
        {
            href: '/my-adverts',
            label: 'My Adverts',
            icon: Megaphone,
        },
        {
            href: '/performance',
            label: 'Performance',
            icon: BarChart3,
        },
        {
            href: '/settings',
            label: 'Settings',
            icon: Settings,
        }
    ];

    const isActiveRoute = (href: string) => {
        return pathname === href;
    };

    const handleLogout = () => {
        // TODO: Implement logout functionality
        console.log('Logout clicked');
    };

    return (
        <div className='w-[260px] p-[22px] bg-white border-r border-border_gray h-full'>
            {/* User Element */}
            <div className='my-[28px] bg-primary bg-opacity-[8%] py-[16px] px-[24px] rounded-md'>
                <div className='flex items-center gap-3'>
                    <User className='w-5 h-5 text-primary' />
                    <span className='text-primary font-medium'>
                        Hello {username}
                    </span>
                </div>
            </div>

            {/* Menu Items */}
            <div className='space-y-1'>
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const active = isActiveRoute(item.href);
                    
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`
                                flex items-center gap-3 h-[44px] px-4 rounded-md transition-colors duration-200
                                ${active 
                                    ? 'bg-primary bg-opacity-[8%] text-primary' 
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                }
                            `}
                        >
                            <Icon className='w-5 h-5' />
                            <span className='font-medium'>{item.label}</span>
                        </Link>
                    );
                })}

                {/* Logout Item */}
                <button
                    onClick={handleLogout}
                    className='w-full flex items-center gap-3 h-[44px] px-4 rounded-md text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors duration-200'
                >
                    <LogOut className='w-5 h-5' />
                    <span className='font-medium'>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;