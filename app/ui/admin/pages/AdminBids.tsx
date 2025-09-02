'use client';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { 
  CursorArrowRaysIcon,
  CheckCircleIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Mock data
const statsData = [
  {
    title: 'Total Bids',
    amount: '8,432',
    icon: <CursorArrowRaysIcon className="h-6 w-6 text-primary" />,
    trend: { value: 18.5, isPositive: true }
  },
  {
    title: 'Pending Bids',
    amount: '1,247',
    icon: <ClockIcon className="h-6 w-6 text-primary" />,
    trend: { value: 12.3, isPositive: true }
  },
  {
    title: 'Accepted Bids',
    amount: '6,892',
    icon: <CheckCircleIcon className="h-6 w-6 text-primary" />,
    trend: { value: 8.7, isPositive: true }
  }
];

const bidsData = [
  {
    bidId: 'BID-001',
    listingId: 'LST-001',
    customerId: 'CUST-001',
    bidAmount: '₦850,000',
    bidDate: '2025-01-15',
    status: 'accepted'
  },
  {
    bidId: 'BID-002',
    listingId: 'LST-002',
    customerId: 'CUST-002',
    bidAmount: '₦1,150,000',
    bidDate: '2025-01-15',
    status: 'pending'
  },
  {
    bidId: 'BID-003',
    listingId: 'LST-001',
    customerId: 'CUST-003',
    bidAmount: '₦820,000',
    bidDate: '2025-01-14',
    status: 'rejected'
  },
  {
    bidId: 'BID-004',
    listingId: 'LST-003',
    customerId: 'CUST-004',
    bidAmount: '₦2,050,000',
    bidDate: '2025-01-14',
    status: 'accepted'
  },
  {
    bidId: 'BID-005',
    listingId: 'LST-004',
    customerId: 'CUST-005',
    bidAmount: '₦600,000',
    bidDate: '2025-01-13',
    status: 'pending'
  },
  {
    bidId: 'BID-006',
    listingId: 'LST-002',
    customerId: 'CUST-006',
    bidAmount: '₦1,200,000',
    bidDate: '2025-01-13',
    status: 'accepted'
  },
  {
    bidId: 'BID-007',
    listingId: 'LST-005',
    customerId: 'CUST-007',
    bidAmount: '₦900,000',
    bidDate: '2025-01-12',
    status: 'pending'
  },
  {
    bidId: 'BID-008',
    listingId: 'LST-006',
    customerId: 'CUST-008',
    bidAmount: '₦720,000',
    bidDate: '2025-01-12',
    status: 'rejected'
  },
  {
    bidId: 'BID-009',
    listingId: 'LST-007',
    customerId: 'CUST-009',
    bidAmount: '₦1,750,000',
    bidDate: '2025-01-11',
    status: 'accepted'
  },
  {
    bidId: 'BID-010',
    listingId: 'LST-008',
    customerId: 'CUST-010',
    bidAmount: '₦350,000',
    bidDate: '2025-01-11',
    status: 'pending'
  }
];

const columns = [
  { key: 'bidId', label: 'Bid ID' },
  { key: 'listingId', label: 'Listing ID' },
  { key: 'customerId', label: 'Customer ID' },
  { key: 'bidAmount', label: 'Bid Amount' },
  { key: 'bidDate', label: 'Bid Date' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />
  }
];

export default function AdminBids() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = bidsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = bidsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const actions = [
    { 
      label: 'View', 
      onClick: (row: any) => console.log('View bid', row.bidId),
      className: 'text-blue-600'
    },
    { 
      label: 'Accept', 
      onClick: (row: any) => console.log('Accept bid', row.bidId),
      className: 'text-green-600'
    },
    { 
      label: 'Reject', 
      onClick: (row: any) => console.log('Reject bid', row.bidId),
      className: 'text-red-600'
    }
  ];

  return (
    <div>
      <PageHeader 
        title="All Bids" 
        description="Monitor and manage all bidding activity across the platform with comprehensive status tracking"
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

      {/* Bids Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DataTable
          title="All Bids"
          columns={columns}
          data={paginatedData}
          actions={actions}
          showSearch={true}
          showFilters={true}
          searchPlaceholder="Search bids..."
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