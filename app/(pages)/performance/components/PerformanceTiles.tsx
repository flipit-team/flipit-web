interface TileData {
    title: string;
    amount: string;
}

const PerformanceTiles = () => {
    const tilesData: TileData[] = [
        {
            title: 'Impressions',
            amount: '12,450'
        },
        {
            title: 'Visitors',
            amount: '3,240'
        },
        {
            title: 'Phone view',
            amount: '1,890'
        },
        {
            title: 'Chat request',
            amount: '567'
        }
    ];

    return (
        <div className='flex gap-6 mb-8'>
            {tilesData.map((tile, index) => (
                <div
                    key={index}
                    className='bg-white w-[256px] h-[101px] rounded-[8px] border border-border_gray shadow-md px-6 flex items-center justify-between'
                >
                    <div className='flex flex-col justify-center'>
                        <h3 className='text-gray-600 text-sm font-normal mb-2'>{tile.title}</h3>
                        <p className='text-2xl font-semibold text-gray-900'>{tile.amount}</p>
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
    );
};

export default PerformanceTiles;
