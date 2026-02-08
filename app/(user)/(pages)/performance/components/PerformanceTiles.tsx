'use client';
import { useEffect, useState } from 'react';
import UserService from '~/services/user.service';

interface TileData {
    title: string;
    amount: string;
}

const PerformanceTiles = () => {
    const [tilesData, setTilesData] = useState<TileData[]>([
        { title: 'Impressions', amount: '0' },
        { title: 'Visitors', amount: '0' },
        { title: 'Phone view', amount: '0' },
        { title: 'Chat request', amount: '0' }
    ]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPerformanceMetrics = async () => {
            try {
                const result = await UserService.getPerformanceMetrics();
                if (result.data) {
                    setTilesData([
                        {
                            title: 'Impressions',
                            amount: result.data.impressionsCount.toLocaleString()
                        },
                        {
                            title: 'Visitors',
                            amount: result.data.visitorsCount.toLocaleString()
                        },
                        {
                            title: 'Phone view',
                            amount: result.data.phoneViewsCount.toLocaleString()
                        },
                        {
                            title: 'Chat request',
                            amount: result.data.chatRequestsCount.toLocaleString()
                        }
                    ]);
                }
            } catch (error) {
                console.error('Failed to fetch performance metrics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPerformanceMetrics();
    }, []);

    if (loading) {
        return (
            <div className='overflow-x-auto scrollbar-hide mb-8'>
                <div className='flex gap-4 sm:gap-6 min-w-max sm:min-w-0'>
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className='bg-white w-[220px] sm:w-[256px] h-[101px] rounded-[8px] border border-border_gray shadow-md px-4 sm:px-6 flex items-center justify-between flex-shrink-0 animate-pulse'
                        >
                            <div className='flex flex-col justify-center gap-2'>
                                <div className='h-4 w-20 bg-gray-200 rounded'></div>
                                <div className='h-6 w-16 bg-gray-200 rounded'></div>
                            </div>
                            <div className='w-[56px] h-[56px] rounded-full bg-gray-200'></div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className='overflow-x-auto scrollbar-hide mb-8'>
            <div className='flex gap-4 sm:gap-6 min-w-max sm:min-w-0'>
                {tilesData.map((tile, index) => (
                    <div
                        key={index}
                        className='bg-white w-[220px] sm:w-[256px] h-[101px] rounded-[8px] border border-border_gray shadow-md px-4 sm:px-6 flex items-center justify-between flex-shrink-0'
                    >
                        <div className='flex flex-col justify-center'>
                            <h3 className='text-gray-600 typo-body-md-regular mb-2'>{tile.title}</h3>
                            <p className='typo-heading-lg-semibold text-gray-900'>{tile.amount}</p>
                        </div>

                        <div className='flex-shrink-0'>
                            <div className='w-[56px] h-[56px] relative rounded-full bg-primary bg-opacity-10 flex items-center justify-center'>
                                {/* Temporary placeholder - replace with actual icons later */}
                                <div className='w-6 h-6 bg-primary rounded'></div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PerformanceTiles;
