import clsx from 'clsx';
import Link from 'next/link';

interface Props {
    href: string;
    icon: React.ReactNode;
    label: string;
    activeTab: boolean;
}
const NavItem = ({href, icon, label, activeTab}: Props) => {
    return (
        <Link href={href} className='flex items-center flex-col' onClick={() => {}}>
            {icon}
            <span
                className={clsx({
                    'typo-body_ss text-primary': activeTab,
                    'text-[#7e919a] typo-body_sr': !activeTab
                })}
            >
                {label}
            </span>
        </Link>
    );
};
export default NavItem;
