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
        const configs = {
            OFFER_ACCEPTED: {icon: '✓', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Offer Accepted'},
            PAYMENT_PENDING: {
                icon: '⏳',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                label: 'Payment Pending'
            },
            PAYMENT_RECEIVED: {
                icon: '💰',
                color: 'text-green-600',
                bgColor: 'bg-green-100',
                label: 'Payment Received'
            },
            SHIPPING_PENDING: {
                icon: '📦',
                color: 'text-yellow-600',
                bgColor: 'bg-yellow-100',
                label: 'Shipping Pending'
            },
            SELLER_SHIPPED: {icon: '🚚', color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Seller Shipped'},
            BUYER_SHIPPED: {icon: '🚚', color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'Buyer Shipped'},
            IN_TRANSIT: {icon: '🚛', color: 'text-blue-600', bgColor: 'bg-blue-100', label: 'In Transit'},
            DELIVERED: {icon: '✓', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Delivered'},
            REVIEW_PENDING: {icon: '⭐', color: 'text-yellow-600', bgColor: 'bg-yellow-100', label: 'Review Pending'},
            COMPLETED: {icon: '✅', color: 'text-green-600', bgColor: 'bg-green-100', label: 'Completed'},
            CANCELLED: {icon: '❌', color: 'text-red-600', bgColor: 'bg-red-100', label: 'Cancelled'},
            DISPUTED: {icon: '⚠️', color: 'text-red-600', bgColor: 'bg-red-100', label: 'Disputed'}
        };

        return configs[status] || {icon: '•', color: 'text-gray-600', bgColor: 'bg-gray-100', label: status};
    };

    const getExpectedStatuses = (): TransactionStatus[] => {
        const baseStatuses: TransactionStatus[] = ['OFFER_ACCEPTED'];

        // Add payment statuses if cash is involved
        if ((transaction.cashAmount ?? 0) > 0) {
            baseStatuses.push('PAYMENT_PENDING', 'PAYMENT_RECEIVED');
        }

        // Add shipping statuses
        if (transaction.transactionType === 'ITEM_EXCHANGE') {
            baseStatuses.push('SHIPPING_PENDING', 'SELLER_SHIPPED', 'BUYER_SHIPPED', 'IN_TRANSIT');
        } else {
            baseStatuses.push('SHIPPING_PENDING', 'SELLER_SHIPPED', 'IN_TRANSIT');
        }

        // Add completion statuses
        baseStatuses.push('DELIVERED', 'REVIEW_PENDING', 'COMPLETED');

        return baseStatuses;
    };

    const expectedStatuses = getExpectedStatuses();
    const currentStatusIndex = expectedStatuses.indexOf(transaction.status);

    const getStepState = (index: number): 'completed' | 'current' | 'pending' | 'cancelled' => {
        if (['CANCELLED', 'DISPUTED'].includes(transaction.status)) {
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
                    const event = transaction.timeline?.find((e) => e.status === status);

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
                                              ? 'bg-red-300'
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
                                              ? 'bg-red-100 text-red-600'
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
                                                  ? 'text-red-600'
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

            {/* Transaction Notes */}
            {transaction.notes && (
                <div className='mt-6 pt-6 border-t border-border_gray'>
                    <h3 className='typo-body_lm text-text_one mb-2'>Notes</h3>
                    <p className='typo-body_mr text-text_four'>{transaction.notes}</p>
                </div>
            )}

            {/* Cancellation/Dispute Reason */}
            {(transaction.cancellationReason || transaction.disputeReason) && (
                <div className='mt-6 pt-6 border-t border-border_gray'>
                    <div className='bg-red-50 border border-red-200 rounded-lg p-4'>
                        <h3 className='typo-body_lm text-red-800 mb-2'>
                            {transaction.cancellationReason ? 'Cancellation Reason' : 'Dispute Reason'}
                        </h3>
                        <p className='typo-body_mr text-red-700'>
                            {transaction.cancellationReason || transaction.disputeReason}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionStatusTimeline;
