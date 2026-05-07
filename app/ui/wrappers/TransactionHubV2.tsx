'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ShieldCheck, CheckCircle, Lock} from 'lucide-react';
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
    const router = useRouter();
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
                    {label: 'Order Review'},
                    {label: 'Payment'},
                    {label: 'Exchange'},
                    {label: 'Delivery'},
                    {label: 'Rate Trade'}
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

    // Dummy order data for display
    // TODO: Replace with real transaction data from API
    const orderNumber = `#${45887}`;
    const transactionId = `FLPT #${34567890}`;
    const agreedPrice = transaction.cashAmount || 1100000;
    const shippingFee = 6000;
    const platformFee = 5000;
    const totalAmount = agreedPrice + shippingFee + platformFee;

    return (
        <div className='mx-[120px] xs:mx-4 mb-10 mt-6 xs:mt-4 xs:mb-6'>
            {/* Go Back */}
            <button
                onClick={() => router.back()}
                className='flex items-center gap-1 text-primary font-poppins text-[14px] mb-6 cursor-pointer hover:opacity-80 transition-opacity'
            >
                <ChevronLeft size={18} />
                <span>Go Back</span>
            </button>

            {/* Breadcrumb */}
            <div className='flex items-center gap-1 font-poppins text-[14px] mb-6'>
                <span className='text-[#A49E9E]'>Home</span>
                <span className='text-[#A49E9E]'>/</span>
                <span className='text-[#A49E9E]'>Item details</span>
                <span className='text-[#A49E9E]'>/</span>
                <span className='text-text_one font-semibold'>
                    {currentStepIndex === 0 ? 'Order summary' : currentStepIndex === 1 ? 'Payment' : 'Transaction'}
                </span>
            </div>

            {/* Main container */}
            <div className='bg-[#FAFAFA] rounded-xl p-8 xs:p-4'>
                {/* Transaction Timeline heading */}
                <h2 className='font-poppins font-semibold text-[18px] text-text_one mb-4'>Transaction Timeline</h2>

                {/* Progress Tracker */}
                <ProgressTracker
                    steps={flowConfig.steps}
                    currentStep={currentStepIndex}
                    status={getProgressStatus()}
                />

                {/* ============ STEP 0: ORDER REVIEW ============ */}
                {currentStepIndex === 0 && (
                    <>
                        <h3 className='font-poppins font-semibold text-[16px] text-text_one mt-8 mb-2'>Review Order</h3>
                        <p className='font-poppins text-[14px] text-text_one mb-6'>
                            Order {orderNumber}  Transaction ID : <span className='font-semibold'>{transactionId}</span>
                        </p>

                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8'>
                            {/* Left — Item + Payment Details */}
                            <div className='space-y-6'>
                                <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-4'>
                                    <Image
                                        src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                        alt={transaction.sellerItem?.title || 'Item'}
                                        width={120}
                                        height={120}
                                        className='rounded-lg object-cover w-[120px] h-[120px] flex-shrink-0'
                                    />
                                    <div className='flex flex-col justify-center'>
                                        <h4 className='font-poppins text-[14px] text-text_one'>
                                            {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                        </h4>
                                        <p className='font-poppins text-[13px] text-text_four mt-2'>
                                            Condition : {transaction.sellerItem?.condition || 'Brand new'}
                                        </p>
                                        <p className='font-poppins text-[13px] text-text_four mt-1'>
                                            Trade type: Cash only
                                        </p>
                                    </div>
                                </div>

                                <div className='border border-[#E8E8E8] rounded-xl p-6'>
                                    <h4 className='font-poppins font-semibold text-[16px] text-text_one mb-4'>Payment Details</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>Agreed Price</span>
                                            <span className='font-poppins text-[14px] text-text_one'>{formatToNaira(agreedPrice)}.00</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>Shipping Fee</span>
                                            <span className='font-poppins text-[14px] text-text_one'>{formatToNaira(shippingFee)}.00</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>Platform Service Fee</span>
                                            <span className='font-poppins text-[14px] text-text_one'>{formatToNaira(platformFee)}.00</span>
                                        </div>
                                        <hr className='border-[#E8E8E8]' />
                                        <div className='flex justify-between'>
                                            <span className='font-poppins font-bold text-[16px] text-text_one'>Total Amount</span>
                                            <span className='font-poppins font-bold text-[16px] text-primary'>{formatToNaira(totalAmount)}.00</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Escrow Protection */}
                            <div className='space-y-6'>
                                <div>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <ShieldCheck size={32} className='text-primary' />
                                        <h4 className='font-poppins font-bold text-[18px] text-text_one'>Escrow Protection</h4>
                                    </div>
                                    <p className='font-poppins text-[14px] text-text_four leading-[1.6] mb-6'>
                                        Your funds are held securely by our platform&apos;s escrow service. The seller will only receive payment once you confirm the receipt of item in the described condition.
                                    </p>
                                    <div className='space-y-3 mb-8'>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>Securely encrypted payment</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>100% money-back guarantee</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>24/7 Dispute resolution support</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setTransaction({...transaction, status: 'PAYMENT_PENDING'})}
                                        className='w-full h-[48px] bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors mb-3'
                                    >
                                        Proceed to Checkout
                                    </button>
                                    <button
                                        onClick={handleCancelTransaction}
                                        disabled={isLoading}
                                        className='w-full h-[48px] border border-primary text-primary rounded-lg font-poppins text-[14px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50'
                                    >
                                        Cancel
                                    </button>
                                </div>
                                <div className='border border-[#E8E8E8] rounded-xl p-4 flex items-center gap-3'>
                                    <Lock size={20} className='text-[#A49E9E] flex-shrink-0' />
                                    <div>
                                        <p className='font-poppins font-bold text-[12px] text-text_one uppercase'>SAFE CHECKOUT</p>
                                        <p className='font-poppins text-[12px] text-[#A49E9E]'>
                                            All data is encrypted and protected by industrial grade security standard
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ============ STEP 1: PAYMENT ============ */}
                {currentStepIndex === 1 && (
                    <div className='mt-8'>
                        {/* Amount + Name */}
                        <div className='text-right mb-8'>
                            <p className='font-poppins font-bold text-[22px] text-text_one'>
                                NGN {totalAmount.toLocaleString()}.00
                            </p>
                            <p className='font-poppins text-[14px] text-text_four mt-1'>
                                {transaction.buyer?.firstName || 'John'}  {transaction.buyer?.lastName || 'Doe'}
                            </p>
                        </div>

                        {/* Transfer instructions */}
                        <p className='font-poppins text-[14px] text-text_one leading-[1.6] mb-4'>
                            Transfer exactly ₦{totalAmount.toLocaleString()}.00 (including the decimal) to the account below. You will be redirected after a successful payment.
                        </p>

                        {/* Warning box */}
                        <div className='bg-[#FFF4EE] border border-[#FF674B]/20 rounded-xl p-5 mb-6'>
                            <p className='font-poppins text-[14px] text-[#FF674B]'>
                                Do NOT transfer more than once to the account below or save it for later use.
                            </p>
                        </div>

                        {/* Bank details box */}
                        {/* TODO: Replace with real bank details from Credo payment initialization API */}
                        <div className='bg-[#C9EBF4] rounded-xl p-6 mb-8'>
                            <div className='space-y-4'>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-text_one'>Bank Name</span>
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>Zenith Bank</span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account Number</span>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-poppins font-semibold text-[14px] text-text_one'>4432890753</span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText('4432890753');
                                            }}
                                            className='text-primary hover:opacity-70 transition-opacity'
                                            title='Copy account number'
                                        >
                                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account Name</span>
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>CREDO( Flipit MarketPlace)</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account expires in</span>
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>29m 54s</span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <div className='flex justify-center'>
                            <button
                                onClick={() => setTransaction({...transaction, status: 'PAYMENT_RECEIVED'})}
                                className='px-16 py-3 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'
                            >
                                I have deposited the money
                            </button>
                        </div>
                    </div>
                )}

                {/* ============ STEP 2+: PLACEHOLDER ============ */}
                {currentStepIndex >= 2 && (
                    <div className='mt-8 text-center py-12'>
                        <p className='font-poppins text-[16px] text-text_four'>
                            {flowConfig.steps[currentStepIndex]?.label || 'Transaction'} — Coming soon
                        </p>
                    </div>
                )}
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
