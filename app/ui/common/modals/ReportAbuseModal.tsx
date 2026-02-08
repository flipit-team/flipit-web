'use client';
import { useState } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import Button from '../button';
import SupportService from '~/services/support.service';
import { AbuseReportRequest } from '~/utils/interface';

interface ReportAbuseModalProps {
    isOpen: boolean;
    onClose: () => void;
    reportType: 'USER' | 'ITEM' | 'OTHER';
    targetId?: number;
    targetName?: string; // For display purposes (user name or item title)
}

const ABUSE_REASONS = {
    USER: [
        'Harassment or bullying',
        'Spam or scam',
        'Fake profile',
        'Inappropriate behavior',
        'Fraudulent activity',
        'Other'
    ],
    ITEM: [
        'Misleading or false information',
        'Prohibited item',
        'Counterfeit product',
        'Inappropriate content',
        'Spam listing',
        'Other'
    ],
    OTHER: [
        'Platform abuse',
        'Technical issue',
        'Policy violation',
        'Other'
    ]
};

const ReportAbuseModal = ({ isOpen, onClose, reportType, targetId, targetName }: ReportAbuseModalProps) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const reasons = ABUSE_REASONS[reportType] || ABUSE_REASONS.OTHER;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedReason) {
            setError('Please select a reason');
            return;
        }

        if (!description.trim()) {
            setError('Please provide a description');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        const reportData: AbuseReportRequest = {
            reportType,
            targetId,
            reason: selectedReason,
            description: description.trim()
        };

        try {
            const result = await SupportService.reportAbuse(reportData);

            if (result.data) {
                setSuccess(true);
                setTimeout(() => {
                    handleClose();
                }, 2000);
            } else if (result.error) {
                setError(result.error.message || 'Failed to submit report. Please try again.');
            }
        } catch (err) {
            setError('An error occurred while submitting your report. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleClose = () => {
        setSelectedReason('');
        setDescription('');
        setError(null);
        setSuccess(false);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
            {/* Backdrop */}
            <div className='absolute inset-0 bg-background-overlay' onClick={handleClose} />

            {/* Modal */}
            <div className='relative bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto'>
                {success ? (
                    /* Success State */
                    <div className='p-6 text-center'>
                        <div className='w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-8 h-8 text-success' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7' />
                            </svg>
                        </div>
                        <h3 className='typo-heading-md-semibold text-text_one mb-2'>Report Submitted</h3>
                        <p className='typo-body-md-regular text-text_four'>
                            Thank you for helping keep our community safe. We&apos;ll review your report shortly.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Header */}
                        <div className='flex items-center justify-between p-6 border-b border-border_gray'>
                            <div className='flex items-center gap-3'>
                                <div className='w-10 h-10 bg-error/10 rounded-full flex items-center justify-center'>
                                    <AlertTriangle className='w-5 h-5 text-error' />
                                </div>
                                <div>
                                    <h2 className='typo-heading-md-semibold text-text_one'>Report Abuse</h2>
                                    {targetName && (
                                        <p className='typo-body-sm-regular text-text_four'>
                                            Reporting: {targetName}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={handleClose}
                                className='text-text_four hover:text-text_one transition-colors'
                            >
                                <X className='w-5 h-5' />
                            </button>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className='p-6 space-y-6'>
                            {/* Reason Selection */}
                            <div>
                                <label className='typo-body-md-semibold text-text_one mb-3 block'>
                                    Reason for reporting *
                                </label>
                                <div className='space-y-2'>
                                    {reasons.map((reason) => (
                                        <label
                                            key={reason}
                                            className='flex items-center gap-3 p-3 border border-border_gray rounded-lg cursor-pointer hover:bg-surface-primary transition-colors'
                                        >
                                            <input
                                                type='radio'
                                                name='reason'
                                                value={reason}
                                                checked={selectedReason === reason}
                                                onChange={(e) => setSelectedReason(e.target.value)}
                                                className='w-4 h-4 text-primary focus:ring-primary'
                                            />
                                            <span className='typo-body-md-regular text-text_one'>
                                                {reason}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Description */}
                            <div>
                                <label htmlFor='description' className='typo-body-md-semibold text-text_one mb-2 block'>
                                    Additional details *
                                </label>
                                <textarea
                                    id='description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder='Please provide any additional information that will help us understand the issue...'
                                    rows={4}
                                    className='w-full px-4 py-3 border border-border_gray rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary typo-body-md-regular resize-none'
                                    maxLength={500}
                                />
                                <p className='typo-body-sm-regular text-text_four mt-1'>
                                    {description.length}/500 characters
                                </p>
                            </div>

                            {/* Error Message */}
                            {error && (
                                <div className='p-3 bg-surface-error border border-error rounded-lg'>
                                    <p className='typo-body-sm-regular text-error'>{error}</p>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className='flex gap-3'>
                                <Button
                                    type='button'
                                    variant='outline'
                                    size='lg'
                                    onClick={handleClose}
                                    className='flex-1'
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type='submit'
                                    variant='danger'
                                    size='lg'
                                    className='flex-1'
                                    disabled={isSubmitting}
                                    loading={isSubmitting}
                                >
                                    {isSubmitting ? 'Submitting...' : 'Submit Report'}
                                </Button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ReportAbuseModal;
