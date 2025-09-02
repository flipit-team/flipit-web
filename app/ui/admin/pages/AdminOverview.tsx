'use client';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { 
  ListBulletIcon,
  UsersIcon,
  CursorArrowRaysIcon,
  ClockIcon,
  EyeIcon
} from '@heroicons/react/24/outline';

// Mock data
const statsData = [
  {
    title: 'Total Listings',
    amount: '2,847',
    icon: <ListBulletIcon className="h-6 w-6 text-primary" />,
    trend: { value: 12.5, isPositive: true }
  },
  {
    title: 'Customers',
    amount: '1,293',
    icon: <UsersIcon className="h-6 w-6 text-primary" />,
    trend: { value: 8.2, isPositive: true }
  },
  {
    title: 'Total Bids',
    amount: '8,432',
    icon: <CursorArrowRaysIcon className="h-6 w-6 text-primary" />,
    trend: { value: 3.1, isPositive: false }
  }
];

const recentActivities = [
  { no: 1, timestamp: '2 mins ago', activity: 'New listing created', userId: 'USR-1234', action: 'listing' },
  { no: 2, timestamp: '5 mins ago', activity: 'Bid placed on iPhone 14', userId: 'USR-5678', action: 'bid' },
  { no: 3, timestamp: '12 mins ago', activity: 'User registered', userId: 'USR-9012', action: 'user' },
  { no: 4, timestamp: '18 mins ago', activity: 'Chat message sent', userId: 'USR-3456', action: 'chat' },
  { no: 5, timestamp: '25 mins ago', activity: 'Listing status updated', userId: 'USR-7890', action: 'listing' },
  { no: 6, timestamp: '32 mins ago', activity: 'Payment processed', userId: 'USR-2345', action: 'payment' },
  { no: 7, timestamp: '45 mins ago', activity: 'Auction ended', userId: 'USR-6789', action: 'auction' },
  { no: 8, timestamp: '1 hour ago', activity: 'New customer verification', userId: 'USR-0123', action: 'verification' },
  { no: 9, timestamp: '1 hour ago', activity: 'Bid rejected', userId: 'USR-4567', action: 'bid' },
  { no: 10, timestamp: '2 hours ago', activity: 'Support ticket created', userId: 'USR-8901', action: 'support' }
];

const columns = [
  { key: 'no', label: 'No' },
  { key: 'timestamp', label: 'Time Stamp' },
  { key: 'activity', label: 'Activity Description' },
  { key: 'userId', label: 'User/ID' },
  {
    key: 'action',
    label: 'Action',
    render: (value: string) => (
      <button className="text-primary hover:text-primary/80 typo-body_sr underline">
        View {value}
      </button>
    )
  }
];

const actions = [
  { label: 'View Details', onClick: (row: any) => console.log('View', row) },
  { label: 'Mark as Important', onClick: (row: any) => console.log('Mark Important', row) }
];

export default function AdminOverview() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = recentActivities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = recentActivities.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <PageHeader 
        title="Overview" 
        description="Get a comprehensive view of your auction platform's performance and activities"
      />

      {/* Stats Cards */}
      <div className="px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {statsData.map((stat, index) => (
            <StatsCard
              key={index}
              title={stat.title}
              amount={stat.amount}
              icon={stat.icon}
              trend={stat.trend}
            />
          ))}
        </div>
      </div>

      {/* Recent Activities Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DataTable
          title="Recent Activities"
          columns={columns}
          data={paginatedData}
          actions={actions}
          showSearch={true}
          showFilters={true}
          searchPlaceholder="Search activities..."
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
}