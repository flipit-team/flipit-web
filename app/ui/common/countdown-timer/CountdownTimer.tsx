'use client';
import React, {useState, useEffect} from 'react';

interface CountdownTimerProps {
    endTime: Date | string;
    className?: string;
}

const CountdownTimer = ({endTime, className = ''}: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(endTime).getTime() - now;

            if (distance > 0) {
                const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                setTimeLeft({days, hours, minutes, seconds});
            } else {
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    return (
        <div
            className={`bg-[#E47208] bg-opacity-18 px-1 flex items-center justify-center rounded-lg ${className}`}
            style={{backgroundColor: 'rgba(228, 114, 8, 0.18)'}}
        >
            <p className='typo-body_lm text-text_one'>
                Closes in {timeLeft.days}d {formatTime(timeLeft.hours)}h {formatTime(timeLeft.minutes)}m{' '}
                {formatTime(timeLeft.seconds)}s
            </p>
        </div>
    );
};

export default CountdownTimer;
