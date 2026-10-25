'use client';
import {useState, useEffect} from 'react';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import {AdminService} from '~/services';
import {CustomersSummaryDTO} from '~/types/api';
import {Users, User, MinusCircle} from 'lucide-react';

const columns = [
    {key: 'custId', label: 'Cust ID'},
    {key: 'name', label: 'Name'},
    {key: 'email', label: 'Email'},
    {key: 'regDate', label: 'Reg Date'},
    {
        key: 'status',
        label: 'Status',
        render: (value: string) => <StatusBadge status={value} />
    },
    {key: 'listingsBids', label: 'Listings/Bids'}
];

export default function AdminCustomers() {
    const [currentPage, setCurrentPage] = useState(1);
    const [summaryData, setSummaryData] = useState<CustomersSummaryDTO | null>(null);
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [summaryResult, customersResult] = await Promise.all([
                    AdminService.getCustomersSummary(),
                    AdminService.getAllCustomers()
                ]);

                if (summaryResult.error) {
                    throw new Error(summaryResult.error.message || 'Failed to fetch customers summary');
                }
                if (customersResult.error) {
                    throw new Error(customersResult.error.message || 'Failed to fetch customers');
                }

                setSummaryData(summaryResult.data);
                setCustomers(customersResult.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statsData = summaryData
        ? [
              {
                  title: 'Total Customers',
                  amount: summaryData.totalCustomers.toLocaleString(),
                  icon: <Users className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.totalCustomersChangePercent),
                      isPositive: summaryData.totalCustomersChangePercent >= 0
                  }
              },
              {
                  title: 'Active Customers',
                  amount: summaryData.activeCustomers.toLocaleString(),
                  icon: <User className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.activeCustomersChangePercent),
                      isPositive: summaryData.activeCustomersChangePercent >= 0
                  }
              },
              {
                  title: 'Blacklisted Customers',
                  amount: summaryData.blacklistedCustomers.toLocaleString(),
                  icon: <MinusCircle className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.blacklistedCustomersChangePercent),
                      isPositive: summaryData.blacklistedCustomersChangePercent < 0
                  }
              }
          ]
        : [];

    // Transform customers data for table display
    const customersData = customers.map((customer) => ({
        custId: customer.custId,
        name: customer.name,
        email: customer.email,
        regDate: customer.regDate,
        status: customer.status,
        listingsBids: customer.listingsBids
    }));

    const totalItems = customersData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = customersData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const handleBlacklist = async (custId: string) => {
        const result = await AdminService.blacklistCustomer(custId);
        if (result.error) {
            setError(`Failed to blacklist: ${result.error.message}`);
            return;
        }
        setCustomers(prev => prev.map((c: any) => c.id?.toString() === custId ? {...c, status: 'BLACKLISTED'} : c));
    };

    const handleWhitelist = async (custId: string) => {
        const result = await AdminService.whitelistCustomer(custId);
        if (result.error) {
            setError(`Failed to whitelist: ${result.error.message}`);
            return;
        }
        setCustomers(prev => prev.map((c: any) => c.id?.toString() === custId ? {...c, status: 'ACTIVE'} : c));
    };

    const actions = [
        {
            label: 'Blacklist',
            onClick: (row: {custId: string; name: string; status: string}) => {
                if (row.status === 'BLACKLISTED') {
                    handleWhitelist(row.custId);
                } else {
                    handleBlacklist(row.custId);
                }
            },
            className: 'text-red-600',
            getLabel: (row: {status: string}) => row.status === 'BLACKLISTED' ? 'Whitelist' : 'Blacklist'
        }
    ];

    if (loading) {
        return (
            <LogoLoader />
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen' role='alert' aria-live='assertive'>
                <div className='text-center'>
                    <p className='text-red-600 font-semibold'>Error loading customers</p>
                    <p className='text-gray-600 mt-2'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
                        aria-label='Retry loading customers'
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title='All Customers'
                description='Manage customer accounts, monitor their activity, and maintain platform security'
            />

            {/* Stats Cards */}
            <div className='px-4 sm:px-6 lg:px-8 mb-8'>
                <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3'>
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
            <div className='px-4 sm:px-6 lg:px-8'>
                <DataTable
                    title='All Customers'
                    columns={columns}
                    data={paginatedData}
                    actions={actions}
                    showSearch={true}
                    showFilters={true}
                    searchPlaceholder='Search customers...'
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
