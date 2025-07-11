'use client';
import React, {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';

interface Props {
    label: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute | undefined;
    name: string;
    value?: string;
    disabled?: boolean;
    setValue?: (e: React.ChangeEvent<HTMLInputElement>, type: string) => void;
}

const InputBox = (props: Props) => {
    const {label, placeholder, type, name, value, disabled, setValue} = props;

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phone, setPhone] = useState('');

    const isPassword = name === 'password' || name === 'confirm-password';
    const isFullname = name === 'fullname';

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        setPhone(value);
    };
    if (isFullname) {
        return (
            <div className='w-full flex items-center gap-2'>
                <div className='w-full'>
                    <label htmlFor={name} className='block mb-2 typo-body_mr'>
                        First name
                    </label>
                    <input
                        value={value}
                        onChange={setValue ? (e) => setValue(e, 'firstname') : () => {}}
                        type={type}
                        id={name}
                        name={name}
                        placeholder={'enter firstname'}
                        disabled={disabled}
                        className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
                    />
                </div>
                <div className='w-full'>
                    <label htmlFor={name} className='block mb-2 typo-body_mr'>
                        Last name
                    </label>

                    <input
                        value={value}
                        onChange={setValue ? (e) => setValue(e, 'lastname') : () => {}}
                        type={type}
                        id={name}
                        name={name}
                        placeholder={'enter lastname'}
                        disabled={disabled}
                        className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
                    />
                </div>
            </div>
        );
    }
    if (isPassword) {
        return (
            <div className='w-full'>
                <label htmlFor={name} className='block mb-2 typo-body_mr'>
                    {label}
                </label>
                <div className='relative'>
                    <input
                        value={value}
                        onChange={setValue ? (e) => setValue(e, name) : () => {}}
                        type={passwordVisible ? 'text' : 'password'}
                        id={name}
                        name={name}
                        placeholder={placeholder}
                        disabled={disabled}
                        className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
                    />
                    <button
                        type='button'
                        onClick={togglePasswordVisibility}
                        className='absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500'
                    >
                        {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>
        );
    }
    return (
        <div className='w-full'>
            <label htmlFor={name} className='block mb-2 typo-body_mr'>
                {label}
            </label>
            <input
                value={value}
                onChange={setValue ? (e) => setValue(e, name) : () => {}}
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                disabled={disabled}
                className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
            />
        </div>
    );
};

export default InputBox;
