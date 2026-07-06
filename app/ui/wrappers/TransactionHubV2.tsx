'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ShieldCheck, CheckCircle, Lock} from 'lucide-react';
import {CopyIcon, MapPinIcon, WarningIcon, ClockIcon, StarIcon} from '../icons';
import {TransactionDTO, TransactionStatus} from '~/types/transaction';
import {useAppContext} from '~/contexts/AppContext';
import {formatToNaira} from '~/utils/helpers';
import ProgressTracker from '../transaction/ProgressTracker';
import TransactionService from '~/services/transaction.service';
import ReviewsService from '~/services/reviews.service';

interface Props {
    transaction: TransactionDTO;
}

// Seller Shipping View — shown to seller at shipping step
const SellerShippingView = ({transaction}: {transaction: TransactionDTO}) => {
    const [selectedLogistics, setSelectedLogistics] = useState<string>('guo');
    const [codeGenerated, setCodeGenerated] = useState(false);
    const uniqueCode = '8892 – 4930';
    const logisticsName = selectedLogistics === 'gig' ? 'GIG' : 'GUO';

    return (
        <div className='space-y-6'>
            {/* Escrow confirmation banner */}
            <div className='bg-surface-success/40 border border-success-dark/20 rounded-2xl p-5 flex items-start gap-4'>
                <div className='flex-shrink-0 mt-1'>
                    <ShieldCheck size={28} className='text-primary' />
                </div>
                <div>
                    <h4 className='font-poppins typo-body-lg-bold text-primary mb-1'>Payment Secured in Escrow!</h4>
                    <p className='font-poppins typo-body-xs-regular text-text_four'>
                        The buyer has paid. Your funds are protected and held safely in escrow. Please proceed with
                        shipping to trigger the release process.
                    </p>
                </div>
            </div>

            {/* Logistics selection */}
            <div className='border border-border-DEFAULT rounded-2xl p-6'>
                <h4 className='font-poppins typo-body-lg-semibold text-text_one text-center mb-5'>
                    Choose Preferred Logistics Service
                </h4>
                <div className='space-y-3 mb-6'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input type='radio' name='logistics' value='gig' checked={selectedLogistics === 'gig'} onChange={() => setSelectedLogistics('gig')} className='w-[18px] h-[18px] accent-primary' />
                        <span className='font-poppins typo-body-md-regular text-text_one'>GIG Logistics Services</span>
                    </label>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input type='radio' name='logistics' value='guo' checked={selectedLogistics === 'guo'} onChange={() => setSelectedLogistics('guo')} className='w-[18px] h-[18px] accent-primary' />
                        <span className='font-poppins typo-body-md-regular text-text_one'>GUO Logistics Services</span>
                    </label>
                </div>
                <div className='flex justify-center'>
                    <button onClick={() => setCodeGenerated(true)} className='px-8 xs:w-full py-2.5 border border-primary text-primary rounded-lg font-poppins typo-body-md-medium hover:bg-primary hover:text-white transition-colors'>
                        Generate Unique code
                    </button>
                </div>
            </div>

            {codeGenerated && (
                <>
                    {/* Unique Code + Shipping Deadline */}
                    <div className='border border-border-DEFAULT rounded-2xl p-6 xs:p-4 flex xs:flex-col xs:gap-4 items-center justify-between'>
                        <div>
                            <p className='font-poppins typo-caption text-text-muted-alt uppercase tracking-wider mb-2'>UNIQUE CODE</p>
                            <div className='border-[3px] border-dashed border-primary bg-surface-teal rounded-xl px-5 py-4 flex items-center gap-4 w-max'>
                                <span className='font-poppins typo-heading-md-bold text-primary'>{uniqueCode}</span>
                                <button onClick={() => navigator.clipboard.writeText(uniqueCode.replace(/\s/g, ''))} className='text-primary hover:opacity-70' title='Copy code'>
                                    <CopyIcon className='w-5 h-5' />
                                </button>
                            </div>
                        </div>
                        <div className='h-[80px] w-[1px] bg-border-DEFAULT mx-8 xs:hidden'></div>
                        <div>
                            <p className='font-poppins typo-caption text-text-muted-alt uppercase tracking-wider mb-2'>SHIPPING DEADLINE</p>
                            <div className='border border-border-DEFAULT rounded-xl px-8 py-4'>
                                <span className='font-poppins typo-heading-md-bold text-accent-coral'>45 : 59 :44</span>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Instructions */}
                    <div className='border border-border-DEFAULT rounded-2xl p-6'>
                        <h4 className='font-poppins typo-body-lg-bold text-text_one mb-1'>{logisticsName} logistics Instructions</h4>
                        <p className='font-poppins typo-body-xs-regular text-text-muted-alt mb-5'>Please follow these steps to complete your part of the transaction.</p>
                        <hr className='border-border-DEFAULT mb-5' />
                        <div className='space-y-5'>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-success-dark flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins typo-body-md-bold text-text_one'>Securely pack your items</p>
                                    <p className='font-poppins typo-body-xs-regular text-text-muted-alt'>Ensure items are padded to protect from damage during transportation</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-success-dark flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins typo-body-md-bold text-text_one'>Visit the {logisticsName} Logistics Outlet</p>
                                    <p className='font-poppins typo-body-xs-regular text-text-muted-alt'>Drop Off the package at any authorized {logisticsName} outlet near you.</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-success-dark flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins typo-body-md-bold text-text_one'>Present Your Shipping Code</p>
                                    <p className='font-poppins typo-body-xs-regular text-text-muted-alt'>Show the agent your unique code {uniqueCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className='border border-border-DEFAULT rounded-2xl p-6'>
                        <h4 className='font-poppins typo-body-lg-bold text-text_one mb-4'>Order Summary</h4>
                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <span className='font-poppins typo-body-md-regular text-text_one'>Buyer</span>
                                <span className='font-poppins typo-body-md-regular text-text_one'>
                                    {transaction.buyer?.firstName} {transaction.buyer?.lastName}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-poppins typo-body-md-regular text-text_one'>Amount</span>
                                <span className='font-poppins typo-body-md-semibold text-primary'>
                                    {formatToNaira(transaction.amount || 0)}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-poppins typo-body-md-regular text-text_one'>Shipping method</span>
                                <span className='font-poppins typo-body-md-regular text-text_one'>{logisticsName} Logistics</span>
                            </div>
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
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [showRateReview, setShowRateReview] = useState(false);
    const [itemConditionRating, setItemConditionRating] = useState(0);
    const [sellerRating, setSellerRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const userRole = TransactionService.getUserRole(transaction, user?.userId ? parseInt(user.userId) : 0);
    const isSeller = userRole === 'seller';
    const isBuyer = userRole === 'buyer';

    const transactionAmount = transaction.amount || 0;
    const transactionRef = transaction.reference || `FLPT-${transaction.id}`;

    // Map API status to step index based on transaction type
    const getFlowConfig = () => {
        const txType = transaction.type;

        if (txType === 'CASH_ONLY') {
            return {
                title: 'Direct Purchase',
                steps: [
                    {label: 'Order Review'},
                    {label: 'Payment'},
                    {label: 'Shipping'},
                    {label: 'Delivery'},
                    {label: 'Rate Trade'}
                ],
                statusMap: {
                    PENDING: 0,
                    SUCCESS: 1,
                    DELIVERED: 3,
                    VERIFIED: 4,
                    COMPLETED: 4,
                    RELEASED: 4,
                    CANCELLED: 0,
                    FAILED: 1,
                } as Record<TransactionStatus, number>
            };
        }

        if (txType === 'SWAP_WITH_CASH') {
            return {
                title: 'Item + Cash Exchange',
                steps: [
                    {label: 'Order Review'},
                    {label: 'Payment'},
                    {label: 'Exchange'},
                    {label: 'Delivery'},
                    {label: 'Rate Trade'}
                ],
                statusMap: {
                    PENDING: 0,
                    SUCCESS: 1,
                    DELIVERED: 3,
                    VERIFIED: 4,
                    COMPLETED: 4,
                    RELEASED: 4,
                    CANCELLED: 0,
                    FAILED: 1,
                } as Record<TransactionStatus, number>
            };
        }

        // SWAP
        return {
            title: 'Item Exchange',
            steps: [
                {label: 'Order Review'},
                {label: 'Exchange'},
                {label: 'Delivery'},
                {label: 'Rate Trade'}
            ],
            statusMap: {
                PENDING: 0,
                SUCCESS: 1,
                DELIVERED: 2,
                VERIFIED: 3,
                COMPLETED: 3,
                RELEASED: 3,
                CANCELLED: 0,
                FAILED: 0,
            } as Record<TransactionStatus, number>
        };
    };

    const flowConfig = getFlowConfig();
    const currentStepIndex = flowConfig.statusMap[transaction.status] ?? 0;

    const getProgressStatus = (): 'active' | 'completed' | 'cancelled' => {
        if (['COMPLETED', 'RELEASED'].includes(transaction.status)) return 'completed';
        if (['CANCELLED', 'FAILED'].includes(transaction.status)) return 'cancelled';
        return 'active';
    };

    const handleCancelTransaction = async () => {
        if (!confirm('Are you sure you want to cancel this transaction?')) return;

        setIsLoading(true);
        const {data, error} = await TransactionService.cancelTransaction(transaction.id);
        setIsLoading(false);

        if (error) {
            alert('Failed to cancel transaction. Please try again.');
            return;
        }

        if (data) {
            setTransaction(data);
        } else {
            setTransaction({...transaction, status: 'CANCELLED'});
        }
    };

    const handleVerifyPayment = async () => {
        setIsLoading(true);
        const {data, error} = await TransactionService.verifyTransaction(transaction.id);
        setIsLoading(false);

        if (error) {
            alert('Payment verification failed. Please try again.');
            return;
        }

        setShowPaymentSuccess(true);
        if (data) {
            setTransaction(data);
        } else {
            setTransaction({...transaction, status: 'SUCCESS'});
        }
    };

    const handleReleaseAndComplete = async () => {
        setIsLoading(true);
        const {error} = await TransactionService.confirmDelivery(transaction.id);
        if (!error) {
            await TransactionService.releaseTransaction(transaction.id);
        }
        setIsLoading(false);

        if (!error) {
            setTransaction({...transaction, status: 'VERIFIED'});
            setShowRateReview(true);
        }
    };

    const handleSubmitReview = async () => {
        setIsLoading(true);
        const otherUserId = isBuyer ? transaction.seller.id : transaction.buyer.id;
        const avgRating = Math.round((itemConditionRating + sellerRating) / 2);

        await ReviewsService.createReview({
            userId: otherUserId,
            // TODO: TransactionDTO needs item ID from backend
            itemId: transaction.orderId || 0,
            rating: avgRating,
            message: reviewText,
        });

        const {data} = await TransactionService.completeTransaction(transaction.id);
        setIsLoading(false);

        if (data) {
            setTransaction(data);
        } else {
            setTransaction({...transaction, status: 'COMPLETED'});
        }
        setShowRateReview(false);
    };

    // Mobile header title based on transaction status
    const getMobileTitle = () => {
        if (['CANCELLED', 'FAILED'].includes(transaction.status)) return 'Order Summary';
        switch (transaction.status) {
            case 'PENDING': return 'Order Summary';
            case 'SUCCESS': return 'Shipping';
            case 'DELIVERED': return 'Delivery Confirmation';
            case 'VERIFIED': return 'Rate & Review';
            case 'COMPLETED':
            case 'RELEASED': return 'Transaction Complete';
            default: return 'Order Summary';
        }
    };

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-6 xs:mt-0 xs:mb-6 xs:pb-24'>
            {/* Mobile header — xs only */}
            <div className='hidden xs:flex items-center gap-3 px-4 py-3 border-b border-border-DEFAULT bg-white'>
                <button
                    onClick={() => router.back()}
                    className='w-[36px] h-[36px] rounded-full border border-border-DEFAULT flex items-center justify-center flex-shrink-0'
                >
                    <ChevronLeft size={18} className='text-text_one' />
                </button>
                <h1 className='font-poppins typo-body-lg-semibold text-text_one'>{getMobileTitle()}</h1>
            </div>

            {/* Go Back — desktop only */}
            <button
                onClick={() => router.back()}
                className='flex items-center gap-1 text-primary font-poppins typo-body-md-regular mb-6 cursor-pointer hover:opacity-80 transition-opacity xs:hidden'
            >
                <ChevronLeft size={18} />
                <span>Go Back</span>
            </button>

            {/* Breadcrumb — desktop only */}
            <div className='flex items-center gap-1 font-poppins typo-body-md-regular mb-6 xs:hidden'>
                <span className='text-text-muted-alt'>Home</span>
                <span className='text-text-muted-alt'>/</span>
                <span className='text-text-muted-alt'>Item details</span>
                <span className='text-text-muted-alt'>/</span>
                <span className='text-text_one font-semibold'>Order summary</span>
            </div>

            {/* Main container */}
            <div className='bg-white rounded-xl p-8 xs:p-4 xs:rounded-none xs:shadow-none shadow-md'>
                {/* Order ID — mobile only, shown above timeline */}
                <p className='hidden xs:block font-poppins typo-body-sm-regular text-text-muted-alt mb-3'>
                    Order ID: <span className='text-text_one font-semibold'>{transactionRef}</span>
                </p>

                {/* Transaction Timeline heading */}
                <h2 className='font-poppins typo-heading-md-semibold text-text_one mb-4 xs:text-[16px]'>Transaction Timeline</h2>

                {/* Progress Tracker */}
                <ProgressTracker steps={flowConfig.steps} currentStep={currentStepIndex} status={getProgressStatus()} />

                {/* ============ CANCELLED / FAILED STATE ============ */}
                {['CANCELLED', 'FAILED'].includes(transaction.status) && (
                    <div className='mt-8'>
                        <div className='bg-surface-coral border border-accent-coral/20 rounded-2xl p-6 text-center'>
                            <h3 className='font-poppins typo-heading-md-semibold text-accent-coral mb-2'>
                                Transaction {transaction.status === 'CANCELLED' ? 'Cancelled' : 'Failed'}
                            </h3>
                            <p className='font-poppins typo-body-md-regular text-text_four'>
                                {transaction.status === 'CANCELLED'
                                    ? 'This transaction has been cancelled.'
                                    : 'This transaction has failed. Please contact support if you need assistance.'}
                            </p>
                        </div>
                    </div>
                )}

                {/* ============ STEP 0: ORDER REVIEW (PENDING) ============ */}
                {transaction.status === 'PENDING' && (
                    <>
                        <h3 className='font-poppins typo-body-lg-semibold text-text_one mt-8 mb-2'>Review Order</h3>

                        {/* Transaction type banner */}
                        <div className='border border-border-DEFAULT rounded-xl p-5 text-center mb-6'>
                            <div className='flex items-center justify-center gap-2 mb-1'>
                                <CheckCircle size={18} className='text-success-dark' />
                                <span className='font-poppins typo-body-lg-semibold text-success-dark'>
                                    {transaction.type === 'SWAP' ? 'Swap Agreement' : transaction.type === 'SWAP_WITH_CASH' ? 'Swap + Cash Confirmed' : 'Order Confirmed'}
                                </span>
                            </div>
                            <p className='font-poppins typo-body-md-regular text-text-muted-alt'>
                                {transaction.type === 'SWAP'
                                    ? 'Both parties have agreed to swap terms. Review details below.'
                                    : transaction.type === 'SWAP_WITH_CASH'
                                      ? 'Both parties have agreed. Proceed with payment and shipping.'
                                      : 'Your order has been confirmed. Review the details below.'}
                            </p>
                        </div>

                        {/* Transaction Details */}
                        <p className='font-poppins typo-body-md-regular text-text_one mb-6'>
                            Transaction ID: <span className='font-semibold'>{transactionRef}</span>
                        </p>

                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8'>
                            {/* Left — Transaction Info */}
                            <div className='space-y-6'>
                                {/* Participants */}
                                <div className='border border-border-DEFAULT rounded-xl p-5'>
                                    <h4 className='font-poppins typo-body-lg-semibold text-text_one mb-4'>Participants</h4>
                                    <div className='space-y-4'>
                                        <div className='flex items-center gap-3'>
                                            <Image
                                                src={transaction.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                                alt='Seller'
                                                width={40}
                                                height={40}
                                                className='rounded-full w-[40px] h-[40px] object-cover'
                                            />
                                            <div>
                                                <p className='font-poppins typo-body-md-semibold text-text_one'>
                                                    {transaction.seller?.firstName} {transaction.seller?.lastName}
                                                    {isSeller && <span className='text-primary ml-1'>(You)</span>}
                                                </p>
                                                <p className='font-poppins typo-body-xs-regular text-text_four'>Seller</p>
                                            </div>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <Image
                                                src={transaction.buyer?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                                alt='Buyer'
                                                width={40}
                                                height={40}
                                                className='rounded-full w-[40px] h-[40px] object-cover'
                                            />
                                            <div>
                                                <p className='font-poppins typo-body-md-semibold text-text_one'>
                                                    {transaction.buyer?.firstName} {transaction.buyer?.lastName}
                                                    {isBuyer && <span className='text-primary ml-1'>(You)</span>}
                                                </p>
                                                <p className='font-poppins typo-body-xs-regular text-text_four'>Buyer</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Payment Details */}
                                {transactionAmount > 0 && (
                                    <div className='border border-border-DEFAULT rounded-xl p-6'>
                                        <h4 className='font-poppins typo-body-lg-semibold text-text_one mb-4'>Payment Details</h4>
                                        <div className='space-y-3'>
                                            <div className='flex justify-between'>
                                                <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Amount</span>
                                                <span className='font-poppins typo-body-md-regular text-text_one'>{formatToNaira(transactionAmount)}</span>
                                            </div>
                                            {transaction.paymentMethod && (
                                                <div className='flex justify-between'>
                                                    <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Payment Method</span>
                                                    <span className='font-poppins typo-body-md-regular text-text_one'>{transaction.paymentMethod}</span>
                                                </div>
                                            )}
                                            <div className='flex justify-between'>
                                                <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Type</span>
                                                <span className='font-poppins typo-body-md-regular text-text_one'>
                                                    {transaction.type === 'SWAP' ? 'Item Exchange' : transaction.type === 'SWAP_WITH_CASH' ? 'Item + Cash' : 'Cash Only'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right — Escrow Protection + Actions */}
                            <div className='space-y-6'>
                                <div className='border border-border-DEFAULT rounded-xl p-6 shadow-md'>
                                    <div className='flex items-center gap-3 mb-4'>
                                        <ShieldCheck size={32} className='text-primary' />
                                        <h4 className='font-poppins typo-heading-md-semibold text-text_one'>Escrow Protection</h4>
                                    </div>
                                    <p className='font-poppins typo-body-md-regular text-text_four mb-6'>
                                        Your funds are held securely by our platform&apos;s escrow service. The seller will only receive payment once you confirm the receipt of item in the described condition.
                                    </p>
                                    <div className='space-y-3 mb-8'>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-success-dark flex-shrink-0' />
                                            <span className='font-poppins typo-body-md-regular text-text_one'>Securely encrypted payment</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-success-dark flex-shrink-0' />
                                            <span className='font-poppins typo-body-md-regular text-text_one'>100% money-back guarantee</span>
                                        </div>
                                        <div className='flex items-center gap-3'>
                                            <CheckCircle size={20} className='text-success-dark flex-shrink-0' />
                                            <span className='font-poppins typo-body-md-regular text-text_one'>24/7 Dispute resolution support</span>
                                        </div>
                                    </div>

                                    {isBuyer && transaction.type !== 'SWAP' && (
                                        <button
                                            onClick={handleVerifyPayment}
                                            disabled={isLoading}
                                            className='w-full h-[48px] bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors mb-3 disabled:opacity-50'
                                        >
                                            {isLoading ? 'Processing...' : 'Proceed to Checkout'}
                                        </button>
                                    )}

                                    {isBuyer && transaction.type === 'SWAP' && (
                                        <button
                                            onClick={handleVerifyPayment}
                                            disabled={isLoading}
                                            className='w-full h-[48px] bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors mb-3 disabled:opacity-50'
                                        >
                                            {isLoading ? 'Processing...' : 'Confirm & Proceed to Shipping'}
                                        </button>
                                    )}

                                    <button
                                        onClick={handleCancelTransaction}
                                        disabled={isLoading}
                                        className='w-full h-[48px] border-2 border-primary text-primary rounded-lg font-poppins typo-body-md-medium hover:bg-gray-50 transition-colors disabled:opacity-50'
                                    >
                                        Cancel
                                    </button>
                                </div>

                                <div className='border border-border-DEFAULT rounded-xl p-4 flex items-center gap-3'>
                                    <Lock size={20} className='text-text-muted-alt flex-shrink-0' />
                                    <div>
                                        <p className='font-poppins typo-body-sm-semibold text-text_one uppercase'>SAFE CHECKOUT</p>
                                        <p className='font-poppins typo-body-sm-regular text-text-muted-alt'>All data is encrypted and protected by industrial grade security standard</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                {/* ============ SUCCESS: Payment confirmed → Shipping ============ */}
                {transaction.status === 'SUCCESS' && (
                    <div className='mt-8'>
                        {isBuyer && (
                            <div className='space-y-4'>
                                <div className='bg-surface-success/40 border border-success-dark/20 rounded-2xl p-5 flex items-start gap-4'>
                                    <CheckCircle size={24} className='text-success-dark flex-shrink-0 mt-0.5' />
                                    <div>
                                        <h4 className='font-poppins typo-body-lg-bold text-success-dark mb-1'>Payment Confirmed!</h4>
                                        <p className='font-poppins typo-body-xs-regular text-text_four'>
                                            Your payment of {formatToNaira(transactionAmount)} has been confirmed. The seller has been notified and will begin the shipping process.
                                        </p>
                                    </div>
                                </div>
                                <p className='font-poppins typo-body-md-regular text-text_four'>
                                    Seller has been notified of payment and will begin the shipping process.{' '}
                                    <Link href='/notifications' className='text-primary underline font-medium'>
                                        Check notifications for shipping details.
                                    </Link>
                                </p>
                            </div>
                        )}

                        {isSeller && <SellerShippingView transaction={transaction} />}
                    </div>
                )}

                {/* ============ DELIVERED: Confirm delivery ============ */}
                {transaction.status === 'DELIVERED' && !showRateReview && (
                    <div className='mt-8'>
                        <div className='border border-border-DEFAULT rounded-2xl p-5 flex items-center justify-between mb-8'>
                            <div>
                                <h3 className='font-poppins typo-body-lg-bold text-text_one'>Delivery Confirmation</h3>
                                <p className='font-poppins typo-body-md-regular text-text_four mt-1'>
                                    {transaction.description || 'Item has been delivered'}
                                </p>
                            </div>
                            <div className='flex items-center gap-1.5 border border-success-dark/20 rounded-full px-4 py-1.5'>
                                <CheckCircle size={16} className='text-success-dark' />
                                <span className='font-poppins typo-body-md-medium text-success-dark'>Arrived</span>
                            </div>
                        </div>

                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8'>
                            <div className='space-y-6'>
                                {/* Map placeholder */}
                                <div className='w-full h-[350px] bg-surface-success-light rounded-xl flex items-center justify-center overflow-hidden'>
                                    <div className='text-center'>
                                        <MapPinIcon className='w-10 h-10 text-primary mx-auto mb-2' />
                                        <p className='font-poppins typo-body-xs-regular text-primary'>Delivery location map</p>
                                    </div>
                                </div>

                                {/* Transaction info */}
                                <div className='border border-border-DEFAULT rounded-xl p-4'>
                                    <p className='font-poppins typo-body-md-regular text-text_one'>
                                        Transaction: <span className='font-semibold'>{transactionRef}</span>
                                    </p>
                                    <p className='font-poppins typo-body-xs-regular text-text_four mt-1'>
                                        Amount: {formatToNaira(transactionAmount)}
                                    </p>
                                </div>
                            </div>

                            <div className='space-y-4'>
                                <div className='border border-border-DEFAULT rounded-xl p-5'>
                                    <h4 className='font-poppins typo-body-lg-bold text-text_one mb-4'>Complete Transaction</h4>
                                    <div className='space-y-3'>
                                        <div className='flex justify-between'>
                                            <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Amount</span>
                                            <span className='font-poppins typo-body-md-semibold text-primary'>{formatToNaira(transactionAmount)}</span>
                                        </div>
                                    </div>
                                </div>

                                {isBuyer && (
                                    <button
                                        onClick={handleReleaseAndComplete}
                                        disabled={isLoading}
                                        className='w-full py-5 bg-primary text-white rounded-xl font-poppins typo-body-lg-bold hover:bg-primary/90 transition-colors disabled:opacity-50'
                                    >
                                        {isLoading ? 'Processing...' : 'Confirm Receipt & Release Funds'}
                                    </button>
                                )}

                                {isSeller && (
                                    <div className='border border-border-DEFAULT rounded-xl p-4 text-center'>
                                        <p className='font-poppins typo-body-md-regular text-text_four'>
                                            Awaiting buyer confirmation. Payment will auto-release after inspection period.
                                        </p>
                                    </div>
                                )}

                                <div className='bg-secondary/10 border border-secondary/30 rounded-xl p-4 space-y-3'>
                                    <div className='flex items-start gap-2'>
                                        <WarningIcon className='w-5 h-5 text-secondary flex-shrink-0 mt-0.5' />
                                        <p className='font-poppins typo-body-sm-regular text-text_one'>
                                            Only click this once you have inspected the item. This action is irreversible.
                                        </p>
                                    </div>
                                    <div className='flex items-start gap-2'>
                                        <ClockIcon className='w-5 h-5 text-text-muted-alt flex-shrink-0 mt-0.5' />
                                        <p className='font-poppins typo-body-sm-regular text-text_one'>
                                            Funds will automatically be released 48 hours after delivery.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ============ VERIFIED / RATE & REVIEW ============ */}
                {(transaction.status === 'VERIFIED' || showRateReview) && !['COMPLETED', 'RELEASED'].includes(transaction.status) && (
                    <div className='mt-8'>
                        <h3 className='font-poppins typo-body-lg-bold text-text_one mb-6'>Rate Your Experience</h3>

                        {/* Transaction info */}
                        <div className='border border-border-DEFAULT rounded-xl p-4 flex gap-4 mb-8'>
                            <div className='flex flex-col justify-center'>
                                <p className='font-poppins typo-body-md-semibold text-text_one'>
                                    Transaction {transactionRef}
                                </p>
                                <div className='flex items-center gap-4 mt-1'>
                                    <span className='font-poppins typo-body-sm-regular text-text-muted-alt'>Amount:</span>
                                    <span className='font-poppins typo-body-sm-semibold text-primary'>{formatToNaira(transactionAmount)}</span>
                                </div>
                                <p className='font-poppins typo-body-sm-regular text-text_four mt-0.5'>
                                    {isBuyer ? 'Seller' : 'Buyer'}: {isBuyer ? `${transaction.seller?.firstName} ${transaction.seller?.lastName}` : `${transaction.buyer?.firstName} ${transaction.buyer?.lastName}`}
                                </p>
                            </div>
                        </div>

                        {/* Two rating sections */}
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-8 mb-8'>
                            <div>
                                <p className='font-poppins typo-body-xs-semibold text-text_one uppercase tracking-wider mb-3'>ITEM CONDITION</p>
                                <div className='flex gap-1 mb-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type='button' onClick={() => setItemConditionRating(star)} className='focus:outline-none'>
                                            <StarIcon className={`w-7 h-7 ${star <= itemConditionRating ? 'text-secondary' : 'text-border-DEFAULT'}`} />
                                        </button>
                                    ))}
                                </div>
                                <p className='font-poppins typo-body-xs-regular text-primary'>&quot;Was the item as described?&quot;</p>
                            </div>
                            <div>
                                <p className='font-poppins typo-body-xs-semibold text-text_one uppercase tracking-wider mb-3'>
                                    {isBuyer ? 'SELLER' : 'BUYER'} PROFESSIONALISM
                                </p>
                                <div className='flex gap-1 mb-2'>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button key={star} type='button' onClick={() => setSellerRating(star)} className='focus:outline-none'>
                                            <StarIcon className={`w-7 h-7 ${star <= sellerRating ? 'text-secondary' : 'text-border-DEFAULT'}`} />
                                        </button>
                                    ))}
                                </div>
                                <p className='font-poppins typo-body-xs-regular text-primary'>&quot;Communication and speed?&quot;</p>
                            </div>
                        </div>

                        {/* Written Review */}
                        <div className='mb-8'>
                            <p className='font-poppins typo-body-md-regular text-text_one mb-2'>Written Review (Optional)</p>
                            <textarea
                                value={reviewText}
                                onChange={(e) => setReviewText(e.target.value)}
                                placeholder='Describe your experience in a few words'
                                rows={4}
                                className='w-full max-w-[500px] xs:max-w-full px-4 py-3 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary resize-none'
                            />
                        </div>

                        {/* Submit button */}
                        <button
                            onClick={handleSubmitReview}
                            disabled={itemConditionRating === 0 || sellerRating === 0 || isLoading}
                            className='w-full max-w-[400px] xs:max-w-full h-[48px] bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                        >
                            {isLoading ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                )}

                {/* ============ COMPLETED / RELEASED ============ */}
                {['COMPLETED', 'RELEASED'].includes(transaction.status) && !showRateReview && (
                    <div className='mt-8'>
                        <div className='bg-surface-success/40 border border-success-dark/20 rounded-2xl p-6 text-center mb-8'>
                            <div className='flex items-center justify-center gap-2 mb-2'>
                                <CheckCircle size={22} className='text-success-dark' />
                                <h3 className='font-poppins typo-heading-md-semibold text-success-dark'>
                                    Transaction Successful!
                                </h3>
                            </div>
                            <p className='font-poppins typo-body-md-regular text-text_four'>
                                {transaction.status === 'RELEASED'
                                    ? 'Delivery confirmed and funds have been released to the seller.'
                                    : 'This transaction has been completed successfully. Thank you!'}
                            </p>
                        </div>

                        <div className='border border-border-DEFAULT rounded-2xl p-6'>
                            <p className='font-poppins typo-body-md-semibold text-text-muted-alt uppercase tracking-wider mb-4'>TRANSACTION SUMMARY</p>
                            <div className='space-y-3'>
                                <div className='flex justify-between'>
                                    <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Reference</span>
                                    <span className='font-poppins typo-body-md-semibold text-text_one'>{transactionRef}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Type</span>
                                    <span className='font-poppins typo-body-md-regular text-text_one'>
                                        {transaction.type === 'SWAP' ? 'Item Exchange' : transaction.type === 'SWAP_WITH_CASH' ? 'Item + Cash' : 'Direct Purchase'}
                                    </span>
                                </div>
                                {transactionAmount > 0 && (
                                    <div className='flex justify-between'>
                                        <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Amount</span>
                                        <span className='font-poppins typo-body-md-semibold text-primary'>{formatToNaira(transactionAmount)}</span>
                                    </div>
                                )}
                                <div className='flex justify-between'>
                                    <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Seller</span>
                                    <span className='font-poppins typo-body-md-regular text-text_one'>{transaction.seller?.firstName} {transaction.seller?.lastName}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span className='font-poppins typo-body-md-regular text-text-muted-alt'>Buyer</span>
                                    <span className='font-poppins typo-body-md-regular text-text_one'>{transaction.buyer?.firstName} {transaction.buyer?.lastName}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Payment Success Modal */}
            {showPaymentSuccess && (
                <div className='fixed inset-0 bg-black/50 z-dropdown flex items-center justify-center p-4'>
                    <div className='bg-white rounded-2xl p-10 max-w-[500px] w-full text-center'>
                        <div className='flex justify-center mb-6'>
                            <div className='w-[100px] h-[100px] rounded-full bg-success-dark/10 flex items-center justify-center'>
                                <div className='w-[70px] h-[70px] rounded-full bg-success-dark flex items-center justify-center'>
                                    <CheckCircle size={40} className='text-white' />
                                </div>
                            </div>
                        </div>
                        <h2 className='font-poppins typo-heading-lg-bold text-text_one mb-4'>Payment Successful!</h2>
                        <p className='font-poppins typo-body-lg-regular text-text_four mb-10'>
                            {formatToNaira(transactionAmount)} has been paid successfully to Flipit MarketPlace
                        </p>
                        <button
                            onClick={() => setShowPaymentSuccess(false)}
                            className='w-[200px] h-[48px] bg-success-dark text-white rounded-lg font-poppins typo-body-lg-medium hover:bg-success-dark/90 transition-colors'
                        >
                            Ok!
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TransactionHubV2;
