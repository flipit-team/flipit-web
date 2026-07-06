'use client';
import React from 'react';
import {TransactionDTO, TransactionStatus} from '~/types/transaction';
import {formatMessageTime} from '~/utils/helpers';

interface Props {
    transaction: TransactionDTO;
}

const TransactionStatusTimeline = ({transaction}: Props) => {
    const getStatusConfig = (
        status: TransactionStatus
    ): {icon: string; color: string; bgColor: string; label: string} => {
        const configs: Record<string, {icon: string; color: string; bgColor: string; label: string}> = {
            PENDING: {icon: '⏳', color: 'text-warning', bgColor: 'bg-surface-secondary', label: 'Pending'},
            SUCCESS: {icon: '💰', color: 'text-primary', bgColor: 'bg-surface-primary', label: 'Success'},
            FAILED: {icon: '❌', color: 'text-error', bgColor: 'bg-surface-error', label: 'Failed'},
            CANCELLED: {icon: '❌', color: 'text-error', bgColor: 'bg-surface-error', label: 'Cancelled'},
            DELIVERED: {icon: '✓', color: 'text-primary', bgColor: 'bg-surface-primary', label: 'Delivered'},
            VERIFIED: {icon: '⭐', color: 'text-warning', bgColor: 'bg-surface-secondary', label: 'Verified'},
            COMPLETED: {icon: '✅', color: 'text-primary', bgColor: 'bg-surface-primary', label: 'Completed'},
            RELEASED: {icon: '✓', color: 'text-primary', bgColor: 'bg-surface-primary', label: 'Released'}
        };

        return configs[status] || {icon: '•', color: 'text-gray-600', bgColor: 'bg-gray-100', label: status};
    };

    const getExpectedStatuses = (): TransactionStatus[] => {
        const baseStatuses: TransactionStatus[] = ['PENDING'];

        // Add payment status if cash is involved
        if ((transaction.amount ?? 0) > 0) {
            baseStatuses.push('SUCCESS');
        }

        // Add delivery and completion statuses
        baseStatuses.push('DELIVERED', 'VERIFIED', 'COMPLETED', 'RELEASED');

        return baseStatuses;
    };

    const expectedStatuses = getExpectedStatuses();
    const currentStatusIndex = expectedStatuses.indexOf(transaction.status);

    const getStepState = (index: number): 'completed' | 'current' | 'pending' | 'cancelled' => {
        if (['CANCELLED', 'FAILED'].includes(transaction.status)) {
            return index <= currentStatusIndex ? 'cancelled' : 'pending';
        }
        if (index < currentStatusIndex) return 'completed';
        if (index === currentStatusIndex) return 'current';
        return 'pending';
    };

    return (
        <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
            <h2 className='typo-heading_ss text-text_one mb-6'>Transaction Timeline</h2>

            {/* Timeline */}
            <div className='space-y-6'>
                {expectedStatuses.map((status, index) => {
                    const config = getStatusConfig(status);
                    const state = getStepState(index);
                    // Timeline removed from TransactionDTO
                    const event = null as any;

                    const isCompleted = state === 'completed';
                    const isCurrent = state === 'current';
                    const isCancelled = state === 'cancelled';

                    return (
                        <div key={status} className='relative flex gap-4'>
                            {/* Timeline line */}
                            {index < expectedStatuses.length - 1 && (
                                <div
                                    className={`absolute left-[18px] top-[40px] w-[2px] h-[calc(100%+8px)] ${
                                        isCompleted || isCurrent
                                            ? 'bg-primary'
                                            : isCancelled
                                              ? 'bg-error/30'
                                              : 'bg-gray-200'
                                    }`}
                                />
                            )}

                            {/* Status Icon */}
                            <div className='relative z-10'>
                                <div
                                    className={`w-[36px] h-[36px] rounded-full flex items-center justify-center text-lg ${
                                        isCompleted || isCurrent
                                            ? 'bg-primary text-white'
                                            : isCancelled
                                              ? 'bg-surface-error text-error'
                                              : 'bg-gray-100 text-gray-400'
                                    }`}
                                >
                                    {isCompleted ? '✓' : isCurrent ? config.icon : '•'}
                                </div>
                            </div>

                            {/* Status Content */}
                            <div className='flex-1 pb-2'>
                                <div className='flex items-start justify-between mb-1'>
                                    <h3
                                        className={`typo-body_lm ${
                                            isCompleted || isCurrent
                                                ? 'text-text_one'
                                                : isCancelled
                                                  ? 'text-error'
                                                  : 'text-text_four'
                                        }`}
                                    >
                                        {config.label}
                                    </h3>
                                    {event && (
                                        <span className='typo-body_sr text-text_four'>
                                            {formatMessageTime(event.dateCreated)}
                                        </span>
                                    )}
                                </div>

                                {event && event.description && (
                                    <p className='typo-body_mr text-text_four mb-2'>{event.description}</p>
                                )}

                                {isCurrent && !event && (
                                    <div className='flex items-center gap-2 mt-2'>
                                        <div className='w-2 h-2 bg-primary rounded-full animate-pulse'></div>
                                        <span className='typo-body_sr text-primary'>In Progress</span>
                                    </div>
                                )}

                                {event && event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <div className='mt-2 p-3 bg-gray-50 rounded-lg'>
                                        {event.metadata.waybillNumber && (
                                            <div className='flex items-center justify-between mb-1'>
                                                <span className='typo-body_sr text-text_four'>Waybill:</span>
                                                <span className='typo-body_sr text-text_one font-mono'>
                                                    {event.metadata.waybillNumber}
                                                </span>
                                            </div>
                                        )}
                                        {event.metadata.amount && (
                                            <div className='flex items-center justify-between mb-1'>
                                                <span className='typo-body_sr text-text_four'>Amount:</span>
                                                <span className='typo-body_sr text-text_one'>
                                                    ₦{event.metadata.amount.toLocaleString()}
                                                </span>
                                            </div>
                                        )}
                                        {event.metadata.notes && (
                                            <p className='typo-body_sr text-text_four mt-2'>{event.metadata.notes}</p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Transaction Description */}
            {transaction.description && (
                <div className='mt-6 pt-6 border-t border-border_gray'>
                    <h3 className='typo-body_lm text-text_one mb-2'>Notes</h3>
                    <p className='typo-body_mr text-text_four'>{transaction.description}</p>
                </div>
            )}
        </div>
    );
};

export default TransactionStatusTimeline;
