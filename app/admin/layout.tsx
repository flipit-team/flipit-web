'use client';
import { usePathname } from 'next/navigation';
import AdminLayout from '../ui/admin/layout/AdminLayout';

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-gray-50">
        {children}
      </div>
    );
  }

  return <AdminLayout>{children}</AdminLayout>;
}