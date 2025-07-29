import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

interface SendMessageProps {
    title: string;
    onClose: () => void;
    onSubmit: (name: string, phoneNumber: string) => void;
}

const SendMessage: React.FC<SendMessageProps> = ({title, onClose, onSubmit}) => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(name, phoneNumber);
    };
    if (query === 'send-message')
        return (
            <form className='w-full max-w-[527px] bg-white p-8 rounded-lg mx-auto' onSubmit={handleSubmit}>
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
                        Your message
                    </label>
                    <textarea
                        id='name'
                        className='w-full h-[137px] border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary resize-none align-top'
                        placeholder='Enter your name'
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

                <button
                    type='submit'
                    className='w-full bg-primary text-white py-3 rounded font-semibold text-lg hover:bg-primary-dark transition'
                >
                    Send to Seller
                </button>
            </form>
        );
};

export default SendMessage;
