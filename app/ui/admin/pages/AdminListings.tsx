'use client';
import {useState, useEffect} from 'react';
import PageHeader from '../components/PageHeader';
import StatsCard from '../components/StatsCard';
import DataTable from '../components/DataTable';
import Pagination from '../components/Pagination';
import StatusBadge from '../components/StatusBadge';
import {AdminService} from '~/services';
import {ListingsSummaryDTO, ListingDTO} from '~/types/api';
import {ListBulletIcon, PlayIcon, PauseIcon, ClockIcon} from '@heroicons/react/24/outline';

const columns = [
    {key: 'listingId', label: 'Listing ID'},
    {key: 'title', label: 'Title'},
    {
        key: 'description',
        label: 'Description',
        render: (value: string) => (
            <span className='truncate max-w-xs block' title={value}>
                {value.length > 50 ? `${value.substring(0, 50)}...` : value}
            </span>
        )
    },
    {key: 'price', label: 'Price'},
    {
        key: 'status',
        label: 'Status',
        render: (value: string) => <StatusBadge status={value} />
    },
    {key: 'dateCreated', label: 'Date Created'}
];

export default function AdminListings() {
    const [currentPage, setCurrentPage] = useState(1);
    const [summaryData, setSummaryData] = useState<ListingsSummaryDTO | null>(null);
    const [listings, setListings] = useState<ListingDTO[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const itemsPerPage = 8;

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError(null);

            try {
                const [summaryResult, listingsResult] = await Promise.all([
                    AdminService.getListingsSummary(),
                    AdminService.getAllListings()
                ]);

                if (summaryResult.error) {
                    throw new Error(summaryResult.error.message || 'Failed to fetch listings summary');
                }
                if (listingsResult.error) {
                    throw new Error(listingsResult.error.message || 'Failed to fetch listings');
                }

                setSummaryData(summaryResult.data);
                setListings(listingsResult.data || []);
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
                  title: 'Active Listings',
                  amount: summaryData.activeListings.toLocaleString(),
                  icon: <PlayIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.activeListingsChangePercent),
                      isPositive: summaryData.activeListingsChangePercent >= 0
                  }
              },
              {
                  title: 'Sold Listings',
                  amount: summaryData.soldListings.toLocaleString(),
                  icon: <PauseIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.soldListingsChangePercent),
                      isPositive: summaryData.soldListingsChangePercent >= 0
                  }
              },
              {
                  title: 'Pending Listings',
                  amount: summaryData.pendingListings.toLocaleString(),
                  icon: <ClockIcon className='h-6 w-6 text-primary' />,
                  trend: {
                      value: Math.abs(summaryData.pendingListingsChangePercent),
                      isPositive: summaryData.pendingListingsChangePercent >= 0
                  }
              }
          ]
        : [];

    // Transform listings data for table display with null checks
    const listingsData = listings.map((listing) => ({
        listingId: listing?.id || 'N/A',
        title: listing?.title || 'Untitled',
        description: listing?.description || 'No description',
        price: listing?.price ? `₦${listing.price.toLocaleString()}` : 'N/A',
        status: listing?.status || 'unknown',
        dateCreated: listing?.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'N/A'
    }));

    const totalItems = listingsData.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const paginatedData = listingsData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const actions = [
        {
            label: 'Update Status',
            onClick: (row: {listingId: string; title: string; status: string}) => {
                // TODO: Implement status update modal
                const newStatus = prompt(
                    `Update status for "${row.title}"?\nCurrent status: ${row.status}\n\nEnter new status (active/inactive/pending):`
                );
                if (newStatus) {
                    alert(`Status updated to: ${newStatus}`);
                    // Future: Call API to update status
                }
            },
            className: 'text-blue-600'
        },
        {
            label: 'Blacklist',
            onClick: (row: {listingId: string; title: string}) => {
                if (confirm(`Are you sure you want to blacklist "${row.title}"?`)) {
                    alert(`Listing ${row.listingId} has been blacklisted`);
                    // Future: Call API to blacklist listing
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
                    <p className='mt-4 text-gray-600'>Loading listings...</p>
                    <span className='sr-only'>Loading listings data, please wait</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className='flex items-center justify-center min-h-screen' role='alert' aria-live='assertive'>
                <div className='text-center'>
                    <p className='text-red-600 font-semibold'>Error loading listings</p>
                    <p className='text-gray-600 mt-2'>{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className='mt-4 px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
                        aria-label='Retry loading listings'
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
                title='Listings'
                description='Manage all auction listings, their status, and monitor performance across the platform'
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

            {/* Listings Table */}
            <div className='px-4 sm:px-6 lg:px-8'>
                <DataTable
                    title='Listings'
                    columns={columns}
                    data={paginatedData}
                    actions={actions}
                    showSearch={true}
                    showFilters={true}
                    searchPlaceholder='Search listings...'
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
