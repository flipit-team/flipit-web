import React, {useState} from 'react';
import {Eye, EyeOff} from 'lucide-react';

interface Props {
    label: string;
    placeholder: string;
    type: React.HTMLInputTypeAttribute | undefined;
    name: string;
}

const InputBox = (props: Props) => {
    const {label, placeholder, type, name} = props;

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phone, setPhone] = useState('');

    const isPassword = name === 'password';

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, ''); // Remove non-digit characters
        setPhone(value);
    };
    if (isPassword) {
        return (
            <div>
                <label htmlFor={name} className='block mb-2'>
                    {label}
                </label>
                <div className='relative'>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        id={name}
                        name={name}
                        placeholder={placeholder}
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
        <div>
            <label htmlFor={name} className='block mb-2'>
                {label}
            </label>
            <input
                type={type}
                id={name}
                name={name}
                placeholder={placeholder}
                className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
            />
        </div>
    );
};

export default InputBox;
