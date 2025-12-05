'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {TransactionDTO} from '~/types/transaction';
import {useAppContext} from '~/contexts/AppContext';
import {formatToNaira} from '~/utils/helpers';
import TransactionStatusTimeline from '../transaction/TransactionStatusTimeline';
import TransactionItems from '../transaction/TransactionItems';
import PaymentSection from '../transaction/PaymentSection';
import ShippingSection from '../transaction/ShippingSection';
import ReviewModal from '../transaction/ReviewModal';
import TransactionService from '~/services/transaction.service';

interface Props {
    transaction: TransactionDTO;
}

const TransactionHub = ({transaction: initialTransaction}: Props) => {
    const {user} = useAppContext();
    const [transaction, setTransaction] = useState<TransactionDTO>(initialTransaction);
    const [activeTab, setActiveTab] = useState<'overview' | 'payment' | 'shipping'>('overview');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const userRole = TransactionService.getUserRole(transaction, user?.userId ? parseInt(user.userId) : 0);
    const isSeller = userRole === 'seller';
    const isBuyer = userRole === 'buyer';
    const nextAction = TransactionService.getNextAction(transaction, user?.userId ? parseInt(user.userId) : 0);

    // Refresh transaction data
    const refreshTransaction = async () => {
        try {
            const response = await TransactionService.getTransactionById(transaction.id);
            if (response.data) {
                setTransaction(response.data);
            }
        } catch (error) {
            console.error('Failed to refresh transaction:', error);
        }
    };

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(refreshTransaction, 30000);
        return () => clearInterval(interval);
    }, [transaction.id]);

    const handleCancelTransaction = async () => {
        if (!confirm('Are you sure you want to cancel this transaction?')) return;

        setIsLoading(true);
        try {
            const response = await TransactionService.cancelTransaction(transaction.id, 'User requested cancellation');
            if (response.data) {
                setTransaction(response.data);
            }
        } catch (error) {
            console.error('Failed to cancel transaction:', error);
            alert('Failed to cancel transaction. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmDelivery = async () => {
        if (!confirm('Have you received the item in good condition?')) return;

        setIsLoading(true);
        try {
            const shippingId = isBuyer ? transaction.sellerShipping?.id : transaction.buyerShipping?.id;
            if (!shippingId) {
                alert('Shipping information not found');
                return;
            }

            const response = await TransactionService.confirmDelivery(transaction.id, shippingId);
            if (response.data) {
                setTransaction(response.data);
                // Show review modal after confirmation
                setTimeout(() => setShowReviewModal(true), 1000);
            }
        } catch (error) {
            console.error('Failed to confirm delivery:', error);
            alert('Failed to confirm delivery. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const getTransactionTypeLabel = () => {
        switch (transaction.transactionType) {
            case 'ITEM_EXCHANGE':
                return 'Item Exchange';
            case 'ITEM_PLUS_CASH':
                return 'Item + Cash Exchange';
            case 'CASH_ONLY':
                return 'Direct Purchase';
            case 'AUCTION_WIN':
                return 'Auction Win';
            default:
                return 'Transaction';
        }
    };

    const getStatusColor = () => {
        const status = transaction.status;
        if (['COMPLETED'].includes(status)) return 'text-primary bg-surface-primary';
        if (['CANCELLED', 'DISPUTED'].includes(status)) return 'text-error bg-surface-error';
        if (['PAYMENT_PENDING', 'SHIPPING_PENDING', 'REVIEW_PENDING'].includes(status))
            return 'text-warning bg-surface-secondary';
        return 'text-accent-navy bg-accent-navy/5';
    };

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-10 xs:mt-8 xs:mb-6'>
            {/* Header */}
            <div className='mb-6 xs:px-4'>
                <div className='flex items-center justify-between mb-2'>
                    <div>
                        <h1 className='typo-heading_ms xs:typo-heading_ss'>Transaction Details</h1>
                        <p className='typo-body_mr text-text_four'>
                            {getTransactionTypeLabel()} • ID: #{transaction.id}
                        </p>
                    </div>
                    <div
                        className={`px-4 py-2 rounded-lg typo-body_lm ${getStatusColor()}`}
                    >
                        {transaction.status.replace(/_/g, ' ')}
                    </div>
                </div>
            </div>

            {/* Desktop Tabs */}
            <div className='xs:hidden flex border-b border-border_gray mb-6'>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 typo-body_lm ${
                        activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Overview
                </button>
                {(transaction.cashAmount ?? 0) > 0 && (
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`px-6 py-3 typo-body_lm ${
                            activeTab === 'payment' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                        }`}
                    >
                        Payment
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('shipping')}
                    className={`px-6 py-3 typo-body_lm ${
                        activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Shipping
                </button>
            </div>

            {/* Mobile Tabs */}
            <div className='hidden xs:flex border-b border-border_gray mb-4 px-4'>
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 py-3 typo-body_mr ${
                        activeTab === 'overview' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Overview
                </button>
                {(transaction.cashAmount ?? 0) > 0 && (
                    <button
                        onClick={() => setActiveTab('payment')}
                        className={`flex-1 py-3 typo-body_mr ${
                            activeTab === 'payment' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                        }`}
                    >
                        Payment
                    </button>
                )}
                <button
                    onClick={() => setActiveTab('shipping')}
                    className={`flex-1 py-3 typo-body_mr ${
                        activeTab === 'shipping' ? 'text-primary border-b-2 border-primary' : 'text-text_four'
                    }`}
                >
                    Shipping
                </button>
            </div>

            {/* Content */}
            <div className='grid grid-cols-[1fr_360px] xs:grid-cols-1 gap-6'>
                {/* Main Content */}
                <div>
                    {activeTab === 'overview' && (
                        <div className='space-y-6'>
                            {/* Transaction Items */}
                            <TransactionItems transaction={transaction} userRole={userRole} />

                            {/* Status Timeline */}
                            <TransactionStatusTimeline transaction={transaction} />
                        </div>
                    )}

                    {activeTab === 'payment' && (
                        <PaymentSection transaction={transaction} userRole={userRole} onPaymentComplete={refreshTransaction} />
                    )}

                    {activeTab === 'shipping' && (
                        <ShippingSection transaction={transaction} userRole={userRole} onShippingUpdate={refreshTransaction} />
                    )}
                </div>

                {/* Sidebar - Actions */}
                <div className='space-y-6 xs:px-4'>
                    {/* Next Action Card */}
                    {nextAction && !['COMPLETED', 'CANCELLED', 'DISPUTED'].includes(transaction.status) && (
                        <div className='shadow-lg p-6 rounded-lg bg-white'>
                            <h3 className='typo-body_lm text-text_one mb-4'>Next Step</h3>
                            <div className='bg-surface-primary-10 rounded-lg p-4 mb-4'>
                                <p className='typo-body_mm text-primary'>{nextAction}</p>
                            </div>

                            {/* Action Buttons */}
                            {nextAction === 'Make Payment' && (
                                <button
                                    onClick={() => setActiveTab('payment')}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                                >
                                    Proceed to Payment
                                </button>
                            )}

                            {nextAction === 'Ship Item' && (
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                                >
                                    Arrange Shipping
                                </button>
                            )}

                            {nextAction === 'Ship Your Item' && (
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                                >
                                    Arrange Shipping
                                </button>
                            )}

                            {nextAction === 'Confirm Delivery' && (
                                <button
                                    onClick={handleConfirmDelivery}
                                    disabled={isLoading}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90 disabled:opacity-50'
                                >
                                    {isLoading ? 'Confirming...' : 'Confirm Delivery'}
                                </button>
                            )}

                            {nextAction === 'Leave Review' && (
                                <button
                                    onClick={() => setShowReviewModal(true)}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                                >
                                    Leave Review
                                </button>
                            )}

                            {nextAction === 'Track Shipment' && (
                                <button
                                    onClick={() => setActiveTab('shipping')}
                                    className='w-full h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                                >
                                    Track Shipment
                                </button>
                            )}
                        </div>
                    )}

                    {/* Transaction Summary */}
                    <div className='shadow-lg p-6 rounded-lg bg-white'>
                        <h3 className='typo-body_lm text-text_one mb-4'>Transaction Summary</h3>
                        <div className='space-y-3'>
                            <div className='flex justify-between'>
                                <span className='typo-body_mr text-text_four'>Type:</span>
                                <span className='typo-body_mr text-text_one'>{getTransactionTypeLabel()}</span>
                            </div>
                            {transaction.cashAmount && (
                                <div className='flex justify-between'>
                                    <span className='typo-body_mr text-text_four'>Cash Amount:</span>
                                    <span className='typo-body_mm text-primary'>
                                        {formatToNaira(transaction.cashAmount)}
                                    </span>
                                </div>
                            )}
                            <div className='flex justify-between'>
                                <span className='typo-body_mr text-text_four'>Your Role:</span>
                                <span className='typo-body_mr text-text_one capitalize'>{userRole}</span>
                            </div>
                            <div className='flex justify-between pt-3 border-t border-border_gray'>
                                <span className='typo-body_mr text-text_four'>Status:</span>
                                <span className={`typo-body_mr ${getStatusColor().split(' ')[0]}`}>
                                    {transaction.status.replace(/_/g, ' ')}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Cancel Transaction */}
                    {['OFFER_ACCEPTED', 'PAYMENT_PENDING'].includes(transaction.status) && (
                        <button
                            onClick={handleCancelTransaction}
                            disabled={isLoading}
                            className='w-full h-[48px] border-2 border-error text-error rounded-lg typo-body_lr hover:bg-surface-error disabled:opacity-50 transition-colors'
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
                    onReviewSubmitted={refreshTransaction}
                />
            )}
        </div>
    );
};

export default TransactionHub;
