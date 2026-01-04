'use client';
import React, {useState, useEffect} from 'react';

interface CountdownTimerProps {
    endTime: Date | string;
    startTime?: Date | string;
    className?: string;
    variant?: 'auction-card' | 'auction-details'; // Different text styles
    onComplete?: () => void; // Callback when auction ends
}

const CountdownTimer = ({endTime, startTime, className = '', variant = 'auction-details', onComplete}: CountdownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [status, setStatus] = useState<'not-started' | 'active' | 'ended'>('active');
    const [hasCalledComplete, setHasCalledComplete] = useState(false);
    const [progressPercentage, setProgressPercentage] = useState(100);

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const startTimestamp = startTime ? new Date(startTime).getTime() : 0;
            const endTimestamp = new Date(endTime).getTime();

            let targetTime: number;
            let currentStatus: 'not-started' | 'active' | 'ended';

            // Determine auction status and target time
            if (startTime && now < startTimestamp) {
                // Auction hasn't started yet
                targetTime = startTimestamp;
                currentStatus = 'not-started';
            } else if (now < endTimestamp) {
                // Auction is active
                targetTime = endTimestamp;
                currentStatus = 'active';
            } else {
                // Auction has ended
                currentStatus = 'ended';
                targetTime = 0;
            }

            setStatus(currentStatus);

            // Call onComplete callback when auction ends (only once)
            if (currentStatus === 'ended' && !hasCalledComplete && onComplete) {
                setHasCalledComplete(true);
                onComplete();
            }

            if (targetTime > 0) {
                const distance = targetTime - now;

                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

                    setTimeLeft({days, hours, minutes, seconds});

                    // Calculate progress percentage
                    const totalDuration = endTimestamp - (startTimestamp || endTimestamp - (7 * 24 * 60 * 60 * 1000)); // Default to 7 days if no start time
                    const elapsed = totalDuration - distance;
                    const percentage = Math.max(0, Math.min(100, ((totalDuration - elapsed) / totalDuration) * 100));
                    setProgressPercentage(percentage);
                } else {
                    setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
                    setProgressPercentage(0);
                }
            } else {
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
                setProgressPercentage(0);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, startTime, onComplete, hasCalledComplete]);

    const formatTime = (value: number) => value.toString().padStart(2, '0');

    const getDisplayText = () => {
        if (status === 'ended') {
            return 'Auction Ended';
        }

        const timeStr = `${timeLeft.days}d ${formatTime(timeLeft.hours)}h ${formatTime(timeLeft.minutes)}m ${formatTime(timeLeft.seconds)}s`;

        if (status === 'not-started') {
            if (variant === 'auction-card') {
                return `Starts in ${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''}`;
            }
            return `Starts in ${timeStr}`;
        } else {
            if (variant === 'auction-card') {
                return `${timeLeft.days} day${timeLeft.days !== 1 ? 's' : ''} left`;
            }
            return `Closes in ${timeStr}`;
        }
    };

    return (
        <div className={`relative rounded-lg overflow-hidden ${className}`}>
            <div
                className='absolute inset-0 bg-surface-warning-18 transition-all duration-1000 ease-linear'
                style={{width: `${progressPercentage}%`}}
            />
            <div className='relative px-4 flex items-center justify-center'>
                <p className='typo-body_lm text-text_one'>
                    {getDisplayText()}
                </p>
            </div>
        </div>
    );
};

export default CountdownTimer;
