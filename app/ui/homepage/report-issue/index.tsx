import {useSearchParams} from 'next/navigation';
import React, {useState} from 'react';

interface ReportModalContentProps {
    title: string;
    onClose: () => void;
    onSubmit: (reason: string, description: string) => void;
}

const reasons = ['Inappropriate content', 'Spam or scam', 'Incorrect information', 'Other'];

const ReportModalContent: React.FC<ReportModalContentProps> = ({title, onClose, onSubmit}) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(reason, description);
    };
    if (query === 'report-issue')
        return (
            <form className='w-full max-w-[600px] bg-white p-8 rounded-lg' onSubmit={handleSubmit}>
                <div className='flex items-center justify-between mb-6'>
                    <h2 className='text-2xl font-semibold'>{title}</h2>
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
                    <label className='block mb-2 font-medium' htmlFor='reason'>
                        Reason
                    </label>
                    <select
                        id='reason'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary'
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        required
                    >
                        <option value=''>Select reason</option>
                        {reasons.map((r) => (
                            <option key={r} value={r}>
                                {r}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='mb-8'>
                    <label className='block mb-2 font-medium' htmlFor='description'>
                        Description
                    </label>
                    <textarea
                        id='description'
                        className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-primary'
                        placeholder='Please describe your issue'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                </div>

                <button
                    type='submit'
                    className='w-full bg-primary text-white py-3 rounded font-semibold text-lg hover:bg-primary-dark transition'
                >
                    Submit report
                </button>
            </form>
        );
};

export default ReportModalContent;
