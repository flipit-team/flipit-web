import {useSearchParams, useRouter} from 'next/navigation';
import React, {useState} from 'react';
import Image from 'next/image';
import { SupportService } from '~/services/support.service';
import { AbuseReportRequest } from '~/utils/interface';
import { useAppContext } from '~/contexts/AppContext';

interface ReportModalContentProps {
    title: string;
    onClose: () => void;
    onSubmit?: (reason: string, description: string) => void;
    targetId?: number;
    reportType?: 'USER' | 'ITEM' | 'OTHER';
}

const reasons = ['Inappropriate content', 'Spam or scam', 'Incorrect information', 'Other'];

const ReportModalContent: React.FC<ReportModalContentProps> = ({
    title,
    onClose,
    onSubmit,
    targetId,
    reportType = 'OTHER'
}) => {
    const [reason, setReason] = useState('');
    const [description, setDescription] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
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
                onSubmit(reason, description);
            } else {
                // Use new API service
                const reportData: AbuseReportRequest = {
                    reportType,
                    reason,
                    description,
                    ...(targetId && { targetId })
                };

                const result = await SupportService.reportAbuse(reportData);

                if (result.data && !result.error) {
                    setModalMessage('Your report has been submitted successfully! We will review it and take appropriate action.');
                    onClose();
                    router.push('?modal=success');
                } else {
                    setModalMessage('Failed to submit report. Please try again.');
                    onClose();
                    router.push('?modal=error');
                }
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            setModalMessage('Failed to submit report. Please try again.');
            onClose();
            router.push('?modal=error');
        } finally {
            setIsSubmitting(false);
        }
    };
    if (query === 'report-issue')
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
                    <label className='block mb-2 typo-body_sr' htmlFor='reason'>
                        Reason
                    </label>
                    <div className='relative'>
                        <button
                            type='button'
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className='w-full border border-gray-300 rounded px-4 py-3 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary flex items-center justify-between text-left'
                        >
                            <span className={reason ? 'text-black' : 'text-gray-500'}>
                                {reason || 'Select reason'}
                            </span>
                            <Image 
                                src='/arrow-down-gray.svg' 
                                height={16} 
                                width={16} 
                                alt='dropdown' 
                                className={`h-4 w-4 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                            />
                        </button>
                        {isDropdownOpen && (
                            <div className='absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-50 max-h-48 overflow-auto'>
                                {reasons.map((r) => (
                                    <button
                                        key={r}
                                        type='button'
                                        onClick={() => {
                                            setReason(r);
                                            setIsDropdownOpen(false);
                                        }}
                                        className='w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 first:rounded-t last:rounded-b'
                                    >
                                        {r}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className='mb-8'>
                    <label className='block mb-2 typo-body_sr' htmlFor='description'>
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
                    disabled={isSubmitting}
                    className='w-full bg-primary text-white py-3 rounded typo-heading-md-semibold hover:bg-primary-dark transition disabled:opacity-50 disabled:cursor-not-allowed'
                >
                    {isSubmitting ? 'Submitting...' : 'Submit report'}
                </button>
            </form>
        );
};

export default ReportModalContent;
