import {useSearchParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import { SupportService } from '~/services/support.service';
import { useAppContext } from '~/contexts/AppContext';

interface CallbackRequestProps {
    title: string;
    onClose: () => void;
    onSubmit?: (name: string, phoneNumber: string, email: string, message: string) => void;
}

const CallbackRequest: React.FC<CallbackRequestProps> = ({title, onClose, onSubmit}) => {
    const [name, setName] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [preferredCallTime, setPreferredCallTime] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const router = useRouter();
    const { setModalMessage } = useAppContext();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (onSubmit) {
                // Use custom submit handler if provided
                onSubmit(name, phoneNumber, email, message);
            } else {
                // Use new API service
                const result = await SupportService.requestCallback({
                    name,
                    phoneNumber,
                    email,
                    message,
                    preferredCallTime: preferredCallTime || undefined
                });

                if (result.data && !result.error) {
                    setModalMessage('Your callback request has been submitted successfully! We will contact you soon.');
                    onClose();
                    router.push('?modal=success');
                } else {
                    setModalMessage('Failed to submit callback request. Please try again.');
                    onClose();
                    router.push('?modal=error');
                }
            }
        } catch (error) {
            console.error('Error submitting callback request:', error);
            setModalMessage('Failed to submit callback request. Please try again.');
            onClose();
            router.push('?modal=error');
        } finally {
            setIsSubmitting(false);
        }
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

                <div className='mb-4'>
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

                <div className='mb-4'>
                    <label className='block mb-2 typo-body_sr' htmlFor='email'>
                        Email
                    </label>
                    <input
                        type='email'
                        id='email'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Enter your email address'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className='mb-4'>
                    <label className='block mb-2 typo-body_sr' htmlFor='message'>
                        Message
                    </label>
                    <textarea
                        id='message'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Please describe how we can help you'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                    />
                </div>

                <div className='mb-8'>
                    <label className='block mb-2 typo-body_sr' htmlFor='preferredCallTime'>
                        Preferred Call Time (Optional)
                    </label>
                    <input
                        type='text'
                        id='preferredCallTime'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='e.g. Weekdays 9AM-5PM'
                        value={preferredCallTime}
                        onChange={(e) => setPreferredCallTime(e.target.value)}
                    />
                </div>

                <button
                    type='submit'
                    disabled={isSubmitting}
                    className='w-full bg-primary text-white py-3 rounded typo-heading-md-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Submitting...' : 'Request Callback'}
                </button>
            </form>
        );
};

export default CallbackRequest;
