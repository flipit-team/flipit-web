'use client';

interface ChartDataPoint {
    date: string;
    value: number;
}

const PerformanceChart = () => {
    // Mock data for the chart
    const chartData: ChartDataPoint[] = [
        { date: 'Apr 30', value: 0.3 },
        { date: 'May 1', value: 0.7 },
        { date: 'May 2', value: 0.5 },
        { date: 'May 3', value: 0.9 },
        { date: 'May 4', value: 0.6 },
        { date: 'May 5', value: 0.8 },
        { date: 'May 6', value: 0.4 },
        { date: 'May 7', value: 0.2 },
        { date: 'May 8', value: 0.6 },
        { date: 'May 9', value: 0.9 },
        { date: 'May 10', value: 0.7 },
        { date: 'May 11', value: 0.3 },
        { date: 'May 12', value: 0.8 },
        { date: 'May 13', value: 0.5 },
        { date: 'May 14', value: 0.4 }
    ];

    const yAxisLabels = ['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'];
    const maxValue = 1.0;

    return (
        <div className='bg-white rounded-lg border border-border_gray p-[18px] h-[593px]'>
            <div className='relative h-full'>
                <div className='flex h-[450px]'>
                    {/* Y-Axis Labels */}
                    <div className='flex flex-col justify-between w-8 mr-4 py-4'>
                        {yAxisLabels.map((label, index) => (
                            <span 
                                key={index} 
                                className='text-[11px] font-normal text-[#333333] text-right'
                            >
                                {label}
                            </span>
                        ))}
                    </div>

                    {/* Chart Container */}
                    <div className='flex-1 relative border-l border-b border-gray-200'>
                        {/* Chart Bars */}
                        <div className='flex items-end justify-between h-full px-2 pb-4'>
                            {chartData.map((dataPoint, index) => (
                                <div key={index} className='flex flex-col items-center'>
                                    <div
                                        className='bg-primary w-6 rounded-t-sm'
                                        style={{
                                            height: `${(dataPoint.value / maxValue) * 340}px`,
                                            minHeight: '4px'
                                        }}
                                    />
                                </div>
                            ))}
                        </div>

                        {/* X-Axis Labels */}
                        <div className='flex justify-between px-2 mt-2'>
                            {chartData.map((dataPoint, index) => (
                                <span 
                                    key={index}
                                    className='text-[11px] font-normal text-[#333333] transform rotate-45'
                                >
                                    {dataPoint.date}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerformanceChart;