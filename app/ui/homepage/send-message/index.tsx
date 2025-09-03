import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

interface SendMessageProps {
    title: string;
    onClose: () => void;
    onSubmit: (message: string) => void;
    loading?: boolean;
    error?: string;
}

const SendMessage = ({title, onClose, onSubmit, loading = false, error = ''}: SendMessageProps) => {
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [message, setMessage] = useState('');
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(message);
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
                    <label className='block mb-2 typo-body_sr' htmlFor='message'>
                        Your message
                    </label>
                    <textarea
                        id='message'
                        className='w-full h-[137px] border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary resize-none align-top'
                        placeholder='Type your message to the seller...'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className='mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm'>
                        {error}
                    </div>
                )}

                <button
                    type='submit'
                    disabled={loading || !message.trim()}
                    className='w-full bg-primary text-white py-3 rounded typo-heading-md-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {loading ? 'Sending...' : 'Send to Seller'}
                </button>
            </form>
        );
};

export default SendMessage;
