'use client';
import { useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import { 
  UsersIcon,
  UserIcon,
  MinusCircleIcon
} from '@heroicons/react/24/outline';

// Mock data
const statsData = [
  {
    title: 'Total Customers',
    amount: '2,847',
    icon: <UsersIcon className="h-6 w-6 text-primary" />,
    trend: { value: 12.5, isPositive: true }
  },
  {
    title: 'Active Customers',
    amount: '2,693',
    icon: <UserIcon className="h-6 w-6 text-primary" />,
    trend: { value: 8.2, isPositive: true }
  },
  {
    title: 'Blacklisted Customers',
    amount: '23',
    icon: <MinusCircleIcon className="h-6 w-6 text-primary" />,
    trend: { value: 15.0, isPositive: false }
  }
];

const customersData = [
  {
    custId: 'CUST-001',
    name: 'John Doe',
    email: 'john.doe@email.com',
    regDate: '2024-12-15',
    status: 'active',
    listingsBids: '12/34'
  },
  {
    custId: 'CUST-002',
    name: 'Sarah Johnson',
    email: 'sarah.j@email.com',
    regDate: '2024-12-10',
    status: 'active',
    listingsBids: '8/56'
  },
  {
    custId: 'CUST-003',
    name: 'Michael Chen',
    email: 'michael.chen@email.com',
    regDate: '2024-12-08',
    status: 'inactive',
    listingsBids: '3/12'
  },
  {
    custId: 'CUST-004',
    name: 'Emma Wilson',
    email: 'emma.wilson@email.com',
    regDate: '2024-12-05',
    status: 'active',
    listingsBids: '15/78'
  },
  {
    custId: 'CUST-005',
    name: 'David Rodriguez',
    email: 'david.r@email.com',
    regDate: '2024-12-02',
    status: 'blacklisted',
    listingsBids: '0/5'
  },
  {
    custId: 'CUST-006',
    name: 'Lisa Anderson',
    email: 'lisa.anderson@email.com',
    regDate: '2024-11-28',
    status: 'active',
    listingsBids: '22/45'
  },
  {
    custId: 'CUST-007',
    name: 'James Brown',
    email: 'james.brown@email.com',
    regDate: '2024-11-25',
    status: 'active',
    listingsBids: '7/23'
  },
  {
    custId: 'CUST-008',
    name: 'Maria Garcia',
    email: 'maria.garcia@email.com',
    regDate: '2024-11-20',
    status: 'inactive',
    listingsBids: '4/18'
  },
  {
    custId: 'CUST-009',
    name: 'Robert Taylor',
    email: 'robert.taylor@email.com',
    regDate: '2024-11-18',
    status: 'active',
    listingsBids: '18/67'
  },
  {
    custId: 'CUST-010',
    name: 'Jennifer Lee',
    email: 'jennifer.lee@email.com',
    regDate: '2024-11-15',
    status: 'active',
    listingsBids: '9/29'
  }
];

const columns = [
  { key: 'custId', label: 'Cust ID' },
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'regDate', label: 'Reg Date' },
  {
    key: 'status',
    label: 'Status',
    render: (value: string) => <StatusBadge status={value} />
  },
  { key: 'listingsBids', label: 'Listings/Bids' }
];

export default function AdminCustomers() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const totalItems = customersData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedData = customersData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const actions = [
    { 
      label: 'View', 
      onClick: (row: any) => console.log('View customer', row.custId),
      className: 'text-blue-600'
    },
    { 
      label: 'Blacklist', 
      onClick: (row: any) => console.log('Blacklist customer', row.custId),
      className: 'text-red-600'
    },
    { 
      label: 'Chat', 
      onClick: (row: any) => console.log('Chat with customer', row.custId),
      className: 'text-green-600'
    }
  ];

  return (
    <div>
      <PageHeader 
        title="All Customers" 
        description="Manage customer accounts, monitor their activity, and maintain platform security"
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

      {/* Customers Table */}
      <div className="px-4 sm:px-6 lg:px-8">
        <DataTable
          title="All Customers"
          columns={columns}
          data={paginatedData}
          actions={actions}
          showSearch={true}
          showFilters={true}
          searchPlaceholder="Search customers..."
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