'use client';
import {useState, useEffect} from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import {AdminService} from '~/services';
import {BidsSummaryDTO} from '~/types/api';
import {CursorArrowRaysIcon, CheckCircleIcon, ClockIcon} from '@heroicons/react/24/outline';

const columns = [
    {key: 'bidId', label: 'Bid ID'},
    {key: 'listingId', label: 'Listing ID'},
    {key: 'customerId', label: 'Customer ID'},
    {key: 'bidAmount', label: 'Bid Amount'},
    {key: 'bidDate', label: 'Bid Date'},
    {
        key: 'status',
        label: 'Status',
        render: (value: string) => <StatusBadge status={value} />
    }
];

export default function AdminBids() {
    const [currentPage, setCurrentPage] = useState(1);
    const [summaryData, setSummaryData] = useState<BidsSummaryDTO | null>(null);
    const [bids, setBids] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [summaryResult, bidsResult] = await Promise.all([
                    AdminService.getBidsSummary(),
                    AdminService.getAllBids()
                ]);

                if (summaryResult.error) {
                    throw new Error(summaryResult.error.message || 'Failed to fetch bids summary');
                }
                if (bidsResult.error) {
                    throw new Error(bidsResult.error.message || 'Failed to fetch bids');
                }

                setSummaryData(summaryResult.data);
                setBids(bidsResult.data || []);
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
                  title: 'Total Bids',
                  amount: summaryData.totalBids.toLocaleString(),
                  icon: <CursorArrowRaysIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.totalBidsChangePercent),
                      isPositive: summaryData.totalBidsChangePercent >= 0
                  }
              },
              {
                  title: 'Pending Bids',
                  amount: summaryData.pendingBids.toLocaleString(),
                  icon: <ClockIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.pendingBidsChangePercent),
                      isPositive: summaryData.pendingBidsChangePercent >= 0
                  }
              },
              {
                  title: 'Accepted Bids',
                  amount: summaryData.acceptedBids.toLocaleString(),
                  icon: <CheckCircleIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.acceptedBidsChangePercent),
                      isPositive: summaryData.acceptedBidsChangePercent >= 0
                  }
              }
          ]
        : [];

    // Transform bids data for table display
    const bidsData = bids.map((bid, index) => ({
        bidId: `BID-${String(index + 1).padStart(3, '0')}`,
        listingId: '-',
        customerId: '-',
        bidAmount: bid,
        bidDate: '-',
        status: 'pending'
    }));

    const totalItems = bidsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = bidsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const actions = [
        {
            label: 'View',
            onClick: (row: {bidId: string; bidAmount: string}) => {
                // TODO: Show bid details modal
                alert(`Viewing bid ${row.bidId} - Amount: ${row.bidAmount}`);
            },
            className: 'text-blue-600'
        },
        {
            label: 'Accept',
            onClick: (row: {bidId: string; bidAmount: string}) => {
                if (confirm(`Accept bid ${row.bidId} for ${row.bidAmount}?`)) {
                    alert(`Bid ${row.bidId} accepted`);
                    // Future: Call API to accept bid
                }
            },
            className: 'text-green-600'
        },
        {
            label: 'Reject',
            onClick: (row: {bidId: string}) => {
                const reason = prompt('Reason for rejecting this bid:');
                if (reason) {
                    alert(`Bid ${row.bidId} rejected. Reason: ${reason}`);
                    // Future: Call API to reject bid
                }
            },
            className: 'text-red-600'
        }
    ];

    if (loading) {
        return (
            <div className='flex items-center justify-center min-h-screen' role='status' aria-live='polite'>
                <div className='text-center'>
                    <div
                        className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto'
                        aria-hidden='true'
                    ></div>
                    <p className='mt-4 text-gray-600'>Loading bids...</p>
                    <span className='sr-only'>Loading bids data, please wait</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen' role='alert' aria-live='assertive'>
                <div className='text-center'>
                    <p className='text-red-600 font-semibold'>Error loading bids</p>
                    <p className='text-gray-600 mt-2'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
                        aria-label='Retry loading bids'
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
                title='All Bids'
                description='Monitor and manage all bidding activity across the platform with comprehensive status tracking'
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

            {/* Bids Table */}
            <div className='px-4 sm:px-6 lg:px-8'>
                <DataTable
                    title='All Bids'
                    columns={columns}
                    data={paginatedData}
                    actions={actions}
                    showSearch={true}
                    showFilters={true}
                    searchPlaceholder='Search bids...'
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
