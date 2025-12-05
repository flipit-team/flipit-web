'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {TransactionDTO, TransactionStatus} from '~/types/transaction';
import {useAppContext} from '~/contexts/AppContext';
import {formatToNaira, formatMessageTime} from '~/utils/helpers';
import ProgressTracker from '../transaction/ProgressTracker';
import DualItemDisplay from '../transaction/DualItemDisplay';
import InfoCard from '../transaction/InfoCard';
import PaymentSection from '../transaction/PaymentSection';
import ShippingSection from '../transaction/ShippingSection';
import ReviewModal from '../transaction/ReviewModal';
import TransactionService from '~/services/transaction.service';

interface Props {
    transaction: TransactionDTO;
}

const TransactionHubV2 = ({transaction: initialTransaction}: Props) => {
    const {user} = useAppContext();
    const [transaction, setTransaction] = useState<TransactionDTO>(initialTransaction);
    const [activeSection, setActiveSection] = useState<'overview' | 'payment' | 'shipping'>('overview');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userRole = TransactionService.getUserRole(transaction, user?.userId ? parseInt(user.userId) : 0);
    const isSeller = userRole === 'seller';
    const isBuyer = userRole === 'buyer';

    // Get flow-specific configuration
    const getFlowConfig = () => {
        const {transactionType, status} = transaction;

        // Common statuses
        const commonStatuses: TransactionStatus[] = ['OFFER_ACCEPTED'];

        if (transactionType === 'CASH_ONLY') {
            return {
                title: 'Direct Purchase',
                steps: [
                    {label: 'Offer Accepted', sublabel: 'Transaction created'},
                    {label: 'Payment', sublabel: 'Buyer pays'},
                    {label: 'Shipping', sublabel: 'Seller ships'},
                    {label: 'Delivery', sublabel: 'Item delivered'},
                    {label: 'Complete', sublabel: 'Transaction complete'}
                ],
                statusMap: {
                    OFFER_ACCEPTED: 0,
                    PAYMENT_PENDING: 1,
                    PAYMENT_RECEIVED: 1,
                    SHIPPING_PENDING: 2,
                    SELLER_SHIPPED: 2,
                    IN_TRANSIT: 2,
                    DELIVERED: 3,
                    REVIEW_PENDING: 4,
                    COMPLETED: 4
                }
            };
        }

        if (transactionType === 'AUCTION_WIN') {
            return {
                title: 'Auction Win',
                steps: [
                    {label: 'Auction Won', sublabel: 'You won!'},
                    {label: 'Payment Deadline', sublabel: '4 days to pay'},
                    {label: 'Shipping', sublabel: 'Seller ships'},
                    {label: 'Delivery', sublabel: 'Item delivered'},
                    {label: 'Complete', sublabel: 'Leave review'}
                ],
                statusMap: {
                    OFFER_ACCEPTED: 0,
                    PAYMENT_PENDING: 1,
                    PAYMENT_RECEIVED: 1,
                    SHIPPING_PENDING: 2,
                    SELLER_SHIPPED: 2,
                    IN_TRANSIT: 2,
                    DELIVERED: 3,
                    REVIEW_PENDING: 4,
                    COMPLETED: 4
                }
            };
        }

        // ITEM_EXCHANGE or ITEM_PLUS_CASH
        return {
            title: transactionType === 'ITEM_PLUS_CASH' ? 'Item + Cash Exchange' : 'Item Exchange',
            steps: [
                {label: 'Offer Accepted', sublabel: 'Exchange agreed'},
                ...(transaction.cashAmount ? [{label: 'Payment', sublabel: 'Cash portion'}] : []),
                {label: 'Both Ship', sublabel: 'Coordinate shipping'},
                {label: 'In Transit', sublabel: 'Track shipments'},
                {label: 'Both Inspect', sublabel: '3-day window'},
                {label: 'Complete', sublabel: 'Exchange done'}
            ],
            statusMap: {
                OFFER_ACCEPTED: 0,
                PAYMENT_PENDING: transaction.cashAmount ? 1 : 0,
                PAYMENT_RECEIVED: transaction.cashAmount ? 1 : 0,
                SHIPPING_PENDING: transaction.cashAmount ? 2 : 1,
                SELLER_SHIPPED: transaction.cashAmount ? 2 : 1,
                BUYER_SHIPPED: transaction.cashAmount ? 2 : 1,
                IN_TRANSIT: transaction.cashAmount ? 3 : 2,
                DELIVERED: transaction.cashAmount ? 4 : 3,
                REVIEW_PENDING: transaction.cashAmount ? 5 : 4,
                COMPLETED: transaction.cashAmount ? 5 : 4
            }
        };
    };

    const flowConfig = getFlowConfig();
    const currentStepIndex = (flowConfig.statusMap as Record<TransactionStatus, number>)[transaction.status] ?? 0;

    // Determine transaction status for progress tracker
    const getProgressStatus = (): 'active' | 'completed' | 'cancelled' => {
        if (transaction.status === 'COMPLETED') return 'completed';
        if (['CANCELLED', 'DISPUTED'].includes(transaction.status)) return 'cancelled';
        return 'active';
    };

    // Get next action message
    const getNextActionInfo = () => {
        const {status, transactionType} = transaction;

        if (transactionType === 'AUCTION_WIN') {
            if (isBuyer) {
                if (['OFFER_ACCEPTED', 'PAYMENT_PENDING'].includes(status)) {
                    return {
                        title: 'Payment Required',
                        message:
                            'You have 4 days from auction end to complete payment. Non-payment may result in account restrictions.',
                        variant: 'warning' as const,
                        action: {label: 'Pay Now', onClick: () => setActiveSection('payment')}
                    };
                }
                if (status === 'DELIVERED') {
                    return {
                        title: 'Confirm Delivery',
                        message: 'Have you received the item? Confirm to release payment to seller.',
                        variant: 'success' as const,
                        action: {label: 'Confirm Delivery', onClick: handleConfirmDelivery}
                    };
                }
            }

            if (isSeller) {
                if (['PAYMENT_RECEIVED', 'SHIPPING_PENDING'].includes(status)) {
                    return {
                        title: 'Ship Item',
                        message: 'Payment received! Ship the item within your handling time.',
                        variant: 'success' as const,
                        action: {label: 'Arrange Shipping', onClick: () => setActiveSection('shipping')}
                    };
                }
                if (status === 'PAYMENT_PENDING') {
                    return {
                        title: 'Waiting for Payment',
                        message: 'Buyer has 4 days to complete payment. You will be notified once payment is received.',
                        variant: 'info' as const
                    };
                }
            }
        }

        if (transactionType === 'ITEM_EXCHANGE' || transactionType === 'ITEM_PLUS_CASH') {
            if (transactionType === 'ITEM_PLUS_CASH' && ['PAYMENT_PENDING', 'OFFER_ACCEPTED'].includes(status)) {
                if (isBuyer) {
                    return {
                        title: 'Complete Cash Payment',
                        message: 'Pay the cash portion before both parties can ship items.',
                        variant: 'warning' as const,
                        action: {label: 'Pay Now', onClick: () => setActiveSection('payment')}
                    };
                }
                if (isSeller) {
                    return {
                        title: 'Waiting for Cash Payment',
                        message: 'Buyer needs to pay cash portion before shipping can begin.',
                        variant: 'info' as const
                    };
                }
            }

            if (['SHIPPING_PENDING', 'PAYMENT_RECEIVED'].includes(status)) {
                return {
                    title: 'Both Parties Must Ship',
                    message:
                        'Both you and the other party need to ship within 48 hours. Track each other\'s progress.',
                    variant: 'warning' as const,
                    action: {label: 'Arrange Shipping', onClick: () => setActiveSection('shipping')}
                };
            }

            if (status === 'DELIVERED') {
                return {
                    title: 'Inspect Your Item',
                    message: 'You have 3 days to inspect and confirm the exchange. Both parties must accept.',
                    variant: 'success' as const,
                    action: {label: 'Confirm Receipt', onClick: handleConfirmDelivery}
                };
            }
        }

        if (transactionType === 'CASH_ONLY') {
            if (isBuyer && ['PAYMENT_PENDING', 'OFFER_ACCEPTED'].includes(status)) {
                return {
                    title: 'Complete Payment',
                    message: 'Pay securely through our escrow system. Seller ships after payment confirmation.',
                    variant: 'warning' as const,
                    action: {label: 'Pay Now', onClick: () => setActiveSection('payment')}
                };
            }

            if (isSeller && ['PAYMENT_RECEIVED', 'SHIPPING_PENDING'].includes(status)) {
                return {
                    title: 'Ship Item Now',
                    message: 'Payment received and held in escrow. Ship within your handling time.',
                    variant: 'success' as const,
                    action: {label: 'Arrange Shipping', onClick: () => setActiveSection('shipping')}
                };
            }

            if (isBuyer && status === 'DELIVERED') {
                return {
                    title: '3-Day Inspection Period',
                    message:
                        'Inspect the item carefully. Confirm if satisfied, or open a dispute if not as described.',
                    variant: 'info' as const,
                    action: {label: 'Confirm Delivery', onClick: handleConfirmDelivery}
                };
            }

            if (isSeller && status === 'DELIVERED') {
                return {
                    title: 'Awaiting Buyer Confirmation',
                    message: 'Buyer has 3 days to confirm. Payment auto-releases if no action taken.',
                    variant: 'info' as const
                };
            }
        }

        if (status === 'REVIEW_PENDING') {
            return {
                title: 'Leave a Review',
                message: 'Share your experience to help build trust in the community.',
                variant: 'info' as const,
                action: {label: 'Write Review', onClick: () => setShowReviewModal(true)}
            };
        }

        if (status === 'COMPLETED') {
            return {
                title: 'Transaction Complete',
                message: 'This transaction has been successfully completed. Thank you!',
                variant: 'success' as const
            };
        }

        return null;
    };

    const handleConfirmDelivery = async () => {
        // This would be a modal in production
        if (!confirm('Have you received the item in good condition?')) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setTransaction({...transaction, status: 'REVIEW_PENDING'});
            setIsLoading(false);
            setShowReviewModal(true);
        }, 1000);
    };

    const handleCancelTransaction = async () => {
        if (!confirm('Are you sure you want to cancel this transaction?')) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setTransaction({...transaction, status: 'CANCELLED', cancellationReason: 'User requested cancellation'});
            setIsLoading(false);
        }, 1000);
    };

    const nextActionInfo = getNextActionInfo();

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-10 xs:mt-8 xs:mb-6'>
            {/* Header */}
            <div className='mb-6 xs:px-4'>
                <div className='flex items-center justify-between flex-wrap gap-4 mb-4'>
                    <div>
                        <h1 className='typo-heading_ms xs:typo-heading_ss mb-1'>{flowConfig.title}</h1>
                        <p className='typo-body_mr text-text_four'>Transaction #{transaction.id}</p>
                    </div>
                    <div
                        className={`px-4 py-2 rounded-lg typo-body_lm font-medium ${
                            transaction.status === 'COMPLETED'
                                ? 'bg-surface-primary text-primary'
                                : ['CANCELLED', 'DISPUTED'].includes(transaction.status)
                                  ? 'bg-surface-error text-error'
                                  : ['PAYMENT_PENDING', 'SHIPPING_PENDING'].includes(transaction.status)
                                    ? 'bg-surface-secondary text-warning'
                                    : 'bg-accent-navy/5 text-accent-navy'
                        }`}
                    >
                        {transaction.status.replace(/_/g, ' ')}
                    </div>
                </div>

                {/* Progress Tracker */}
                <div className='bg-white shadow-lg rounded-lg p-6 xs:p-4'>
                    <ProgressTracker
                        steps={flowConfig.steps}
                        currentStep={currentStepIndex}
                        status={getProgressStatus()}
                    />
                </div>
            </div>

            {/* Main Content */}
            <div className='grid grid-cols-[1fr_380px] xs:grid-cols-1 gap-6'>
                {/* Left Column */}
                <div className='space-y-6'>
                    {/* Next Action Card */}
                    {nextActionInfo && !['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(transaction.status) && (
                        <div className='xs:px-4'>
                            <InfoCard
                                title={nextActionInfo.title}
                                message={nextActionInfo.message}
                                variant={nextActionInfo.variant}
                                action={nextActionInfo.action}
                            />
                        </div>
                    )}

                    {/* Item Display */}
                    <DualItemDisplay
                        sellerItem={transaction.sellerItem}
                        buyerItem={transaction.buyerItem}
                        seller={transaction.seller}
                        buyer={transaction.buyer}
                        cashAmount={transaction.cashAmount}
                        userRole={userRole}
                    />

                    {/* Tabs for Payment/Shipping */}
                    {(transaction.cashAmount || transaction.sellerShipping) && (
                        <div className='shadow-lg rounded-lg bg-white overflow-hidden'>
                            {/* Tab Headers */}
                            <div className='flex border-b border-border_gray'>
                                {transaction.cashAmount && (
                                    <button
                                        onClick={() => setActiveSection('payment')}
                                        className={`flex-1 px-6 py-4 typo-body_lr font-medium transition-colors ${
                                            activeSection === 'payment'
                                                ? 'text-primary border-b-2 border-primary bg-surface-primary-10'
                                                : 'text-text_four hover:text-text_one'
                                        }`}
                                    >
                                        Payment
                                    </button>
                                )}
                                <button
                                    onClick={() => setActiveSection('shipping')}
                                    className={`flex-1 px-6 py-4 typo-body_lr font-medium transition-colors ${
                                        activeSection === 'shipping'
                                            ? 'text-primary border-b-2 border-primary bg-surface-primary-10'
                                            : 'text-text_four hover:text-text_one'
                                    }`}
                                >
                                    Shipping
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className='p-6'>
                                {activeSection === 'payment' && transaction.cashAmount && (
                                    <PaymentSection
                                        transaction={transaction}
                                        userRole={userRole}
                                        onPaymentComplete={() => {}}
                                    />
                                )}
                                {activeSection === 'shipping' && (
                                    <ShippingSection
                                        transaction={transaction}
                                        userRole={userRole}
                                        onShippingUpdate={() => {}}
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Sidebar */}
                <div className='space-y-6 xs:px-4'>
                    {/* Quick Summary */}
                    <div className='shadow-lg rounded-lg bg-white p-6'>
                        <h3 className='typo-body_lm text-text_one mb-4 font-semibold'>Quick Summary</h3>
                        <div className='space-y-3'>
                            <div>
                                <p className='typo-body_sr text-text_four mb-1'>Your Role</p>
                                <p className='typo-body_lr text-text_one capitalize'>{userRole}</p>
                            </div>

                            {transaction.cashAmount && (
                                <div>
                                    <p className='typo-body_sr text-text_four mb-1'>Cash Amount</p>
                                    <p className='typo-body_lm text-primary font-semibold'>
                                        {formatToNaira(transaction.cashAmount)}
                                    </p>
                                </div>
                            )}

                            <div>
                                <p className='typo-body_sr text-text_four mb-1'>Created</p>
                                <p className='typo-body_mr text-text_one'>{formatMessageTime(transaction.dateCreated)}</p>
                            </div>

                            {transaction.dateCompleted && (
                                <div>
                                    <p className='typo-body_sr text-text_four mb-1'>Completed</p>
                                    <p className='typo-body_mr text-text_one'>
                                        {formatMessageTime(transaction.dateCompleted)}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Transaction Protection */}
                    <div className='shadow-lg rounded-lg bg-white p-6'>
                        <h3 className='typo-body_lm text-text_one mb-4 font-semibold'>Protected Transaction</h3>
                        <div className='space-y-4'>
                            <div className='flex items-start gap-3'>
                                <div className='w-8 h-8 rounded-full bg-surface-primary flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-4 h-4 text-primary' fill='currentColor' viewBox='0 0 20 20'>
                                        <path
                                            fillRule='evenodd'
                                            d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one font-medium mb-1'>Escrow Protection</p>
                                    <p className='typo-body_sr text-text_four'>
                                        Payments held securely until delivery confirmed
                                    </p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-8 h-8 rounded-full bg-accent-navy/10 flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-4 h-4 text-accent-navy' fill='currentColor' viewBox='0 0 20 20'>
                                        <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                                        <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
                                    </svg>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one font-medium mb-1'>Tracked Shipping</p>
                                    <p className='typo-body_sr text-text_four'>All shipments require tracking numbers</p>
                                </div>
                            </div>

                            <div className='flex items-start gap-3'>
                                <div className='w-8 h-8 rounded-full bg-surface-secondary flex items-center justify-center flex-shrink-0'>
                                    <svg className='w-4 h-4 text-warning' fill='currentColor' viewBox='0 0 20 20'>
                                        <path
                                            fillRule='evenodd'
                                            d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                </div>
                                <div>
                                    <p className='typo-body_mr text-text_one font-medium mb-1'>Dispute Resolution</p>
                                    <p className='typo-body_sr text-text_four'>Platform mediation available if needed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Button */}
                    {['OFFER_ACCEPTED', 'PAYMENT_PENDING'].includes(transaction.status) && (
                        <button
                            onClick={handleCancelTransaction}
                            disabled={isLoading}
                            className='w-full h-[48px] border-2 border-error text-error rounded-lg typo-body_lr font-medium hover:bg-surface-error disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                        >
                            {isLoading ? 'Cancelling...' : 'Cancel Transaction'}
                        </button>
                    )}
                </div>
            </div>

            {/* Review Modal */}
            {showReviewModal && (
                <ReviewModal
                    transaction={transaction}
                    onClose={() => setShowReviewModal(false)}
                    onReviewSubmitted={() => setTransaction({...transaction, status: 'COMPLETED'})}
                />
            )}
        </div>
    );
};

export default TransactionHubV2;
