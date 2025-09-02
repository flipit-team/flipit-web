'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { 
  Bars3Icon,
  BellIcon,
  ChevronDownIcon 
} from '@heroicons/react/24/outline';

interface AdminUser {
  name: string;
  email: string;
  role: string;
  avatar: string;
}

interface AdminHeaderProps {
  user: AdminUser;
  onMenuClick: () => void;
}

export default function AdminHeader({ user, onMenuClick }: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('admin_logged_in');
    router.push('/admin/login');
  };

  return (
    <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        {/* Mobile menu button */}
        <button
          type="button"
          className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
          onClick={onMenuClick}
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon className="h-6 w-6" aria-hidden="true" />
        </button>

        {/* Left side - empty for now, could add breadcrumbs */}
        <div className="flex-1 md:flex-none"></div>

        {/* Right side */}
        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button
            type="button"
            className="p-2 text-gray-400 rounded-full hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            <span className="sr-only">View notifications</span>
            <BellIcon className="h-6 w-6" aria-hidden="true" />
          </button>

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <span className="sr-only">Open user menu</span>
              <div className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-50">
                <Image
                  className="h-8 w-8 rounded-full object-cover"
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                />
                <div className="hidden sm:block text-left">
                  <p className="typo-body_ms text-text_one">{user.name}</p>
                  <p className="typo-body_sr text-text_four">{user.role}</p>
                </div>
                <ChevronDownIcon
                  className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${
                    dropdownOpen ? 'transform rotate-180' : ''
                  }`}
                />
              </div>
            </button>

            {/* Dropdown menu */}
            {dropdownOpen && (
              <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
                <div className="px-4 py-2 border-b border-gray-200">
                  <p className="typo-body_ms text-text_one">{user.name}</p>
                  <p className="typo-body_sr text-text_four">{user.email}</p>
                </div>
                <a
                  href="#"
                  className="block px-4 py-2 typo-body_mr text-text_two hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                  }}
                >
                  Your Profile
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 typo-body_mr text-text_two hover:bg-gray-100"
                  onClick={(e) => {
                    e.preventDefault();
                    setDropdownOpen(false);
                  }}
                >
                  Settings
                </a>
                <button
                  className="block w-full text-left px-4 py-2 typo-body_mr text-text_two hover:bg-gray-100"
                  onClick={() => {
                    setDropdownOpen(false);
                    handleLogout();
                  }}
                >
                  Sign out
                </button>
              </div>
            )}

            {/* Click outside to close dropdown */}
            {dropdownOpen && (
              <div
                className="fixed inset-0 z-0"
                onClick={() => setDropdownOpen(false)}
              ></div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}