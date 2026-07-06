import React from 'react';

interface TransactionTypeBadgeProps {
    acceptCash: boolean;
    hasSwapItems: boolean;
    className?: string;
}

const TransactionTypeBadge: React.FC<TransactionTypeBadgeProps> = ({
    acceptCash,
    hasSwapItems,
    className = ''
}) => {
    // Determine transaction type and styling
    const getTransactionStyle = () => {
        if (acceptCash && hasSwapItems) {
            // Cash + Swap - using accent.coral color variable
            return {
                className: 'bg-surface-coral text-accent-coral',
                label: 'Cash + Swap'
            };
        } else if (!acceptCash && hasSwapItems) {
            // Swap only
            return {
                className: 'bg-surface-yellow text-warning-dark',
                label: 'Swap Only'
            };
        } else {
            // Cash only (default)
            return {
                className: 'bg-surface-success text-success-dark',
                label: 'Cash Only'
            };
        }
    };

    const style = getTransactionStyle();

    return (
        <div
            className={`px-4 py-2 xs:px-2 xs:py-1 rounded-3xl typo-body-sm-regular xs:text-[10px] ${style.className} ${className}`}
        >
            {style.label}
        </div>
    );
};

export default TransactionTypeBadge;
