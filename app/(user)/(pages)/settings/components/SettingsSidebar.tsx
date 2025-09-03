'use client';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
    Shield, 
    User, 
    Lock, 
    Globe, 
    Bell, 
    Trash2 
} from 'lucide-react';

const SettingsSidebar = () => {
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'verification';

    const menuItems = [
        {
            id: 'verification',
            label: 'Verification',
            icon: Shield,
            href: '/settings?section=verification'
        },
        {
            id: 'personal-details',
            label: 'Personal Details',
            icon: User,
            href: '/settings?section=personal-details'
        },
        {
            id: 'change-password',
            label: 'Change Password',
            icon: Lock,
            href: '/settings?section=change-password'
        },
        {
            id: 'change-language',
            label: 'Change Language',
            icon: Globe,
            href: '/settings?section=change-language'
        },
        {
            id: 'manage-notifications',
            label: 'Manage Notifications',
            icon: Bell,
            href: '/settings?section=manage-notifications'
        },
        {
            id: 'delete-account',
            label: 'Delete Account',
            icon: Trash2,
            href: '/settings?section=delete-account'
        }
    ];

    return (
        <>
            {/* Desktop Sidebar */}
            <div className='hidden md:block w-[280px] h-fit bg-white rounded-lg shadow p-[22px]'>
                <div>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeSection === item.id;
                        
                        return (
                            <Link
                                key={item.id}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 p-3 rounded-lg mb-2 transition-colors duration-200
                                    ${isActive 
                                        ? 'bg-primary bg-opacity-10 text-primary border-l-4 border-primary' 
                                        : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                                    }
                                `}
                            >
                                <Icon className='w-5 h-5' />
                                <span className='font-medium'>{item.label}</span>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Horizontal Scrollable Menu */}
            <div className='md:hidden w-full mb-6 relative'>
                <div className='overflow-x-auto no-scrollbar'>
                    <div className='flex px-4 w-max relative'>
                        {menuItems.map((item) => {
                            const isActive = activeSection === item.id;
                            
                            return (
                                <Link
                                    key={item.id}
                                    href={item.href}
                                    className='flex flex-col items-center min-w-max py-3 px-6 transition-colors duration-200 relative'
                                >
                                    <span className={`
                                        typo-body-md-medium whitespace-nowrap transition-colors duration-200
                                        ${isActive ? 'text-primary' : 'text-gray-700'}
                                    `}>
                                        {item.label}
                                    </span>
                                    
                                    {/* Bottom border - changes color based on active state */}
                                    <div className={`
                                        absolute bottom-0 left-0 right-0 h-px transition-colors duration-200
                                        ${isActive ? 'bg-primary' : 'bg-border_gray'}
                                    `} />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
};

export default SettingsSidebar;