'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  HomeIcon,
  ListBulletIcon,
  UsersIcon,
  CursorArrowRaysIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface AdminSidebarProps {
  onClose?: () => void;
}

const navigation = [
  { name: 'Overview', href: '/admin/overview', icon: HomeIcon },
  { name: 'Listings', href: '/admin/listings', icon: ListBulletIcon },
  { name: 'Customers', href: '/admin/customers', icon: UsersIcon },
  { name: 'Bids', href: '/admin/bids', icon: CursorArrowRaysIcon },
  { name: 'Chats', href: '/admin/chats', icon: ChatBubbleLeftRightIcon },
  { name: 'Settings', href: '/admin/settings', icon: Cog6ToothIcon },
];

export default function AdminSidebar({ onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col flex-grow bg-primary overflow-y-auto">
      {/* Logo area */}
      <div className="flex items-center h-16 flex-shrink-0 px-4 bg-primary">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="h-8 w-8 bg-white rounded-md flex items-center justify-center">
              <span className="typo-body_ls text-primary font-bold">F</span>
            </div>
          </div>
          <div className="ml-3">
            <p className="typo-body_ls text-white">Flip Admin</p>
          </div>
        </div>
        {onClose && (
          <button
            type="button"
            className="ml-auto flex-shrink-0 h-10 w-10 rounded-md flex items-center justify-center text-white hover:bg-primary/80 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white md:hidden"
            onClick={onClose}
          >
            <span className="sr-only">Close sidebar</span>
            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onClose}
              className={`${
                isActive
                  ? 'bg-white text-primary'
                  : 'text-white hover:bg-white/10'
              } group flex items-center px-3 py-2 typo-body_mr rounded-md transition-colors duration-150 ease-in-out`}
            >
              <item.icon
                className={`${
                  isActive ? 'text-primary' : 'text-white/80'
                } mr-3 flex-shrink-0 h-5 w-5`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="flex-shrink-0 p-4 border-t border-white/20">
        <div className="text-center">
          <p className="typo-body_sr text-white/80">© 2025 Flip Auction</p>
          <p className="typo-body_sr text-white/60">Admin Panel v1.0</p>
        </div>
      </div>
    </div>
  );
}