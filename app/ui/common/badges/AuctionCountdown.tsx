'use client';
import React, {useState, useEffect} from 'react';

interface AuctionCountdownProps {
    endTime: Date | string;
    startTime?: Date | string;
    className?: string;
}

const AuctionCountdown = ({endTime, startTime, className = ''}: AuctionCountdownProps) => {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        totalHours: 0
    });
    const [status, setStatus] = useState<'not-started' | 'active' | 'ended'>('active');

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

            if (targetTime > 0) {
                const distance = targetTime - now;
                
                if (distance > 0) {
                    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                    const totalHours = Math.floor(distance / (1000 * 60 * 60));

                    setTimeLeft({days, hours, minutes, totalHours});
                } else {
                    setTimeLeft({days: 0, hours: 0, minutes: 0, totalHours: 0});
                }
            } else {
                setTimeLeft({days: 0, hours: 0, minutes: 0, totalHours: 0});
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, startTime]);

    // Determine styling based on status and urgency
    const getStyleClass = () => {
        if (status === 'not-started') {
            return 'bg-blue-100 text-blue-600'; // Blue for not-started
        } else if (status === 'ended') {
            return 'bg-gray-100 text-gray-600'; // Gray for ended
        } else {
            // For active auctions, show red when urgent (less than 24 hours)
            const isUrgent = timeLeft.totalHours <= 24;
            return isUrgent 
                ? 'bg-red-100 text-red-600'
                : 'bg-surface-light text-primary';
        }
    };
    
    // Format display text
    const getDisplayText = () => {
        if (status === 'ended') {
            return 'Ended';
        }

        if (status === 'not-started') {
            // Concise text for not-started auctions
            if (timeLeft.days > 0) {
                return `Starts ${timeLeft.days}d`;
            } else if (timeLeft.hours > 0) {
                return `Starts ${timeLeft.hours}h`;
            } else if (timeLeft.minutes > 0) {
                return `Starts ${timeLeft.minutes}m`;
            } else {
                return 'Starting soon';
            }
        }

        // For active auctions
        if (timeLeft.days > 0) {
            return `${timeLeft.days} day${timeLeft.days > 1 ? 's' : ''} left`;
        } else if (timeLeft.hours > 0) {
            return `${timeLeft.hours} hour${timeLeft.hours > 1 ? 's' : ''} left`;
        } else if (timeLeft.minutes > 0) {
            return `${timeLeft.minutes} min left`;
        } else {
            return 'Ending soon';
        }
    };

    return (
        <span
            className={`flex items-center px-2 h-[26px] w-max xs:h-[18px] typo-body_sr capitalize ${getStyleClass()} ${className}`}
        >
            {getDisplayText()}
        </span>
    );
};

export default AuctionCountdown;