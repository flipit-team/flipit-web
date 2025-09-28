import React from 'react';
import Loading from '../loading/Loading';

export interface ButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    variant?: 'primary' | 'secondary' | 'outline' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    disabled?: boolean;
    loading?: boolean;
    className?: string;
    type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    variant = 'outline',
    size = 'sm',
    disabled = false,
    loading = false,
    className = '',
    type = 'button',
    ...props
}) => {
    const getVariantClasses = () => {
        switch (variant) {
            case 'primary':
                return 'bg-primary text-white border-primary hover:bg-primary/90';
            case 'secondary':
                return 'bg-secondary text-white border-secondary hover:bg-secondary/90';
            case 'danger':
                return 'border-border-muted text-border-muted hover:bg-red-50 hover:text-red-600 hover:border-red-300';
            case 'outline':
            default:
                return 'border-border-muted text-border-muted hover:bg-gray-50';
        }
    };

    const getSizeClasses = () => {
        switch (size) {
            case 'lg':
                return 'h-[40px] px-[48px] py-[20px] typo-button-lg';
            case 'md':
                return 'h-[36px] px-[44px] py-[18px] typo-button-md';
            case 'sm':
            default:
                return 'h-[31px] px-[40px] py-[16px] typo-button-sm';
        }
    };

    const baseClasses = 'flex items-center justify-center border rounded-[8px] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <button
            type={type}
            onClick={loading ? undefined : onClick}
            disabled={disabled || loading}
            className={`${baseClasses} ${getVariantClasses()} ${getSizeClasses()} ${className}`}
            {...props}
        >
            {loading ? (
                <Loading
                    size="xs"
                    variant="spinner"
                    center={false}
                    className={variant === 'primary' || variant === 'secondary' ? 'text-white' : 'text-gray-600'}
                />
            ) : (
                children
            )}
        </button>
    );
};

export default Button;