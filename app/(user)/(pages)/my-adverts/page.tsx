'use client';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Sidebar from '~/ui/common/layout/sidebar';
import ItemsService from '~/services/items.service';
import { useAppContext } from '~/contexts/AppContext';
import ItemCard from '~/ui/common/item-card/ItemCard';
import { Item } from '~/utils/interface';

export default function MyAdvertsPage() {
    const router = useRouter();
    const { user } = useAppContext();
    const [items, setItems] = useState<Item[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMyItems = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await ItemsService.getUserItems(parseInt(user.userId));

                if (result.data) {
                    setItems(result.data as unknown as Item[]);
                    setError(null);
                } else if (result.error) {
                    setError(result.error.message || 'Failed to load your items');
                }
            } catch (err) {
                setError('An error occurred while loading your items');
            } finally {
                setLoading(false);
            }
        };

        fetchMyItems();
    }, [user?.userId]);

    return (
        <div className='flex min-h-screen bg-gray-50'>
            <div className='hidden lg:block'>
                <Sidebar username={user?.userName || 'User'} />
            </div>

            {/* Main Content Area */}
            <div className='flex-1 p-4 md:p-6 lg:p-8 xs:p-0 xs:px-4 xs:pt-4 overflow-x-hidden'>
                <div className='max-w-6xl mx-auto'>
                    {/* Mobile header */}
                    <div className='hidden xs:flex items-center gap-3 mb-4'>
                        <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                        </button>
                        <h1 className='font-poppins typo-heading-md-semibold text-text_one'>My Adverts</h1>
                    </div>

                    <h1 className='typo-heading-lg-bold md:typo-display-lg text-gray-900 mb-4 md:mb-6 xs:hidden'>My Adverts</h1>

                    {loading ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {[1, 2, 3, 4, 5, 6].map((i) => (
                                <div
                                    key={i}
                                    className='h-[400px] bg-white rounded-lg shadow animate-pulse'
                                >
                                    <div className='h-[302px] bg-gray-200 rounded-t-lg'></div>
                                    <div className='p-4 space-y-3'>
                                        <div className='h-4 bg-gray-200 rounded w-3/4'></div>
                                        <div className='h-6 bg-gray-200 rounded w-1/2'></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className='bg-white rounded-lg shadow p-6 text-center'>
                            <div className='text-error mb-4'>
                                <svg className='w-12 h-12 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' />
                                </svg>
                            </div>
                            <p className='text-error typo-body-lg-medium'>{error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className='mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors'
                            >
                                Try Again
                            </button>
                        </div>
                    ) : items.length === 0 ? (
                        <div className='bg-white rounded-lg shadow p-8 text-center'>
                            <div className='text-text_four mb-4'>
                                <svg className='w-16 h-16 mx-auto' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                                </svg>
                            </div>
                            <h2 className='typo-heading-md-semibold text-text_one mb-2'>No items yet</h2>
                            <p className='typo-body-md-regular text-text_four mb-6'>
                                Start selling by posting your first item
                            </p>
                            <Link
                                href='/post-item'
                                className='inline-block px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors typo-body-md-semibold'
                            >
                                Post an Item
                            </Link>
                        </div>
                    ) : (
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                            {items.map((item) => (
                                <ItemCard
                                    key={item.id}
                                    item={item}
                                    forEdit={false}
                                    showSaveButton={false}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
