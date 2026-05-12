'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
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
import SwapTransactionSteps from '../transaction/SwapTransactionSteps';

interface Props {
    transaction: TransactionDTO;
}

// Seller Shipping View — shown to seller at Exchange step
const SellerShippingView = ({totalAmount}: {totalAmount: number}) => {
    const [selectedLogistics, setSelectedLogistics] = useState<string>('guo');
    const [codeGenerated, setCodeGenerated] = useState(false);

    // TODO: Replace with real API data
    const uniqueCode = '8892 – 4930';
    const logisticsName = selectedLogistics === 'gig' ? 'GIG' : 'GUO';

    return (
        <div className='space-y-6'>
            {/* Escrow confirmation banner */}
            <div className='bg-[#C9FFDF]/40 border border-[#08973F]/20 rounded-2xl p-5 flex items-start gap-4'>
                <div className='flex-shrink-0 mt-1'>
                    <ShieldCheck size={28} className='text-primary' />
                </div>
                <div>
                    <h4 className='font-poppins font-bold text-[16px] text-primary mb-1'>Payment Secured in Escrow!</h4>
                    <p className='font-poppins text-[13px] text-text_four leading-[1.6]'>
                        The buyer has paid. Your funds are protected and held safely in escrow. Please proceed with
                        shipping to trigger the release process.
                    </p>
                </div>
            </div>

            {/* Logistics selection */}
            <div className='border border-[#E8E8E8] rounded-2xl p-6'>
                <h4 className='font-poppins font-semibold text-[16px] text-text_one text-center mb-5'>
                    Choose Preferred Logistics Service
                </h4>

                <div className='space-y-3 mb-6'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input
                            type='radio'
                            name='logistics'
                            value='gig'
                            checked={selectedLogistics === 'gig'}
                            onChange={() => setSelectedLogistics('gig')}
                            className='w-[18px] h-[18px] accent-primary'
                        />
                        <span className='font-poppins text-[14px] text-text_one'>GIG Logistics Services</span>
                    </label>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input
                            type='radio'
                            name='logistics'
                            value='guo'
                            checked={selectedLogistics === 'guo'}
                            onChange={() => setSelectedLogistics('guo')}
                            className='w-[18px] h-[18px] accent-primary'
                        />
                        <span className='font-poppins text-[14px] text-text_one'>GUO Logistics Services</span>
                    </label>
                </div>

                <div className='flex justify-center'>
                    <button
                        onClick={() => setCodeGenerated(true)}
                        className='px-8 py-2.5 border border-primary text-primary rounded-lg font-poppins text-[14px] font-medium hover:bg-primary hover:text-white transition-colors'
                    >
                        Generate Unique code
                    </button>
                </div>
            </div>

            {/* === After code generation === */}
            {codeGenerated && (
                <>
                    {/* Unique Code + Shipping Deadline */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-6 flex xs:flex-col items-center justify-between'>
                        <div>
                            <p className='font-poppins font-semibold text-[11px] text-[#A49E9E] uppercase tracking-wider mb-2'>
                                UNIQUE CODE
                            </p>
                            <div className='border-[3px] border-dashed border-primary bg-[#C9EBF4] rounded-xl px-5 py-4 flex items-center gap-4 w-max'>
                                <span className='font-poppins font-bold text-[20px] text-primary'>{uniqueCode}</span>
                                <button
                                    onClick={() => navigator.clipboard.writeText(uniqueCode.replace(/\s/g, ''))}
                                    className='text-primary hover:opacity-70'
                                    title='Copy code'
                                >
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path
                                            strokeLinecap='round'
                                            strokeLinejoin='round'
                                            strokeWidth={2}
                                            d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                                        />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {/* Vertical divider */}
                        <div className='h-[80px] w-[1px] bg-[#E8E8E8] mx-8 xs:hidden'></div>

                        <div>
                            <p className='font-poppins font-semibold text-[11px] text-[#A49E9E] uppercase tracking-wider mb-2'>
                                SHIPPING DEADLINE
                            </p>
                            <div className='border border-[#E8E8E8] rounded-xl px-8 py-4'>
                                <span className='font-poppins font-bold text-[20px] text-[#FF674B]'>45 : 59 :44</span>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Instructions */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-6'>
                        <h4 className='font-poppins font-bold text-[16px] text-text_one mb-1'>
                            {logisticsName} logistics Instructions
                        </h4>
                        <p className='font-poppins text-[13px] text-[#A49E9E] mb-5'>
                            Please follow these steps to complete your part of the swap.
                        </p>
                        <hr className='border-[#E8E8E8] mb-5' />

                        <div className='space-y-5'>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>
                                        Securely pack your items
                                    </p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>
                                        Ensure the canon camera is padded to protect from damage during transportation
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>
                                        Visit the {logisticsName} Logistics Outlet
                                    </p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>
                                        Drop Off the package at any authorized {logisticsName} outlet near you.
                                    </p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>
                                        Present Your Shipping Code
                                    </p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>
                                        Show the agent your unique code 9956-2345
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-6'>
                        <h4 className='font-poppins font-bold text-[16px] text-text_one mb-4'>Order Summary</h4>
                        <div className='flex gap-4 mb-4'>
                            <Image
                                src='/placeholder-product.svg'
                                alt='Item'
                                width={80}
                                height={80}
                                className='rounded-lg object-cover w-[80px] h-[80px]'
                            />
                            <div>
                                <p className='font-poppins text-[14px] text-text_one'>
                                    Canon EOS RP Camera +Small Rig | Clean U...
                                </p>
                                <p className='font-poppins text-[13px] text-text_four mt-1'>Condition : Brand new</p>
                                <p className='font-poppins text-[13px] text-text_four'>
                                    Trade type: <span className='text-primary'>Cash only</span>
                                </p>
                                <p className='font-poppins text-[13px] text-text_four'>
                                    Agreed Price:<span className='text-primary'>₦1,100,000.00</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Shipping details */}
                    <div className='space-y-2 px-2'>
                        <div className='flex justify-between'>
                            <span className='font-poppins text-[14px] text-text_one'>Shipping method</span>
                            <span className='font-poppins text-[14px] text-text_one'>
                                {logisticsName} Logistics services
                            </span>
                        </div>
                        <div className='flex justify-between'>
                            <span className='font-poppins text-[14px] text-text_one'>Recipient</span>
                            <span className='font-poppins text-[14px] text-text_one'>John Doe</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

const TransactionHubV2 = ({transaction: initialTransaction}: Props) => {
    const {user} = useAppContext();
    const router = useRouter();
    const [transaction, setTransaction] = useState<TransactionDTO>(initialTransaction);
    const [activeSection, setActiveSection] = useState<'overview' | 'payment' | 'shipping'>('overview');
    const [showReviewModal, setShowReviewModal] = useState(false);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [showRateReview, setShowRateReview] = useState(false);
    const [itemConditionRating, setItemConditionRating] = useState(0);
    const [sellerRating, setSellerRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
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
            steps: transactionType === 'ITEM_PLUS_CASH'
                ? [
                    {label: 'Order Review'},
                    {label: 'Payment'},
                    {label: 'Exchange'},
                    {label: 'Delivery'},
                    {label: 'Rate Trade'}
                ]
                : [
                    {label: 'Order Review'},
                    {label: 'Exchange'},
                    {label: 'Activation'},
                    {label: 'Delivery'},
                    {label: 'Rate Trade'}
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
                    message: "Both you and the other party need to ship within 48 hours. Track each other's progress.",
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
                    message: 'Inspect the item carefully. Confirm if satisfied, or open a dispute if not as described.',
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
                <span className='text-[#A49E9E]'>{currentStepIndex >= 2 ? 'Shipping' : 'Item details'}</span>
                <span className='text-[#A49E9E]'>/</span>
                <span className='text-text_one font-semibold'>
                    {currentStepIndex === 0
                        ? 'Order summary'
                        : currentStepIndex === 1
                          ? 'Payment'
                          : `ORDER ${orderNumber}`}
                </span>
            </div>

            {/* Main container */}
            <div className='bg-white rounded-xl p-8 xs:p-4 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)]'>
                {/* Transaction Timeline heading */}
                <h2 className='font-poppins font-semibold text-[18px] text-text_one mb-4'>Transaction Timeline</h2>

                {/* Progress Tracker */}
                <ProgressTracker steps={flowConfig.steps} currentStep={currentStepIndex} status={getProgressStatus()} />

                {/* ============ STEP 0: ORDER REVIEW ============ */}
                {currentStepIndex === 0 && transaction.transactionType === 'ITEM_EXCHANGE' && (
                    <>
                        <h3 className='font-poppins font-semibold text-[16px] text-text_one mt-8 mb-2'>Review Order</h3>

                        {/* Swap Agreement banner */}
                        <div className='border border-[#E8E8E8] rounded-xl p-5 text-center mb-6'>
                            <div className='flex items-center justify-center gap-2 mb-1'>
                                <CheckCircle size={18} className='text-[#08973F]' />
                                <span className='font-poppins font-semibold text-[16px] text-[#08973F]'>Swap Agreement</span>
                            </div>
                            <p className='font-poppins text-[14px] text-[#A49E9E]'>
                                Both parties have agreed to swap term. Review Items below
                            </p>
                        </div>

                        {/* Order & Transaction IDs */}
                        <p className='font-poppins text-[14px] text-text_one mb-6'>
                            Order #43467  Transaction ID : <span className='font-semibold'>FLPT #323156798</span>
                        </p>

                        {/* Two item cards side by side */}
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-6 mb-6'>
                            {/* Your Item (A) */}
                            <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <div className='w-[40px] h-[40px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[16px] text-primary'>
                                        A
                                    </div>
                                    <div>
                                        <p className='font-poppins font-semibold text-[14px] text-text_one'>Your Item</p>
                                        <p className='font-poppins text-[13px] text-text_four'>
                                            {transaction.seller?.firstName || 'John'} {transaction.seller?.lastName || 'Doe'}
                                        </p>
                                    </div>
                                </div>
                                <Image
                                    src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt='Your item'
                                    width={300}
                                    height={200}
                                    className='rounded-xl object-cover w-full h-[200px] mb-3'
                                />
                                <p className='font-poppins font-semibold text-[14px] text-text_one'>
                                    {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                </p>
                                <p className='font-poppins text-[13px] text-text_four mt-1'>
                                    Condition : {transaction.sellerItem?.condition || 'Brand new'}
                                </p>
                            </div>

                            {/* User B's Item */}
                            <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                                <div className='flex items-center gap-3 mb-3'>
                                    <div className='w-[40px] h-[40px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[16px] text-primary'>
                                        B
                                    </div>
                                    <div>
                                        <p className='font-poppins font-semibold text-[14px] text-text_one'>User B&apos;s Item</p>
                                        <p className='font-poppins text-[13px] text-text_four'>
                                            {transaction.buyer?.firstName || 'Sarah'} {transaction.buyer?.lastName || 'Duke'}
                                        </p>
                                    </div>
                                </div>
                                <Image
                                    src={transaction.buyerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt='Their item'
                                    width={300}
                                    height={200}
                                    className='rounded-xl object-cover w-full h-[200px] mb-3'
                                />
                                <p className='font-poppins font-semibold text-[14px] text-text_one'>
                                    {transaction.buyerItem?.title || 'Iphone 15 Pro Max ( Metallic Grey)'}
                                </p>
                                <p className='font-poppins text-[13px] text-text_four mt-1'>
                                    Condition : {transaction.buyerItem?.condition || 'Fairly Used'}
                                </p>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <button
                            onClick={() => setTransaction({...transaction, status: 'SHIPPING_PENDING'})}
                            className='w-full max-w-[400px] h-[48px] bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'
                        >
                            Confirm & Proceed to Shipping
                        </button>
                    </>
                )}

                {/* ============ STEP 0: ORDER REVIEW — ITEM_PLUS_CASH ============ */}
                {currentStepIndex === 0 && transaction.transactionType === 'ITEM_PLUS_CASH' && (
                    <>
                        {/* Swap Confirmed banner */}
                        <div className='border border-[#E8E8E8] rounded-xl p-5 text-center mt-8 mb-6'>
                            <div className='flex items-center justify-center gap-2 mb-1'>
                                <CheckCircle size={18} className='text-[#08973F]' />
                                <span className='font-poppins font-semibold text-[16px] text-[#08973F]'>Swap Confirmed !</span>
                            </div>
                            <p className='font-poppins text-[14px] text-[#A49E9E]'>
                                Both parties have agreed to swap term. Proceed with the payment and shipping of item.
                            </p>
                        </div>

                        {/* Order & Transaction IDs */}
                        <p className='font-poppins text-[14px] text-text_one mb-6'>
                            Order #478957  Transaction ID : <span className='font-semibold'>FLPT #4547802318</span>
                        </p>

                        {/* YOUR CONTRIBUTION */}
                        <div className='border border-[#E8E8E8] rounded-xl p-5 mb-4'>
                            <p className='font-poppins font-semibold text-[12px] text-[#A49E9E] uppercase tracking-wider mb-3'>YOUR CONTRIBUTION</p>
                            <div className='flex items-center gap-4'>
                                <Image
                                    src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt='Your item'
                                    width={100}
                                    height={100}
                                    className='rounded-lg object-cover w-[100px] h-[100px]'
                                />
                                <div className='flex-1'>
                                    <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}</p>
                                    <p className='font-poppins text-[13px] text-text_four mt-1'>Condition : {transaction.sellerItem?.condition || 'Brand new'}</p>
                                    <p className='font-poppins text-[13px] text-text_four'>Trade type: Cash only</p>
                                </div>
                                <span className='font-poppins text-[20px] text-text_four'>+</span>
                                <span className='font-poppins font-semibold text-[16px] text-primary'>₦{(transaction.cashAmount || 200000).toLocaleString()}.00</span>
                            </div>
                        </div>

                        {/* Swap arrows */}
                        <div className='flex justify-center my-3'>
                            <div className='w-[40px] h-[40px] rounded-full bg-[#C9EBF4] flex items-center justify-center'>
                                <svg className='w-5 h-5 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                                </svg>
                            </div>
                        </div>

                        {/* RECEIVING FROM PARTNER */}
                        <div className='border border-[#E8E8E8] rounded-xl p-5 mb-6'>
                            <p className='font-poppins font-semibold text-[12px] text-[#A49E9E] uppercase tracking-wider mb-3'>RECEIVING FROM PARTNER</p>
                            <div className='flex items-center gap-4'>
                                <Image
                                    src={transaction.buyerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt='Partner item'
                                    width={100}
                                    height={100}
                                    className='rounded-lg object-cover w-[100px] h-[100px]'
                                />
                                <div>
                                    <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.buyerItem?.title || 'IPhone 15 Pro Max ( Metallic Grey)'}</p>
                                    <p className='font-poppins text-[13px] text-text_four mt-1'>Condition : {transaction.buyerItem?.condition || 'Brand new'}</p>
                                    <p className='font-poppins text-[13px] text-text_four'>Trade type: Cash only</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className='border border-[#E8E8E8] rounded-xl p-6 mb-6'>
                            <h4 className='font-poppins font-semibold text-[16px] text-text_one mb-4'>Payment Summary</h4>
                            <div className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-[#A49E9E]'>Agreed Price</span>
                                    <span className='font-poppins text-[14px] text-text_one'>₦{(transaction.cashAmount || 200000).toLocaleString()}.00</span>
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
                                    <span className='font-poppins font-bold text-[16px] text-primary'>{formatToNaira((transaction.cashAmount || 200000) + shippingFee + platformFee)}.00</span>
                                </div>
                            </div>
                        </div>

                        {/* Proceed button */}
                        <button
                            onClick={() => setTransaction({...transaction, status: 'PAYMENT_PENDING'})}
                            className='w-full max-w-[400px] h-[48px] bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'
                        >
                            Proceed to Payment
                        </button>
                    </>
                )}

                {currentStepIndex === 0 && transaction.transactionType !== 'ITEM_EXCHANGE' && transaction.transactionType !== 'ITEM_PLUS_CASH' && (
                    <>
                        <h3 className='font-poppins font-semibold text-[16px] text-text_one mt-8 mb-2'>Review Order</h3>
                        <p className='font-poppins text-[14px] text-text_one mb-6'>
                            Order {orderNumber} Transaction ID : <span className='font-semibold'>{transactionId}</span>
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
                                            {transaction.sellerItem?.title ||
                                                'Canon EOS RP Camera +Small Rig | Clean U...'}
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
                                    <h4 className='font-poppins font-semibold text-[16px] text-text_one mb-4'>
                                        Payment Details
                                    </h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>
                                                Agreed Price
                                            </span>
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                {formatToNaira(agreedPrice)}.00
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>
                                                Shipping Fee
                                            </span>
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                {formatToNaira(shippingFee)}.00
                                            </span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>
                                                Platform Service Fee
                                            </span>
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                {formatToNaira(platformFee)}.00
                                            </span>
                                        </div>
                                        <hr className='border-[#E8E8E8]' />
                                        <div className='flex justify-between'>
                                            <span className='font-poppins font-bold text-[16px] text-text_one'>
                                                Total Amount
                                            </span>
                                            <span className='font-poppins font-bold text-[16px] text-primary'>
                                                {formatToNaira(totalAmount)}.00
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Escrow Protection */}
                            <div className='space-y-6'>
                                {/* Escrow Protection box */}
                                <div className='border border-[#E8E8E8] rounded-3xl p-6 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)]'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <ShieldCheck size={32} className='text-primary' />
                                        <h4 className='font-poppins font-bold text-[18px] text-text_one'>
                                            Escrow Protection
                                        </h4>
                                    </div>
                                    <p className='font-poppins text-[14px] text-text_four leading-[1.6] mb-6'>
                                        Your funds are held securely by our platform&apos;s escrow service. The seller
                                        will only receive payment once you confirm the receipt of item in the described
                                        condition.
                                    </p>
                                    <div className='space-y-3 mb-8'>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                Securely encrypted payment
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                100% money-back guarantee
                                            </span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-[#08973F] flex-shrink-0' />
                                            <span className='font-poppins text-[14px] text-text_one'>
                                                24/7 Dispute resolution support
                                            </span>
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
                                        className='w-full h-[48px] border-2 border-primary text-primary rounded-lg font-poppins text-[14px] font-medium hover:bg-gray-50 transition-colors disabled:opacity-50'
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Safe Checkout box */}
                                <div className='border border-[#E8E8E8] rounded-xl p-4 flex items-center gap-3'>
                                    <Lock size={20} className='text-[#A49E9E] flex-shrink-0' />
                                    <div>
                                        <p className='font-poppins font-bold text-[12px] text-text_one uppercase'>
                                            SAFE CHECKOUT
                                        </p>
                                        <p className='font-poppins text-[12px] text-[#A49E9E]'>
                                            All data is encrypted and protected by industrial grade security standard
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ============ SWAP TRANSACTION STEPS ============ */}
                {(transaction.transactionType === 'ITEM_EXCHANGE' || transaction.transactionType === 'ITEM_PLUS_CASH') &&
                    !showRateReview &&
                    ((transaction.transactionType === 'ITEM_EXCHANGE' && currentStepIndex >= 1 && currentStepIndex <= 3) ||
                     (transaction.transactionType === 'ITEM_PLUS_CASH' && currentStepIndex >= 2 && currentStepIndex <= 3)) && (
                    <SwapTransactionSteps
                        transaction={transaction}
                        currentStepIndex={currentStepIndex}
                        isBuyer={isBuyer}
                        isSeller={isSeller}
                        onStatusChange={(status) => setTransaction({...transaction, status: status as any})}
                        onShowRateReview={() => setShowRateReview(true)}
                    />
                )}

                {/* Swap completed view */}
                {(transaction.transactionType === 'ITEM_EXCHANGE' || transaction.transactionType === 'ITEM_PLUS_CASH') &&
                    transaction.status === 'COMPLETED' && !showRateReview && (
                    <SwapTransactionSteps
                        transaction={transaction}
                        currentStepIndex={currentStepIndex}
                        isBuyer={isBuyer}
                        isSeller={isSeller}
                        onStatusChange={(status) => setTransaction({...transaction, status: status as any})}
                        onShowRateReview={() => setShowRateReview(true)}
                    />
                )}

                {/* ============ STEP 1: PAYMENT (cash-only + cash+swap) ============ */}
                {currentStepIndex === 1 && transaction.transactionType !== 'ITEM_EXCHANGE' && (
                    <div className='mt-8'>
                        {/* Amount + Name */}
                        <div className='text-right mb-8'>
                            <p className='font-poppins font-bold text-[22px] text-text_one'>
                                NGN {totalAmount.toLocaleString()}.00
                            </p>
                            <p className='font-poppins text-[14px] text-text_four mt-1'>
                                {transaction.buyer?.firstName || 'John'} {transaction.buyer?.lastName || 'Doe'}
                            </p>
                        </div>

                        {/* Transfer instructions */}
                        <p className='font-poppins text-[14px] text-text_one leading-[1.6] mb-4'>
                            Transfer exactly ₦{totalAmount.toLocaleString()}.00 (including the decimal) to the account
                            below. You will be redirected after a successful payment.
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
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>
                                        Zenith Bank
                                    </span>
                                </div>
                                <div className='flex justify-between items-center'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account Number</span>
                                    <div className='flex items-center gap-2'>
                                        <span className='font-poppins font-semibold text-[14px] text-text_one'>
                                            4432890753
                                        </span>
                                        <button
                                            onClick={() => {
                                                navigator.clipboard.writeText('4432890753');
                                            }}
                                            className='text-primary hover:opacity-70 transition-opacity'
                                            title='Copy account number'
                                        >
                                            <svg
                                                className='w-5 h-5'
                                                fill='none'
                                                stroke='currentColor'
                                                viewBox='0 0 24 24'
                                            >
                                                <path
                                                    strokeLinecap='round'
                                                    strokeLinejoin='round'
                                                    strokeWidth={2}
                                                    d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z'
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account Name</span>
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>
                                        CREDO( Flipit MarketPlace)
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins text-[14px] text-text_one'>Account expires in</span>
                                    <span className='font-poppins font-semibold text-[14px] text-text_one'>
                                        29m 54s
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Confirm button */}
                        <div className='flex justify-center'>
                            <button
                                onClick={() => setShowPaymentSuccess(true)}
                                className='px-16 py-3 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'
                            >
                                I have deposited the money
                            </button>
                        </div>
                    </div>
                )}

                {/* ============ STEP 2: EXCHANGE (Shipping) — cash-only ============ */}
                {currentStepIndex === 2 && transaction.transactionType !== 'ITEM_EXCHANGE' && transaction.transactionType !== 'ITEM_PLUS_CASH' && (
                    <div className='mt-8'>
                        {/* BUYER VIEW */}
                        {isBuyer && (
                            <p className='font-poppins text-[14px] text-text_four leading-[1.6]'>
                                Seller has been notified of payment and has begun the shipping process.{' '}
                                <Link href='/notifications' className='text-primary underline font-medium'>
                                    Check notifications for Shipping details.
                                </Link>
                            </p>
                        )}

                        {/* SELLER VIEW */}
                        {isSeller && <SellerShippingView totalAmount={totalAmount} />}
                    </div>
                )}

                {/* ============ STEP 3: DELIVERY / SHIPPING TRACKING — cash-only ============ */}
                {currentStepIndex === 3 && transaction.transactionType !== 'ITEM_EXCHANGE' && transaction.transactionType !== 'ITEM_PLUS_CASH' && (
                    <div className='mt-8'>
                        {/* Live Transit */}
                        <h3 className='font-poppins font-bold text-[16px] text-text_one mb-4'>Live Transit</h3>

                        {/* Map placeholder */}
                        {/* TODO: Replace with actual map integration (Google Maps / Leaflet) using GIG tracking data */}
                        <div className='w-full h-[400px] xs:h-[250px] bg-[#E8F4E8] rounded-xl mb-4 flex items-center justify-center overflow-hidden'>
                            <div className='text-center'>
                                <svg className='w-12 h-12 text-primary mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                </svg>
                                <p className='font-poppins text-[14px] text-primary'>Live map tracking</p>
                                <p className='font-poppins text-[12px] text-text_four'>Map will display when shipping API is integrated</p>
                            </div>
                        </div>

                        {/* Estimated Time of Arrival */}
                        <div className='mb-6'>
                            <p className='font-poppins text-[13px] text-[#A49E9E]'>Estimated Time of Arrival</p>
                            <p className='font-poppins font-semibold text-[14px] text-text_one'>March 16, 2024 10:00 AM</p>
                        </div>

                        {/* Tracking Information */}
                        {/* TODO: Replace with real data from GET /api/v1/shipping/track/{waybillNumber} */}
                        <div className='border border-[#E8E8E8] rounded-2xl p-6'>
                            <h4 className='font-poppins font-bold text-[16px] text-text_one mb-5'>Tracking information</h4>

                            <div className='grid grid-cols-2 xs:grid-cols-1 gap-y-5 gap-x-8'>
                                {/* GIG Logistics + Tracking # */}
                                <div>
                                    <div className='flex items-center gap-2 mb-1'>
                                        <svg className='w-5 h-5 text-text_one' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h1l2 10h13l2-8H5' />
                                        </svg>
                                        <span className='font-poppins font-bold text-[14px] text-text_one'>GIG Logistics</span>
                                    </div>
                                    <p className='font-poppins text-[13px] text-text_four'>Tracking # : FLPT 88924930</p>
                                </div>

                                {/* Last Update */}
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Last Update</p>
                                    <p className='font-poppins text-[13px] text-text_four'>Package left facility in Enugu March 7, 2024</p>
                                </div>

                                {/* Status */}
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Status</p>
                                    <span className='inline-block px-3 py-1 bg-[#C9EBF4] text-primary rounded font-poppins text-[12px] font-medium'>
                                        In Transit
                                    </span>
                                </div>

                                {/* Last Location */}
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Last Location</p>
                                    <p className='font-poppins text-[13px] text-text_four'>Enugu, Enugu</p>
                                </div>

                                {/* Estimated Delivery */}
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Estimated Delivery</p>
                                    <p className='font-poppins text-[13px] text-text_four'>March 10, 2024</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ STEP 4: RATE TRADE / DELIVERY CONFIRMATION ============ */}
                {currentStepIndex === 4 && !showRateReview && transaction.status !== 'COMPLETED' && (
                    <div className='mt-8'>
                        {/* Delivery Confirmation banner */}
                        <div className='border border-[#E8E8E8] rounded-2xl p-5 flex items-center justify-between mb-8'>
                            <div>
                                <h3 className='font-poppins font-bold text-[16px] text-text_one'>Delivery Confirmation</h3>
                                <p className='font-poppins text-[14px] text-text_four mt-1'>
                                    {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                </p>
                            </div>
                            <div className='flex items-center gap-1.5 border border-[#08973F]/20 rounded-full px-4 py-1.5'>
                                <CheckCircle size={16} className='text-[#08973F]' />
                                <span className='font-poppins text-[14px] text-[#08973F] font-medium'>Arrived</span>
                            </div>
                        </div>

                        {/* Two column layout */}
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8'>
                            {/* Left — Map + Item card */}
                            <div className='space-y-6'>
                                {/* Map placeholder */}
                                {/* TODO: Replace with actual map showing delivery location */}
                                <div className='w-full h-[350px] bg-[#E8F4E8] rounded-xl flex items-center justify-center overflow-hidden'>
                                    <div className='text-center'>
                                        <svg className='w-10 h-10 text-primary mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                                        </svg>
                                        <p className='font-poppins text-[13px] text-primary'>Delivery location map</p>
                                    </div>
                                </div>

                                {/* Item card */}
                                <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-4'>
                                    <Image
                                        src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                        alt='Item'
                                        width={80}
                                        height={80}
                                        className='rounded-lg object-cover w-[80px] h-[80px]'
                                    />
                                    <div className='flex flex-col justify-center'>
                                        <p className='font-poppins text-[14px] text-text_one'>
                                            {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                        </p>
                                        <p className='font-poppins text-[13px] text-text_four mt-1'>
                                            Condition : {transaction.sellerItem?.condition || 'Brand new'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right — Auto release + Complete Transaction + Confirm button + Warning */}
                            <div className='space-y-4'>
                                {/* Auto-release countdown */}
                                <div className='border border-[#E8E8E8] rounded-xl p-4 text-center'>
                                    <p className='font-poppins text-[12px] text-[#A49E9E] uppercase tracking-wider'>AUTO - RELEASE IN</p>
                                    <p className='font-poppins font-bold text-[20px] text-[#FF674B] mt-1'>30 : 59 :44</p>
                                </div>

                                {/* Complete Transaction box */}
                                <div className='border border-[#E8E8E8] rounded-xl p-5'>
                                    <h4 className='font-poppins font-bold text-[16px] text-text_one mb-4'>Complete Transaction</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins text-[14px] text-[#A49E9E]'>Cash Escrowed</span>
                                            <span className='font-poppins font-semibold text-[14px] text-primary'>₦1,100,000.00</span>
                                        </div>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins font-semibold text-[14px] text-text_one'>Total Value</span>
                                            <span className='font-poppins font-semibold text-[14px] text-primary'>₦1,100,000.00</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Confirm Receipt button */}
                                <button
                                    onClick={() => {
                                        setTransaction({...transaction, status: 'REVIEW_PENDING'});
                                        setShowRateReview(true);
                                    }}
                                    className='w-full py-5 bg-primary text-white rounded-xl font-poppins text-[16px] font-bold hover:bg-primary/90 transition-colors'
                                >
                                    Confirm Receipt & Release Funds
                                </button>

                                {/* Warning box */}
                                <div className='bg-[#FFC411]/10 border border-[#FFC411]/30 rounded-xl p-4 space-y-3'>
                                    <div className='flex items-start gap-2'>
                                        <svg className='w-5 h-5 text-[#FFC411] flex-shrink-0 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                            <path fillRule='evenodd' d='M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z' clipRule='evenodd' />
                                        </svg>
                                        <p className='font-poppins text-[12px] text-text_one leading-[1.6]'>
                                            Only click this once you have inspected the item. This action is irreversible and funds would be immediately available to seller.
                                        </p>
                                    </div>
                                    <div className='flex items-start gap-2'>
                                        <svg className='w-5 h-5 text-[#A49E9E] flex-shrink-0 mt-0.5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                                        </svg>
                                        <p className='font-poppins text-[12px] text-text_one leading-[1.6]'>
                                            Funds would automatically be released 48hours after delivery so ensure that you confirm receipt and condition of item immediately
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ COMPLETED VIEW — cash-only ============ */}
                {transaction.status === 'COMPLETED' && !showRateReview && transaction.transactionType !== 'ITEM_EXCHANGE' && transaction.transactionType !== 'ITEM_PLUS_CASH' && (
                    <div className='mt-8'>
                        {/* Success banner */}
                        <div className='bg-[#C9FFDF]/40 border border-[#08973F]/20 rounded-2xl p-6 text-center mb-8'>
                            <div className='flex items-center justify-center gap-2 mb-2'>
                                <CheckCircle size={22} className='text-[#08973F]' />
                                <h3 className='font-poppins font-bold text-[18px] text-[#08973F]'>
                                    Transaction Successful 🎉
                                </h3>
                            </div>
                            <p className='font-poppins text-[14px] text-text_four'>
                                Delivery has been confirmed by you. Payment has been released to seller.
                            </p>
                        </div>

                        {/* Delivery Summary */}
                        <div className='border border-[#E8E8E8] rounded-2xl p-6'>
                            <p className='font-poppins font-semibold text-[14px] text-[#A49E9E] uppercase tracking-wider mb-4'>
                                DELIVERY SUMMARY
                            </p>
                            <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-4 max-w-[500px]'>
                                <Image
                                    src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                    alt='Item'
                                    width={80}
                                    height={80}
                                    className='rounded-lg object-cover w-[80px] h-[80px]'
                                />
                                <div className='flex flex-col justify-center'>
                                    <p className='font-poppins text-[14px] text-text_one'>
                                        {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                    </p>
                                    <p className='font-poppins text-[13px] text-text_four mt-1'>
                                        Condition : {transaction.sellerItem?.condition || 'Brand new'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ RATE & REVIEW VIEW ============ */}
                {showRateReview && (
                    <div className='mt-8'>
                        <h3 className='font-poppins font-bold text-[16px] text-text_one mb-6'>Rate Your Experience</h3>

                        {/* Item card */}
                        <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-4 mb-8'>
                            <Image
                                src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'}
                                alt='Item'
                                width={80}
                                height={80}
                                className='rounded-lg object-cover w-[80px] h-[80px]'
                            />
                            <div className='flex flex-col justify-center'>
                                <p className='font-poppins font-semibold text-[14px] text-text_one'>
                                    {transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}
                                </p>
                                <div className='flex items-center gap-4 mt-1'>
                                    <span className='font-poppins text-[12px] text-[#A49E9E]'>TRANSACTION ID:</span>
                                    <span className='font-poppins font-semibold text-[12px] text-text_one'>FLPT88924930</span>
                                </div>
                                <p className='font-poppins text-[12px] text-text_four mt-0.5'>
                                    Seller : {transaction.seller?.firstName || 'John'} {transaction.seller?.lastName || 'Doe'}
                                </p>
                            </div>
                        </div>

                        {/* Two rating sections */}
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8 mb-8'>
                            {/* Item Condition */}
                            <div>
                                <p className='font-poppins font-bold text-[13px] text-text_one uppercase tracking-wider mb-3'>
                                    ITEM CONDITION
                                </p>
                                <div className='flex gap-1 mb-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type='button'
                                            onClick={() => setItemConditionRating(star)}
                                            className='focus:outline-none'
                                        >
                                            <svg
                                                className={`w-7 h-7 ${star <= itemConditionRating ? 'text-[#FFC411]' : 'text-[#E8E8E8]'}`}
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className='font-poppins text-[13px] text-primary'>&quot;Was the item as described?&quot;</p>
                            </div>

                            {/* Seller Professionalism */}
                            <div>
                                <p className='font-poppins font-bold text-[13px] text-text_one uppercase tracking-wider mb-3'>
                                    SELLER PROFESSIONALISM
                                </p>
                                <div className='flex gap-1 mb-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type='button'
                                            onClick={() => setSellerRating(star)}
                                            className='focus:outline-none'
                                        >
                                            <svg
                                                className={`w-7 h-7 ${star <= sellerRating ? 'text-[#FFC411]' : 'text-[#E8E8E8]'}`}
                                                fill='currentColor'
                                                viewBox='0 0 20 20'
                                            >
                                                <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                                            </svg>
                                        </button>
                                    ))}
                                </div>
                                <p className='font-poppins text-[13px] text-primary'>&quot;Communication and speed?&quot;</p>
                            </div>
                        </div>

                        {/* Written Review */}
                        <div className='mb-8'>
                            <p className='font-poppins text-[14px] text-text_one mb-2'>Written Review (Optional )</p>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder='Describe your experience in a few words'
                                rows={4}
                                className='w-full max-w-[500px] px-4 py-3 border border-[#E8E8E8] rounded-lg font-poppins text-[14px] outline-none focus:border-primary resize-none'
                            />
                        </div>

                        {/* Add Photos */}
                        <div className='mb-8'>
                            <h4 className='font-poppins font-bold text-[16px] text-text_one uppercase mb-4'>ADD PHOTOS</h4>
                            <div className='flex gap-4'>
                                {/* Placeholder uploaded photo */}
                                <div className='w-[100px] h-[100px] rounded-lg bg-gray-200 overflow-hidden'>
                                    <Image
                                        src='/placeholder-product.svg'
                                        alt='Uploaded'
                                        width={100}
                                        height={100}
                                        className='w-full h-full object-cover'
                                    />
                                </div>
                                {/* Upload button */}
                                <button className='w-[100px] h-[100px] rounded-lg border-2 border-dashed border-[#E8E8E8] flex flex-col items-center justify-center gap-1 hover:border-primary transition-colors'>
                                    <svg className='w-6 h-6 text-[#A49E9E]' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' />
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 13a3 3 0 11-6 0 3 3 0 016 0z' />
                                    </svg>
                                    <span className='font-poppins text-[10px] text-[#A49E9E] uppercase'>UPLOAD</span>
                                </button>
                            </div>
                            <p className='font-poppins text-[12px] text-[#A49E9E] mt-2'>Upload up to 3 photos to help other buyers</p>
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={() => {
                                // TODO: Submit review via POST /api/v1/reviews
                                setTransaction({...transaction, status: 'COMPLETED'});
                                setShowRateReview(false);
                            }}
                            disabled={itemConditionRating === 0 || sellerRating === 0}
                            className='w-full max-w-[400px] h-[48px] bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            Submit Review
                        </button>
                    </div>
                )}
            </div>

            {/* Payment Success Modal */}
            {showPaymentSuccess && (
                <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl p-10 max-w-[500px] w-full text-center'>
                        {/* Green checkmark icon */}
                        <div className='flex justify-center mb-6'>
                            <div className='w-[100px] h-[100px] rounded-full bg-[#08973F]/10 flex items-center justify-center'>
                                <div className='w-[70px] h-[70px] rounded-full bg-[#08973F] flex items-center justify-center'>
                                    <CheckCircle size={40} className='text-white' />
                                </div>
                            </div>
                        </div>

                        <h2 className='font-poppins font-bold text-[24px] text-text_one mb-4'>Payment Successful !</h2>
                        <p className='font-poppins text-[16px] text-text_four leading-[1.6] mb-10'>
                            NGN {totalAmount.toLocaleString()}.00 has been paid successfully to Flipit MarketPlace
                        </p>

                        <button
                            onClick={() => {
                                setShowPaymentSuccess(false);
                                setTransaction({...transaction, status: 'SHIPPING_PENDING'});
                            }}
                            className='w-[200px] h-[48px] bg-[#08973F] text-white rounded-lg font-poppins text-[16px] font-medium hover:bg-[#08973F]/90 transition-colors'
                        >
                            Ok!
                        </button>
                    </div>
                </div>
            )}

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
