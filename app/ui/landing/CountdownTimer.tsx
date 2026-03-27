'use client';

import {useState, useEffect} from 'react';

interface CountdownTimerProps {
    targetDate: Date;
}

interface TimeLeft {
    days: number;
    hours: number;
    mins: number;
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
    const difference = targetDate.getTime() - new Date().getTime();
    if (difference <= 0) return {days: 0, hours: 0, mins: 0};

    return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        mins: Math.floor((difference / (1000 * 60)) % 60)
    };
}

export default function CountdownTimer({targetDate}: CountdownTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

    useEffect(() => {
        setTimeLeft(calculateTimeLeft(targetDate));
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft(targetDate));
        }, 1000);

        return () => clearInterval(timer);
    }, [targetDate]);

    if (!timeLeft) {
        return (
            <div className='flex items-center gap-3'>
                {['DAYS', 'HOURS', 'MINS'].map((label) => (
                    <div key={label} className='flex flex-col items-center gap-1'>
                        <div className='w-[52px] h-[52px] rounded-lg bg-[#025F7333] border border-[#025F73] flex items-center justify-center'>
                            <span className='font-poppins text-xl font-bold text-[#025F73]'>--</span>
                        </div>
                        <span className='font-poppins text-xl font-bold text-[#A49E9E]'>{label}</span>
                    </div>
                ))}
            </div>
        );
    }

    const blocks = [
        {value: timeLeft.days, label: 'DAYS'},
        {value: timeLeft.hours, label: 'HOURS'},
        {value: timeLeft.mins, label: 'MINS'}
    ];

    return (
        <div className='flex items-center gap-3'>
            {blocks.map((block) => (
                <div key={block.label} className='flex flex-col items-center gap-1'>
                    <div className='w-[52px] h-[52px] rounded-lg bg-[#025F7333] border border-[#025F73] flex items-center justify-center'>
                        <span className='font-poppins text-xl font-bold text-[#025F73]'>
                            {String(block.value).padStart(2, '0')}
                        </span>
                    </div>
                    <span className='font-poppins text-xl font-bold text-[#A49E9E]'>{block.label}</span>
                </div>
            ))}
        </div>
    );
}
