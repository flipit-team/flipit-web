import clsx from 'clsx';
import Link from 'next/link';

interface Props {
    href: string;
    icon: React.ReactNode;
    label: string;
    activeTab: boolean;
    badge?: number;
}
const NavItem = ({href, icon, label, activeTab, badge}: Props) => {
    return (
        <Link href={href} className='flex items-center flex-col relative'>
            <div className='relative'>
                {icon}
                {badge !== undefined && badge > 0 && (
                    <span className='absolute -top-1 -right-2 bg-accent-coral text-white text-[10px] font-bold rounded-full min-w-[16px] h-[16px] flex items-center justify-center px-1'>
                        {badge > 99 ? '99+' : badge}
                    </span>
                )}
            </div>
            <span
                className={clsx({
                    'typo-body_ss text-primary': activeTab,
                    'text-tab-default typo-body_sr': !activeTab
                })}
            >
                {label}
            </span>
            {activeTab && <span className='mt-0.5 h-0.5 w-4 rounded-full bg-primary' />}
        </Link>
    );
};
export default NavItem;
