'use client';
import {useState, useEffect} from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import {AdminService} from '~/services';
import {DashboardSummaryDTO} from '~/types/api';
import {ListBulletIcon, UsersIcon, CursorArrowRaysIcon, ClockIcon, EyeIcon} from '@heroicons/react/24/outline';

const columns = [
    {key: 'no', label: 'No'},
    {key: 'timestamp', label: 'Time Stamp'},
    {key: 'activity', label: 'Activity Description'},
    {key: 'userId', label: 'User/ID'},
    {
        key: 'action',
        label: 'Action',
        render: (value: string) => (
            <button className='text-primary hover:text-primary/80 typo-body_sr underline'>View {value}</button>
        )
    }
];

const actions = [
    {
        label: 'View Details',
        onClick: (row: {no: number; activity: string}) => {
            // TODO: Implement view details modal or navigation
            alert(`View details for activity #${row.no}: ${row.activity}`);
        }
    },
    {
        label: 'Mark as Important',
        onClick: (row: {no: number}) => {
            // TODO: Implement mark as important functionality
            alert(`Marking activity #${row.no} as important`);
        }
    }
];

export default function AdminOverview() {
    const [currentPage, setCurrentPage] = useState(1);
    const [dashboardData, setDashboardData] = useState<DashboardSummaryDTO | null>(null);
    const [recentActivities, setRecentActivities] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [summaryResult, activitiesResult] = await Promise.all([
                    AdminService.getDashboardSummary(),
                    AdminService.getRecentActivities()
                ]);

                if (summaryResult.error) {
                    throw new Error(summaryResult.error.message || 'Failed to fetch dashboard summary');
                }
                if (activitiesResult.error) {
                    throw new Error(activitiesResult.error.message || 'Failed to fetch recent activities');
                }

                setDashboardData(summaryResult.data);
                setRecentActivities(activitiesResult.data || []);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statsData = dashboardData
        ? [
              {
                  title: 'Total Listings',
                  amount: dashboardData.totalListings.toLocaleString(),
                  icon: <ListBulletIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(dashboardData.totalListingsChangePercent),
                      isPositive: dashboardData.totalListingsChangePercent >= 0
                  }
              },
              {
                  title: 'Customers',
                  amount: dashboardData.customers.toLocaleString(),
                  icon: <UsersIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(dashboardData.customersChangePercent),
                      isPositive: dashboardData.customersChangePercent >= 0
                  }
              },
              {
                  title: 'Total Bids',
                  amount: dashboardData.totalBids.toLocaleString(),
                  icon: <CursorArrowRaysIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(dashboardData.totalBidsChangePercent),
                      isPositive: dashboardData.totalBidsChangePercent >= 0
                  }
              }
          ]
        : [];

    // Transform activities data for table display
    const activitiesData = recentActivities.map((activity, index) => ({
        no: index + 1,
        timestamp: activity,
        activity: activity,
        userId: '-',
        action: 'view'
    }));

    const totalItems = activitiesData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = activitiesData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'></div>
                    <p className='mt-4 text-gray-600'>Loading dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <p className='text-red-600 font-semibold'>Error loading dashboard</p>
                    <p className='text-gray-600 mt-2'>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div>
            <PageHeader
                title='Overview'
                description="Get a comprehensive view of your auction platform's performance and activities"
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

            {/* Recent Activities Table */}
            <div className='px-4 sm:px-6 lg:px-8'>
                <DataTable
                    title='Recent Activities'
                    columns={columns}
                    data={paginatedData}
                    actions={actions}
                    showSearch={true}
                    showFilters={true}
                    searchPlaceholder='Search activities...'
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
