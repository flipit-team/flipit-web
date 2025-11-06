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
                } else {
                    setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
                }
            } else {
                setTimeLeft({days: 0, hours: 0, minutes: 0, seconds: 0});
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
        <div
            className={`bg-surface-warning-18 px-4 flex items-center justify-center rounded-lg ${className}`}
        >
            <p className='typo-body_lm text-text_one'>
                {getDisplayText()}
            </p>
        </div>
    );
};

export default CountdownTimer;
