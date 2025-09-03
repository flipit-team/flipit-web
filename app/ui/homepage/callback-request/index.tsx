import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

interface CallbackRequestProps {
    title: string;
    onClose: () => void;
    onSubmit: (name: string, phoneNumber: string) => void;
}

const CallbackRequest: React.FC<CallbackRequestProps> = ({title, onClose, onSubmit}) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, phoneNumber);
    };
    if (query === 'callback-request')
        return (
            <form className='w-full max-w-[527px] bg-white p-8 rounded-lg' onSubmit={handleSubmit}>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='typo-heading_sb'>{title}</h2>
                    <button
                        type='button'
                        onClick={onClose}
                        className='text-2xl text-gray-500 hover:text-gray-700'
                        aria-label='Close'
                    >
                        &times;
                    </button>
                </div>

                <div className='mb-4'>
                    <label className='block mb-2 typo-body_sr' htmlFor='name'>
                        Name
                    </label>
                    <input
                        type='text'
                        id='name'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <div className='mb-8'>
                    <label className='block mb-2 typo-body_sr' htmlFor='phoneNumber'>
                        Phone Number
                    </label>
                    <input
                        type='tel'
                        id='phoneNumber'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Enter your phone number'
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />
                </div>

                <button
                    type='submit'
                    className='w-full bg-primary text-white py-3 rounded typo-heading-md-semibold hover:bg-primary-dark transition'
                >
                    Send to Seller
                </button>
            </form>
        );
};

export default CallbackRequest;
