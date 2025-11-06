'use client';
import React from 'react';

type Variant = 'info' | 'success' | 'warning' | 'error' | 'neutral';

interface Props {
    title: string;
    message: string;
    variant?: Variant;
    icon?: React.ReactNode;
    action?: {
        label: string;
        onClick: () => void;
    };
}

const InfoCard: React.FC<Props> = ({title, message, variant = 'info', icon, action}) => {
    const variantStyles = {
        info: {
            container: 'bg-blue-50 border-blue-200',
            icon: 'text-blue-600',
            title: 'text-blue-800',
            message: 'text-blue-700',
            button: 'bg-blue-600 hover:bg-blue-700 text-white'
        },
        success: {
            container: 'bg-green-50 border-green-200',
            icon: 'text-green-600',
            title: 'text-green-800',
            message: 'text-green-700',
            button: 'bg-green-600 hover:bg-green-700 text-white'
        },
        warning: {
            container: 'bg-yellow-50 border-yellow-200',
            icon: 'text-yellow-600',
            title: 'text-yellow-800',
            message: 'text-yellow-700',
            button: 'bg-yellow-600 hover:bg-yellow-700 text-white'
        },
        error: {
            container: 'bg-red-50 border-red-200',
            icon: 'text-red-600',
            title: 'text-red-800',
            message: 'text-red-700',
            button: 'bg-red-600 hover:bg-red-700 text-white'
        },
        neutral: {
            container: 'bg-gray-50 border-gray-200',
            icon: 'text-gray-600',
            title: 'text-gray-800',
            message: 'text-gray-700',
            button: 'bg-gray-600 hover:bg-gray-700 text-white'
        }
    };

    const styles = variantStyles[variant];

    const defaultIcon = (
        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
            <path
                fillRule='evenodd'
                d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                clipRule='evenodd'
            />
        </svg>
    );

    return (
        <div className={`border rounded-lg p-4 ${styles.container}`}>
            <div className='flex items-start gap-3'>
                <div className={`flex-shrink-0 ${styles.icon} mt-0.5`}>{icon || defaultIcon}</div>
                <div className='flex-1'>
                    <h4 className={`typo-body_lr mb-1 ${styles.title}`}>{title}</h4>
                    <p className={`typo-body_mr ${styles.message}`}>{message}</p>
                    {action && (
                        <button
                            onClick={action.onClick}
                            className={`mt-3 px-4 py-2 rounded-lg typo-body_sr font-medium transition-colors ${styles.button}`}
                        >
                            {action.label}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InfoCard;
