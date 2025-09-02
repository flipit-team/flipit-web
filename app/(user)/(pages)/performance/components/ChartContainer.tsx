'use client';
import { useState } from 'react';
import DateRangeDropdown from './DateRangeDropdown';
import FrequencyDropdown from './FrequencyDropdown';
import PerformanceChart from './PerformanceChart';

const ChartContainer = () => {
    const [selectedDateRange, setSelectedDateRange] = useState('Apr 30, 2025 - Mar 14, 2024');
    const [selectedFrequency, setSelectedFrequency] = useState('Daily');

    return (
        <div className='relative'>
            {/* Dropdown Selectors */}
            <div className='absolute top-[18px] right-[18px] flex items-center gap-[18px] z-10'>
                <DateRangeDropdown 
                    selectedRange={selectedDateRange}
                    onRangeChange={setSelectedDateRange}
                />
                <FrequencyDropdown 
                    selectedFrequency={selectedFrequency}
                    onFrequencyChange={setSelectedFrequency}
                />
            </div>

            {/* Chart */}
            <PerformanceChart />
        </div>
    );
};

export default ChartContainer;