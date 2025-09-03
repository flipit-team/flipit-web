'use client';
import { useState } from 'react';

interface ToggleSwitchProps {
    id: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
}

const ToggleSwitch = ({ id, checked, onChange, disabled = false }: ToggleSwitchProps) => {
    const handleToggle = () => {
        if (!disabled) {
            onChange(!checked);
        }
    };

    return (
        <button
            id={id}
            type="button"
            role="switch"
            aria-checked={checked}
            onClick={handleToggle}
            disabled={disabled}
            className={`
                relative inline-flex h-[14px] w-[24px] shrink-0 cursor-pointer rounded-full border-2 border-transparent 
                transition-colors duration-200 ease-in-out focus:outline-none
                ${checked ? 'bg-success' : 'bg-gray-200'}
                ${disabled ? 'cursor-not-allowed opacity-50' : ''}
            `}
        >
            <span
                className={`
                    pointer-events-none inline-block h-[10px] w-[10px] transform rounded-full bg-white shadow ring-0 
                    transition duration-200 ease-in-out
                    ${checked ? 'translate-x-[10px]' : 'translate-x-0'}
                `}
            />
        </button>
    );
};

export default ToggleSwitch;