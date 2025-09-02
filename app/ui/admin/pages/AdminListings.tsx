'use client';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { 
  ListBulletIcon,
  PlayIcon,
  PauseIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

// Mock data
const statsData = [
  {
    title: 'Active Listings',
    amount: '1,847',
    icon: <PlayIcon className="h-6 w-6 text-primary" />,
    trend: { value: 15.2, isPositive: true }
  },
  {
    title: 'Inactive Listings',
    amount: '293',
    icon: <PauseIcon className="h-6 w-6 text-primary" />,
    trend: { value: 5.1, isPositive: false }
  },
  {
    title: 'Pending Listings',
    amount: '157',
    icon: <ClockIcon className="h-6 w-6 text-primary" />,
    trend: { value: 8.7, isPositive: true }
  }
];

const listingsData = [
  {
    listingId: 'LST-001',
    title: 'iPhone 14 Pro Max - 256GB',
    description: 'Brand new iPhone 14 Pro Max in pristine condition with all original accessories...',
    price: '₦850,000',
    status: 'active',
    dateCreated: '2025-01-15'
  },
  {
    listingId: 'LST-002',
    title: 'Canon EOS R5 Camera',
    description: 'Professional camera in excellent condition, barely used for photography...',
    price: '₦1,200,000',
    status: 'pending',
    dateCreated: '2025-01-14'
  },
  {
    listingId: 'LST-003',
    title: 'MacBook Pro 16-inch M2',
    description: 'High-performance laptop perfect for developers and content creators...',
    price: '₦2,100,000',
    status: 'inactive',
    dateCreated: '2025-01-13'
  },
  {
    listingId: 'LST-004',
    title: 'PlayStation 5 Console',
    description: 'Gaming console with two controllers and popular game titles included...',
    price: '₦650,000',
    status: 'active',
    dateCreated: '2025-01-12'
  },
  {
    listingId: 'LST-005',
    title: 'Samsung Galaxy S24 Ultra',
    description: 'Latest Samsung flagship with S-Pen and professional camera features...',
    price: '₦950,000',
    status: 'active',
    dateCreated: '2025-01-11'
  },
  {
    listingId: 'LST-006',
    title: 'iPad Pro 12.9-inch',
    description: 'Professional tablet with Apple Pencil and Magic Keyboard included...',
    price: '₦750,000',
    status: 'pending',
    dateCreated: '2025-01-10'
  },
  {
    listingId: 'LST-007',
    title: 'Gaming PC Setup',
    description: 'Custom-built gaming computer with RTX 4080 and latest components...',
    price: '₦1,800,000',
    status: 'active',
    dateCreated: '2025-01-09'
  },
  {
    listingId: 'LST-008',
    title: 'Apple Watch Series 9',
    description: 'Smartwatch with health monitoring and fitness tracking capabilities...',
    price: '₦380,000',
    status: 'inactive',
    dateCreated: '2025-01-08'
  },
  {
    listingId: 'LST-009',
    title: 'Bose QuietComfort Headphones',
    description: 'Premium noise-canceling headphones for audiophiles and professionals...',
    price: '₦280,000',
    status: 'active',
    dateCreated: '2025-01-07'
  },
  {
    listingId: 'LST-010',
    title: 'DJI Mini 3 Pro Drone',
    description: 'Professional drone with 4K camera and advanced flight features...',
    price: '₦920,000',
    status: 'pending',
    dateCreated: '2025-01-06'
  }
];

const columns = [
  { key: 'listingId', label: 'Listing ID' },
  { key: 'title', label: 'Title' },
  { 
    key: 'description', 
    label: 'Description',
    render: (value: string) => (
      <span className="truncate max-w-xs block" title={value}>
        {value.length > 50 ? `${value.substring(0, 50)}...` : value}
      </span>
    )
  },
  { key: 'price', label: 'Price' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />
  },
  { key: 'dateCreated', label: 'Date Created' }
];

export default function AdminListings() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = listingsData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = listingsData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const actions = [
    { 
      label: 'Update Status', 
      onClick: (row: any) => console.log('Update status for', row.listingId),
      className: 'text-blue-600'
    },
    { 
      label: 'Blacklist', 
      onClick: (row: any) => console.log('Blacklist', row.listingId),
      className: 'text-red-600'
    }
  ];

  return (
    <div>
      <PageHeader 
        title="Listings" 
        description="Manage all auction listings, their status, and monitor performance across the platform"
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

      {/* Listings Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DataTable
          title="Listings"
          columns={columns}
          data={paginatedData}
          actions={actions}
          showSearch={true}
          showFilters={true}
          searchPlaceholder="Search listings..."
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