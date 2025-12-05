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
            container: 'bg-accent-navy/5 border-accent-navy/20',
            icon: 'text-accent-navy',
            title: 'text-accent-navy',
            message: 'text-text_one',
            button: 'bg-accent-navy hover:bg-accent-navy/90 text-white transition-all'
        },
        success: {
            container: 'bg-surface-primary border-primary/20',
            icon: 'text-primary',
            title: 'text-primary',
            message: 'text-text_one',
            button: 'bg-primary hover:bg-primary/90 text-white transition-all'
        },
        warning: {
            container: 'bg-surface-secondary border-warning/20',
            icon: 'text-warning',
            title: 'text-warning',
            message: 'text-text_one',
            button: 'bg-secondary hover:bg-secondary/90 text-white transition-all'
        },
        error: {
            container: 'bg-surface-error border-error/20',
            icon: 'text-error',
            title: 'text-error',
            message: 'text-text_one',
            button: 'bg-error hover:bg-error/90 text-white transition-all'
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
