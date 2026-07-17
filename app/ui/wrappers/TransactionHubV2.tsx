'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import {ChevronLeft, ChevronRight, ShieldCheck, CheckCircle, Lock} from 'lucide-react';
import {CopyIcon, MapPinIcon, WarningIcon, ClockIcon, StarIcon} from '../icons';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import {TransactionDTO, TransactionStatus} from '~/types/transaction';
import {useAppContext} from '~/contexts/AppContext';
import {formatToNaira} from '~/utils/helpers';
import ProgressTracker from '../transaction/ProgressTracker';
import TransactionService from '~/services/transaction.service';
import ReviewsService from '~/services/reviews.service';
import ErrorModal from '../common/modals/Error';
import ConfirmationModal from '../common/modals/ConfirmationModal';

interface Props {
    transaction: TransactionDTO;
}

// Seller Shipping View — shown to seller at shipping step
const SellerShippingView = ({transaction, onItemDeposited}: {transaction: TransactionDTO; onItemDeposited?: () => void}) => {
    const [selectedLogistics, setSelectedLogistics] = useState<string>('gig');
    const [codeGenerated, setCodeGenerated] = useState(false);
    const [timeLeft, setTimeLeft] = useState(47 * 3600 + 59 * 60 + 44);
    const uniqueCode = '8892 – 4930';
    const logisticsName = selectedLogistics === 'gig' ? 'GIG' : 'GUO';

    useEffect(() => {
        if (!codeGenerated) return;
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [codeGenerated]);

    const formatDeadline = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className='space-y-4 xs:space-y-3'>
            {/* Escrow confirmation banner — desktop only (mobile injected above timeline) */}
            <div className='xs:hidden bg-surface-success/40 border border-success-dark/20 rounded-2xl p-5 flex items-start gap-4'>
                <div className='flex-shrink-0 mt-1'>
                    <ShieldCheck size={28} className='text-primary' />
                </div>
                <div>
                    <h4 className='font-poppins typo-body-lg-bold text-primary mb-1'>Payment Secured in Escrow!</h4>
                    <p className='font-poppins typo-body-xs-regular text-text_four'>
                        The buyer has paid. Your funds are protected and held safely in escrow. Please proceed with shipping to trigger the release process.
                    </p>
                </div>
            </div>

            {/* Logistics selection */}
            <div className='border border-border-DEFAULT rounded-2xl p-6 xs:rounded-[20px] xs:bg-white xs:shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)]'>
                <h4 className='font-poppins typo-body-lg-semibold text-text_one text-center mb-5 xs:text-left xs:typo-body-md-semibold'>
                    Choose  Preferred Logistics Service
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
                    <button
                        onClick={() => setCodeGenerated(true)}
                        className='px-8 xs:w-full py-2.5 border border-primary text-primary rounded-lg font-poppins typo-body-md-medium hover:bg-primary hover:text-white transition-colors'
                    >
                        Generate code
                    </button>
                </div>
            </div>

            {codeGenerated && (
                <>
                    {/* Mobile: code + deadline side by side on page bg */}
                    <div className='hidden xs:flex items-center justify-between gap-4'>
                        <div className='border-[2px] border-dashed border-primary rounded-xl px-4 py-3 flex items-center gap-3 flex-shrink-0'>
                            <span className='font-poppins text-[20px] font-bold text-text_one'>{uniqueCode}</span>
                            <button onClick={() => navigator.clipboard.writeText(uniqueCode.replace(/[\s–]/g, ''))} className='text-primary'>
                                <CopyIcon className='w-5 h-5' />
                            </button>
                        </div>
                        <div className='text-right'>
                            <p className='font-poppins text-[12px] font-normal text-text-muted-alt'>Shipping Deadline</p>
                            <p className='font-poppins text-[20px] font-bold text-accent-coral'>{formatDeadline(timeLeft)}</p>
                        </div>
                    </div>

                    {/* Mobile: item summary card */}
                    <div className='hidden xs:block border border-border-DEFAULT rounded-[20px] bg-white shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] p-4'>
                        <div className='flex items-start gap-3 mb-4'>
                            <Image
                                src='/images/placeholders/placeholder-product.svg'
                                alt='item'
                                width={80}
                                height={80}
                                className='w-[80px] h-[80px] rounded-xl object-cover flex-shrink-0'
                            />
                            <div className='min-w-0'>
                                <p className='font-poppins text-[14px] font-semibold text-text_one line-clamp-2 leading-snug'>
                                    {transaction.description || 'Item'}
                                </p>
                                <span className='inline-block mt-1.5 bg-surface-success/40 text-success-dark font-poppins text-[11px] font-medium px-2.5 py-0.5 rounded-full'>
                                    Cash only
                                </span>
                            </div>
                        </div>
                        <div className='space-y-2'>
                            <div className='flex justify-between items-center'>
                                <span className='font-poppins text-[13px] font-normal text-text-muted-alt'>Shipping method</span>
                                <span className='font-poppins text-[13px] font-semibold text-text_one'>{logisticsName} Logistics services</span>
                            </div>
                            <div className='flex justify-between items-start'>
                                <span className='font-poppins text-[13px] font-normal text-text-muted-alt'>Recipient</span>
                                <div className='text-right'>
                                    <p className='font-poppins text-[13px] font-semibold text-text_one'>
                                        {transaction.buyer?.firstName} {transaction.buyer?.lastName}
                                    </p>
                                    <p className='font-poppins text-[12px] font-normal text-text-muted-alt'>Ikeja, Lagos</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mobile: action buttons */}
                    <div className='hidden xs:flex flex-col gap-3 mt-4'>
                        <button
                            onClick={onItemDeposited}
                            className='w-full py-3 bg-primary text-white rounded-xl font-poppins text-[16px] font-medium'
                        >
                            I have deposited the  item
                        </button>
                        <button className='w-full py-3 border border-primary text-primary rounded-xl font-poppins text-[16px] font-medium'>
                            Contact Support
                        </button>
                    </div>

                    {/* Desktop: code + deadline card */}
                    <div className='xs:hidden border border-border-DEFAULT rounded-2xl p-6 flex items-center justify-between'>
                        <div>
                            <p className='font-poppins typo-caption text-text-muted-alt uppercase tracking-wider mb-2'>UNIQUE CODE</p>
                            <div className='border-[3px] border-dashed border-primary bg-surface-teal rounded-xl px-5 py-4 flex items-center gap-4 w-max'>
                                <span className='font-poppins typo-heading-md-bold text-primary'>{uniqueCode}</span>
                                <button onClick={() => navigator.clipboard.writeText(uniqueCode.replace(/[\s–]/g, ''))} className='text-primary hover:opacity-70'>
                                    <CopyIcon className='w-5 h-5' />
                                </button>
                            </div>
                        </div>
                        <div className='h-[80px] w-[1px] bg-border-DEFAULT mx-8'></div>
                        <div>
                            <p className='font-poppins typo-caption text-text-muted-alt uppercase tracking-wider mb-2'>SHIPPING DEADLINE</p>
                            <div className='border border-border-DEFAULT rounded-xl px-8 py-4'>
                                <span className='font-poppins typo-heading-md-bold text-accent-coral'>{formatDeadline(timeLeft)}</span>
                            </div>
                        </div>
                    </div>

                    {/* Desktop: logistics instructions */}
                    <div className='xs:hidden border border-border-DEFAULT rounded-2xl p-6'>
                        <h4 className='font-poppins typo-body-lg-bold text-text_one mb-1'>{logisticsName} Logistics Instructions</h4>
                        <p className='font-poppins typo-body-xs-regular text-text-muted-alt mb-5'>Please follow these steps to complete your part of the transaction.</p>
                        <hr className='border-border-DEFAULT mb-5' />
                        <div className='space-y-5'>
                            {[
                                {title: 'Securely pack your items', desc: 'Ensure items are padded to protect from damage during transportation'},
                                {title: `Visit the ${logisticsName} Logistics Outlet`, desc: `Drop off the package at any authorized ${logisticsName} outlet near you.`},
                                {title: 'Present Your Shipping Code', desc: `Show the agent your unique code ${uniqueCode}`},
                            ].map((step, i) => (
                                <div key={i} className='flex items-start gap-3'>
                                    <CheckCircle size={20} className='text-success-dark flex-shrink-0 mt-0.5' />
                                    <div>
                                        <p className='font-poppins typo-body-md-bold text-text_one'>{step.title}</p>
                                        <p className='font-poppins typo-body-xs-regular text-text-muted-alt'>{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Desktop: order summary */}
                    <div className='xs:hidden border border-border-DEFAULT rounded-2xl p-6'>
                        <h4 className='font-poppins typo-body-lg-bold text-text_one mb-4'>Order Summary</h4>
                        <div className='space-y-2'>
                            <div className='flex justify-between'>
                                <span className='font-poppins typo-body-md-regular text-text_one'>Buyer</span>
                                <span className='font-poppins typo-body-md-regular text-text_one'>{transaction.buyer?.firstName} {transaction.buyer?.lastName}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='font-poppins typo-body-md-regular text-text_one'>Amount</span>
                                <span className='font-poppins typo-body-md-semibold text-primary'>{formatToNaira(transaction.amount || 0)}</span>
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
    const [showPaymentTransfer, setShowPaymentTransfer] = useState(false);
    // When buyer arrives via "Proceed to checkout", force the Order Review (PENDING) view
    // even if the backend already has the transaction at SUCCESS.
    const [checkoutMode, setCheckoutMode] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30 * 60);
    const [autoReleaseTime, setAutoReleaseTime] = useState(47 * 3600 + 59 * 60 + 44);
    const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
    const [showRateReview, setShowRateReview] = useState(false);
    const [itemConditionRating, setItemConditionRating] = useState(0);
    const [sellerRating, setSellerRating] = useState(0);
    const [reviewText, setReviewText] = useState('');
    const [reviewPhotos, setReviewPhotos] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [showCancelConfirm, setShowCancelConfirm] = useState(false);

    // Countdown timer for payment transfer screen
    useEffect(() => {
        if (!showPaymentTransfer) return;
        setTimeLeft(30 * 60);
        const interval = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [showPaymentTransfer]);

    // Auto-release countdown for ARRIVED (confirm delivery) state
    useEffect(() => {
        if (transaction.status !== 'ARRIVED') return;
        const interval = setInterval(() => {
            setAutoReleaseTime(prev => {
                if (prev <= 0) { clearInterval(interval); return 0; }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [transaction.status]);

    const formatTime = (secs: number) => {
        const m = Math.floor(secs / 60);
        const s = secs % 60;
        return `${m}m ${s.toString().padStart(2, '0')}s`;
    };

    const formatAutoRelease = (secs: number) => {
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, '0')} : ${m.toString().padStart(2, '0')} : ${s.toString().padStart(2, '0')}`;
    };

    const userRole = TransactionService.getUserRole(transaction, user?.userId ? parseInt(user.userId) : 0);
    const isSeller = userRole === 'seller';
    const isBuyer = userRole === 'buyer';

    // If buyer just came from "Proceed to checkout", show Order Review first (PENDING view)
    // regardless of the actual transaction status on the backend.
    // Note: intentionally not gated on isBuyer — user context may not be resolved on first
    // render, causing isBuyer to be false. The flag can only exist if the buyer set it.
    useEffect(() => {
        const flag = sessionStorage.getItem(`checkout_pending_${transaction.id}`);
        if (flag) {
            sessionStorage.removeItem(`checkout_pending_${transaction.id}`);
            setCheckoutMode(true);
        }
    }, [transaction.id]);

    // When in checkoutMode, render as if the transaction is PENDING (Order Review)
    // until the buyer completes the payment flow.
    const effectiveStatus = checkoutMode ? 'PENDING' : transaction.status;

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
                    {label: 'Exchange'},
                    {label: 'Delivery'},
                    {label: 'Review Trade'}
                ],
                statusMap: {
                    PENDING: 0,
                    SUCCESS: 2,
                    DELIVERED: 3,
                    ARRIVED: 3,
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
                    SUCCESS: 2,
                    DELIVERED: 3,
                    ARRIVED: 3,
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
                ARRIVED: 2,
                VERIFIED: 3,
                COMPLETED: 3,
                RELEASED: 3,
                CANCELLED: 0,
                FAILED: 0,
            } as Record<TransactionStatus, number>
        };
    };

    const flowConfig = getFlowConfig();
    const currentStepIndex = flowConfig.statusMap[effectiveStatus] ?? 0;

    const getProgressStatus = (): 'active' | 'completed' | 'cancelled' => {
        if (['COMPLETED', 'RELEASED'].includes(effectiveStatus)) return 'completed';
        if (['CANCELLED', 'FAILED'].includes(effectiveStatus)) return 'cancelled';
        return 'active';
    };

    const handleCancelTransaction = () => {
        setShowCancelConfirm(true);
    };

    const executeCancelTransaction = async () => {
        setShowCancelConfirm(false);
        setIsLoading(true);
        const {data, error} = await TransactionService.cancelTransaction(transaction.id);
        setIsLoading(false);
        if (error) { setErrorMessage('Failed to cancel transaction. Please try again.'); return; }
        setCheckoutMode(false);
        setTransaction({...transaction, ...(data || {status: 'CANCELLED'})});
    };

    const handleVerifyPayment = async () => {
        setIsLoading(true);
        // If the transaction is already at SUCCESS (real backend creates it there),
        // skip the verify API call and just confirm to the buyer.
        if (transaction.status === 'SUCCESS') {
            setIsLoading(false);
            setShowPaymentTransfer(false);
            setShowPaymentSuccess(true);
            setCheckoutMode(false);
            localStorage.setItem(`tx_status_${transaction.id}`, 'SUCCESS');
            return;
        }
        const {data, error} = await TransactionService.verifyTransaction(transaction.id);
        setIsLoading(false);
        if (error) { setErrorMessage('Payment verification failed. Please try again.'); return; }
        setShowPaymentTransfer(false);
        setShowPaymentSuccess(true);
        setCheckoutMode(false);
        localStorage.setItem(`tx_status_${transaction.id}`, 'SUCCESS');
        setTransaction({...transaction, ...(data || {status: 'SUCCESS'})});
    };

    const handleReleaseAndComplete = async () => {
        setIsLoading(true);
        const {error} = await TransactionService.confirmDelivery(transaction.id);
        if (!error) await TransactionService.releaseTransaction(transaction.id);
        setIsLoading(false);
        if (error) { setErrorMessage('Failed to confirm receipt. Please try again.'); return; }
        setTransaction({...transaction, status: 'VERIFIED'});
        setShowRateReview(true);
    };

    const handleSubmitReview = async () => {
        setIsLoading(true);
        const otherUserId = isBuyer ? transaction.seller.id : transaction.buyer.id;
        const avgRating = Math.round((itemConditionRating + sellerRating) / 2);
        await ReviewsService.createReview({
            userId: otherUserId,
            itemId: transaction.orderId || 0,
            rating: avgRating,
            message: reviewText,
        });
        const {data} = await TransactionService.completeTransaction(transaction.id);
        setIsLoading(false);
        setTransaction({...transaction, ...(data || {status: 'COMPLETED'})});
        setShowRateReview(false);
    };

    // Mobile header title based on effective status
    const getMobileTitle = () => {
        if (['CANCELLED', 'FAILED'].includes(effectiveStatus)) return 'Order Summary';
        switch (effectiveStatus) {
            case 'PENDING': return 'Order Summary';
            case 'SUCCESS': return 'Shipping';
            case 'DELIVERED': return 'Track your Item';
            case 'ARRIVED': return 'Confirm Delivery';
            case 'VERIFIED': return 'Rate & Review';
            case 'COMPLETED':
            case 'RELEASED': return 'Transaction Complete';
            default: return 'Order Summary';
        }
    };

    return (
        <div className='mx-[120px] xs:mx-0 mb-10 mt-6 xs:mt-0 xs:mb-6 xs:pb-24'>
            {errorMessage && (
                <div className='fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-modal'>
                    <div className='relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6'>
                        <ErrorModal message={errorMessage} onClose={() => setErrorMessage('')} />
                    </div>
                </div>
            )}
            {showCancelConfirm && (
                <ConfirmationModal
                    title='Cancel Transaction'
                    message='Are you sure you want to cancel this transaction? This action cannot be undone.'
                    confirmText='Yes, Cancel'
                    cancelText='Go Back'
                    isDestructive
                    isLoading={isLoading}
                    onConfirm={executeCancelTransaction}
                    onCancel={() => setShowCancelConfirm(false)}
                />
            )}
            {/* Mobile header — xs only */}
            <div className='hidden xs:flex items-center gap-5 px-6 pt-6 pb-4'>
                <button
                    onClick={() => router.back()}
                    className='w-11 h-11 flex items-center justify-center flex-shrink-0 rounded-full bg-black/5'
                >
                    <ChevronLeft size={24} className='text-text_one' />
                </button>
                <h1 className='font-poppins text-[20px] font-semibold leading-[1.4] text-text_one'>{getMobileTitle()}</h1>
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
            <div className='bg-white rounded-xl p-8 xs:p-0 xs:bg-transparent xs:rounded-none xs:shadow-none shadow-md'>
                {/* Order ID above timeline — mobile only, non-PENDING states */}
                {!['PENDING', 'CANCELLED', 'FAILED'].includes(effectiveStatus) && (
                    <p className='hidden xs:block font-poppins text-[16px] font-bold text-text_one px-6 pb-3'>
                        Order ID:#{transaction.id}
                    </p>
                )}

                {/* Escrow banner — mobile only, seller at SUCCESS */}
                {effectiveStatus === 'SUCCESS' && isSeller && (
                    <div className='hidden xs:flex mx-6 mb-3 bg-surface-success/40 border border-success-dark/20 rounded-2xl p-4 items-start gap-3'>
                        <div className='flex-shrink-0 mt-0.5'>
                            <ShieldCheck size={24} className='text-primary' />
                        </div>
                        <div>
                            <h4 className='font-poppins text-[14px] font-bold text-primary mb-1'>Payment Secured in Escrow!</h4>
                            <p className='font-poppins text-[12px] font-normal text-text_four'>
                                The buyer has paid. Your funds are protected and held safely in escrow. Please proceed with shipping to trigger the release process.
                            </p>
                        </div>
                    </div>
                )}

                {/* Transaction Timeline — wrapped in card on mobile */}
                <div className='xs:mx-6 xs:bg-white xs:border xs:border-border-DEFAULT xs:rounded-[20px] xs:p-4 xs:mb-2 xs:shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)]'>
                <h2 className='font-poppins typo-heading-md-semibold text-text_one mb-4 xs:text-[16px] xs:text-text-muted-alt xs:font-medium xs:mb-2'>Transaction Timeline</h2>

                {/* Progress Tracker */}
                <ProgressTracker steps={flowConfig.steps} currentStep={currentStepIndex} status={getProgressStatus()} />
                </div>

                {/* ============ CANCELLED / FAILED STATE ============ */}
                {['CANCELLED', 'FAILED'].includes(effectiveStatus) && (
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
                {effectiveStatus === 'PENDING' && (
                    <>
                        {/* ===== MOBILE PENDING VIEW ===== */}
                        <div className='hidden xs:block px-6'>
                            {/* Order ID */}
                            <p className='font-poppins text-[16px] font-medium text-text_one mb-3'>
                                Order ID:#{transaction.id}
                            </p>

                            {/* Item card */}
                            <div className='bg-white border border-border-DEFAULT rounded-[20px] shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] flex items-center gap-3 px-4 py-3 mb-3'>
                                <div className='w-[111px] h-[110px] rounded-[20px] bg-gray-100 overflow-hidden flex-shrink-0'>
                                    <Image src='/images/placeholders/placeholder-product.svg' alt='item' width={91} height={90} className='w-full h-full object-cover' />
                                </div>
                                <div className='flex-1 min-w-0'>
                                    <p className='font-poppins typo-body-md-semibold text-text_two line-clamp-2 leading-tight'>{transaction.description || 'Item'}</p>
                                    <div className='mt-1'>
                                        <TransactionTypeBadge acceptCash={transaction.type !== 'SWAP'} hasSwapItems={transaction.type !== 'CASH_ONLY'} />
                                    </div>
                                    <p className='font-poppins typo-body-md-semibold text-primary mt-1'>{formatToNaira(transactionAmount)}</p>
                                </div>
                            </div>

                            {/* Payment Details */}
                            {transactionAmount > 0 && (
                                <div className='mb-8'>
                                    <h4 className='font-poppins text-[14px] font-semibold text-text_one mb-1.5'>Payment Details</h4>
                                    <div className='bg-white border border-border-DEFAULT rounded-[20px] shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] p-4 flex flex-col gap-9'>
                                        <div className='space-y-2'>
                                            <div className='flex justify-between'>
                                                <span className='font-poppins text-[14px] font-medium text-text_two'>Agreed Price</span>
                                                <span className='font-poppins text-[14px] font-bold text-text_one'>{formatToNaira(transactionAmount)}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='font-poppins text-[14px] font-medium text-text_two'>Shipping Fee</span>
                                                <span className='font-poppins text-[14px] font-bold text-text_one'>{formatToNaira(6000)}</span>
                                            </div>
                                            <div className='flex justify-between'>
                                                <span className='font-poppins text-[14px] font-medium text-text_two'>Platform Service Fee</span>
                                                <span className='font-poppins text-[14px] font-bold text-text_one'>{formatToNaira(5000)}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <hr className='border-t border-black mb-9' />
                                            <div className='flex justify-between'>
                                                <span className='font-poppins text-[16px] font-bold text-primary'>Total Amount</span>
                                                <span className='font-poppins text-[16px] font-bold text-primary'>{formatToNaira(transactionAmount + 11000)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className='space-y-6 mb-8'>
                                {isBuyer && (
                                    <button
                                        onClick={() => setShowPaymentTransfer(true)}
                                        disabled={isLoading}
                                        className='w-full py-[10px] bg-primary text-white rounded-lg font-poppins typo-body-lg-medium flex items-center justify-center gap-2 disabled:opacity-50'
                                    >
                                        Proceed to Payment
                                        <ChevronRight size={20} />
                                    </button>
                                )}
                                <button
                                    onClick={handleCancelTransaction}
                                    disabled={isLoading}
                                    className='w-full py-[10px] border-2 border-primary text-primary rounded-lg font-poppins typo-body-lg-medium disabled:opacity-50'
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Safe Checkout */}
                            <div className='flex items-center gap-3 pb-8'>
                                <Lock size={24} className='text-text_four flex-shrink-0' />
                                <div>
                                    <p className='font-poppins text-[10px] font-semibold text-text_one uppercase tracking-wide'>SAFE CHECKOUT</p>
                                    <p className='font-poppins text-[10px] font-normal text-text-muted-alt leading-relaxed'>All data is encrypted and protected by industrial grade security standard</p>
                                </div>
                            </div>
                        </div>

                        {/* ===== DESKTOP PENDING VIEW ===== */}
                        <div className='xs:hidden'>
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
                        </div>
                    </>
                )}

                {/* ============ SUCCESS: Payment confirmed → Shipping ============ */}
                {effectiveStatus === 'SUCCESS' && (
                    <div className='mt-8'>
                        {isBuyer && (
                            <>
                                {/* Mobile buyer view — just the status message */}
                                <div className='hidden xs:block px-6 mt-4'>
                                    <p className='font-poppins typo-body-md-regular text-text_one'>
                                        Seller has been notified of payment and has begun the shipping process.{' '}
                                        <Link href='/notifications' className='text-primary underline font-medium'>
                                            Check notifications for Shipping details.
                                        </Link>
                                    </p>
                                </div>

                                {/* Desktop buyer view — banner + message */}
                                <div className='xs:hidden space-y-4'>
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
                            </>
                        )}

                        {isSeller && (
                            <div className='xs:px-6'>
                                <SellerShippingView
                                    transaction={transaction}
                                    onItemDeposited={async () => {
                                        const {data} = await TransactionService.shipItem(transaction.id);
                                        setTransaction({...transaction, ...(data || {status: 'DELIVERED'})});
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}

                {/* ============ DELIVERED: Confirm delivery ============ */}
                {effectiveStatus === 'DELIVERED' && !showRateReview && (
                    <div className='mt-8'>

                        {/* ===== MOBILE DELIVERED — SELLER: track your item ===== */}
                        {isSeller && (
                        <div className='hidden xs:block px-6 pb-6'>
                            <h3 className='font-poppins text-[18px] font-semibold text-text_one mb-3'>Live Transit</h3>
                            <div className='w-full h-[220px] rounded-2xl overflow-hidden mb-4'>
                                <iframe
                                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46!2d3.1791!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1699000000000'
                                    width='100%' height='100%' style={{border: 0}} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade'
                                />
                            </div>
                            <p className='font-poppins text-[13px] font-normal text-text-muted-alt mb-0.5'>Estimated Time of Arrival</p>
                            <p className='font-poppins text-[16px] font-bold text-text_one mb-4'>March 16, 2024 10:00 AM</p>
                            <div className='bg-white border border-border-DEFAULT rounded-2xl p-4 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)]'>
                                <h4 className='font-poppins text-[16px] font-semibold text-text_one mb-3'>Tracking information</h4>
                                <div className='flex items-center gap-2 mb-1'>
                                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-primary'><rect x='1' y='3' width='15' height='13'/><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'/><circle cx='5.5' cy='18.5' r='2.5'/><circle cx='18.5' cy='18.5' r='2.5'/></svg>
                                    <span className='font-poppins text-[14px] font-semibold text-primary'>GIG Logistics</span>
                                </div>
                                <p className='font-poppins text-[13px] font-normal text-text_one mb-4'>
                                    Tracking # : <span className='font-semibold'>FLPT 88924930</span>
                                </p>
                                <hr className='border-border-DEFAULT mb-4' />
                                <div className='grid grid-cols-2 gap-y-4'>
                                    <div>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Status</p>
                                        <span className='inline-block bg-blue-50 text-blue-500 font-poppins text-[12px] font-medium px-3 py-1 rounded-full'>In Transit</span>
                                    </div>
                                    <div>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Last Location</p>
                                        <p className='font-poppins text-[13px] text-text_one'>Enugu, Enugu</p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Last Update</p>
                                        <p className='font-poppins text-[13px] text-text_one'>Package left facility in Enugu March 7, 2024</p>
                                    </div>
                                </div>
                            </div>
                            <p className='font-poppins text-[13px] text-text-muted-alt text-center mt-6'>Waiting for buyer to confirm receipt</p>
                        </div>
                        )}

                        {/* ===== MOBILE DELIVERED — BUYER: track your item ===== */}
                        {isBuyer && (
                        <div className='hidden xs:block px-6 pb-6'>
                            <h3 className='font-poppins text-[18px] font-semibold text-text_one mb-3'>Live Transit</h3>
                            <div className='w-full h-[220px] rounded-2xl overflow-hidden mb-4'>
                                <iframe
                                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46!2d3.1791!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1699000000000'
                                    width='100%' height='100%' style={{border: 0}} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade'
                                />
                            </div>
                            <p className='font-poppins text-[13px] font-normal text-text-muted-alt mb-0.5'>Estimated Time of Arrival</p>
                            <p className='font-poppins text-[16px] font-bold text-text_one mb-4'>March 16, 2024 10:00 AM</p>
                            <div className='bg-white border border-border-DEFAULT rounded-2xl p-4 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] mb-6'>
                                <h4 className='font-poppins text-[16px] font-semibold text-text_one mb-3'>Tracking information</h4>
                                <div className='flex items-center gap-2 mb-1'>
                                    <svg width='20' height='20' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='text-primary'><rect x='1' y='3' width='15' height='13'/><polygon points='16 8 20 8 23 11 23 16 16 16 16 8'/><circle cx='5.5' cy='18.5' r='2.5'/><circle cx='18.5' cy='18.5' r='2.5'/></svg>
                                    <span className='font-poppins text-[14px] font-semibold text-primary'>GIG Logistics</span>
                                </div>
                                <p className='font-poppins text-[13px] text-text_one mb-4'>Tracking # : <span className='font-semibold'>FLPT 88924930</span></p>
                                <hr className='border-border-DEFAULT mb-4' />
                                <div className='grid grid-cols-2 gap-y-4'>
                                    <div>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Status</p>
                                        <span className='inline-block bg-blue-50 text-blue-500 font-poppins text-[12px] font-medium px-3 py-1 rounded-full'>In Transit</span>
                                    </div>
                                    <div>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Last Location</p>
                                        <p className='font-poppins text-[13px] text-text_one'>Enugu, Enugu</p>
                                    </div>
                                    <div className='col-span-2'>
                                        <p className='font-poppins text-[12px] text-text-muted-alt mb-1'>Last Update</p>
                                        <p className='font-poppins text-[13px] text-text_one'>Package left facility in Enugu March 7, 2024</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        )}

                        {/* ===== DESKTOP DELIVERED VIEW ===== */}
                        <div className='xs:hidden'>
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
                        </div> {/* end xs:hidden desktop view */}
                    </div>
                )}

                {/* ============ ARRIVED: buyer confirms delivery ============ */}
                {effectiveStatus === 'ARRIVED' && (
                    <div className='mt-8'>
                        {/* Mobile: Confirm Delivery page */}
                        {isBuyer && (
                        <div className='hidden xs:block px-6 pb-8'>
                            <div className='flex items-center justify-between mb-3'>
                                <h3 className='font-poppins text-[18px] font-semibold text-text_one'>Delivery Confirmation</h3>
                                <div className='flex items-center gap-1.5 bg-success-dark text-white rounded-full px-3 py-1'>
                                    <CheckCircle size={14} />
                                    <span className='font-poppins text-[12px] font-semibold'>Arrived</span>
                                </div>
                            </div>
                            <div className='w-full h-[230px] rounded-2xl overflow-hidden mb-4'>
                                <iframe
                                    src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d253682.46!2d3.1791!3d6.5244!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b2ae68280c1%3A0xdc9e87a367c3d9cb!2sLagos!5e0!3m2!1sen!2sng!4v1699000000000'
                                    width='100%' height='100%' style={{border: 0}} allowFullScreen loading='lazy' referrerPolicy='no-referrer-when-downgrade'
                                />
                            </div>
                            <div className='bg-white border border-border-DEFAULT rounded-2xl p-3 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] flex items-center gap-3 mb-4'>
                                <Image src='/images/placeholders/placeholder-product.svg' alt='item' width={80} height={80} className='w-[80px] h-[80px] rounded-xl object-cover flex-shrink-0' />
                                <div className='min-w-0'>
                                    <p className='font-poppins text-[14px] font-semibold text-text_one line-clamp-2 leading-snug'>{transaction.description || 'Item'}</p>
                                    <span className='inline-block mt-1 bg-surface-success/40 text-success-dark font-poppins text-[11px] font-medium px-2.5 py-0.5 rounded-full'>Cash only</span>
                                    <p className='font-poppins text-[14px] font-bold text-primary mt-1'>{formatToNaira(transactionAmount)}</p>
                                </div>
                            </div>
                            <div className='flex items-center justify-between gap-4 mb-4'>
                                <div>
                                    <p className='font-poppins text-[10px] font-semibold text-text-muted-alt uppercase tracking-widest mb-1'>Auto - Release in</p>
                                    <p className='font-poppins text-[22px] font-bold text-accent-coral leading-none'>{formatAutoRelease(autoReleaseTime)}</p>
                                </div>
                                <button
                                    onClick={handleReleaseAndComplete}
                                    disabled={isLoading}
                                    className='bg-primary text-white font-poppins text-[15px] font-semibold px-5 py-3 rounded-xl whitespace-nowrap disabled:opacity-50'
                                >
                                    {isLoading ? 'Processing...' : 'Confirm Receipt'}
                                </button>
                            </div>
                            <div className='border border-warning-dark/50 bg-surface-coral rounded-xl p-4 mb-5 space-y-3'>
                                <div className='flex items-start gap-3'>
                                    <WarningIcon className='w-5 h-5 text-warning-dark flex-shrink-0 mt-0.5' />
                                    <p className='font-poppins text-[13px] font-normal text-text_one'>Only click this once you have inspected the item. This action is irreversible and funds would be immediately available to seller.</p>
                                </div>
                                <div className='flex items-start gap-3'>
                                    <ClockIcon className='w-5 h-5 text-text-muted-alt flex-shrink-0 mt-0.5' />
                                    <p className='font-poppins text-[13px] font-normal text-text_one'>Funds would automatically be released 48hours after delivery so ensure that you confirm receipt and condition of item immediately</p>
                                </div>
                            </div>
                            <p className='font-poppins text-[13px] font-normal text-text-muted-alt text-center'>Report a problem with delivery</p>
                        </div>
                        )}

                        {/* Desktop: same confirm delivery view */}
                        {isBuyer && (
                        <div className='xs:hidden'>
                            <div className='border border-border-DEFAULT rounded-2xl p-5 flex items-center justify-between mb-8'>
                                <div>
                                    <h3 className='font-poppins typo-body-lg-bold text-text_one'>Delivery Confirmation</h3>
                                    <p className='font-poppins typo-body-md-regular text-text_four mt-1'>{transaction.description || 'Item has been delivered'}</p>
                                </div>
                                <div className='flex items-center gap-1.5 border border-success-dark/20 rounded-full px-4 py-1.5'>
                                    <CheckCircle size={16} className='text-success-dark' />
                                    <span className='font-poppins typo-body-md-medium text-success-dark'>Arrived</span>
                                </div>
                            </div>
                            <button
                                onClick={handleReleaseAndComplete}
                                disabled={isLoading}
                                className='w-full py-5 bg-primary text-white rounded-xl font-poppins typo-body-lg-bold hover:bg-primary/90 transition-colors disabled:opacity-50'
                            >
                                {isLoading ? 'Processing...' : 'Confirm Receipt & Release Funds'}
                            </button>
                        </div>
                        )}
                    </div>
                )}

                {/* ============ VERIFIED / RATE & REVIEW ============ */}
                {(effectiveStatus === 'VERIFIED' || showRateReview) && !['COMPLETED', 'RELEASED'].includes(effectiveStatus) && (
                    <div className='mt-8'>
                        {/* ===== DESKTOP Rate & Review ===== */}
                        <div className='xs:hidden'>
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
                            <div className='grid grid-cols-2 gap-8 mb-8'>
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
                                    className='w-full max-w-[500px] px-4 py-3 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary resize-none'
                                />
                            </div>

                            {/* Submit button */}
                            <button
                                onClick={handleSubmitReview}
                                disabled={itemConditionRating === 0 || sellerRating === 0 || isLoading}
                                className='w-full max-w-[400px] h-[48px] bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                            >
                                {isLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>

                        {/* ===== MOBILE Rate & Review ===== */}
                        <div className='hidden xs:block px-6 pb-28'>
                            {/* "Rate your experience" heading */}
                            <h3 className='font-poppins text-[20px] font-bold text-text_one mb-4'>Rate your experience</h3>

                            {/* Item info card */}
                            <div className='bg-white border border-border-DEFAULT rounded-2xl p-3 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] flex items-center gap-3 mb-6'>
                                <Image
                                    src='/images/placeholders/placeholder-product.svg'
                                    alt='item'
                                    width={72}
                                    height={72}
                                    className='w-[72px] h-[72px] rounded-xl object-cover flex-shrink-0'
                                />
                                <div className='min-w-0'>
                                    <p className='font-poppins text-[14px] font-semibold text-text_one line-clamp-2 leading-snug'>
                                        {transaction.description || 'Item'}
                                    </p>
                                    <p className='font-poppins text-[12px] font-normal text-text-muted-alt mt-0.5'>Order ID:#{transaction.id}</p>
                                    <p className='font-poppins text-[13px] font-bold text-text_one mt-0.5'>
                                        {isBuyer ? 'Seller' : 'Buyer'} : {isBuyer
                                            ? `${transaction.seller?.firstName} ${transaction.seller?.lastName}`
                                            : `${transaction.buyer?.firstName} ${transaction.buyer?.lastName}`}
                                    </p>
                                </div>
                            </div>

                            {/* Star ratings — two columns */}
                            <div className='grid grid-cols-2 gap-x-4 gap-y-5 mb-6'>
                                <div>
                                    <p className='font-poppins text-[11px] font-semibold text-text-muted-alt uppercase tracking-wider mb-2'>ITEM CONDITION</p>
                                    <div className='flex gap-1 mb-1'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type='button' onClick={() => setItemConditionRating(star)} className='focus:outline-none'>
                                                <StarIcon className={`w-6 h-6 ${star <= itemConditionRating ? 'text-secondary' : 'text-border-DEFAULT'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className='font-poppins text-[11px] font-normal text-primary italic'>&ldquo;Was the item as described?&rdquo;</p>
                                </div>
                                <div>
                                    <p className='font-poppins text-[11px] font-semibold text-text-muted-alt uppercase tracking-wider mb-2'>
                                        {isBuyer ? 'SELLER' : 'BUYER'} PROFESSIONALISM
                                    </p>
                                    <div className='flex gap-1 mb-1'>
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type='button' onClick={() => setSellerRating(star)} className='focus:outline-none'>
                                                <StarIcon className={`w-6 h-6 ${star <= sellerRating ? 'text-secondary' : 'text-border-DEFAULT'}`} />
                                            </button>
                                        ))}
                                    </div>
                                    <p className='font-poppins text-[11px] font-normal text-primary italic'>&ldquo;Communication and speed?&rdquo;</p>
                                </div>
                            </div>

                            {/* Written review */}
                            <div className='mb-6'>
                                <p className='font-poppins text-[16px] font-semibold text-text_one mb-2'>Written Review (Optional )</p>
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder='Describe your experience in a few words'
                                    rows={4}
                                    className='w-full px-4 py-3 border border-border-DEFAULT rounded-xl font-poppins text-[14px] outline-none focus:border-primary resize-none'
                                />
                            </div>

                            {/* Add Photos */}
                            <div className='mb-8'>
                                <p className='font-poppins text-[13px] font-bold text-text_one uppercase tracking-wider mb-3'>ADD PHOTOS</p>
                                <div className='flex gap-3 mb-2'>
                                    {reviewPhotos.map((src, i) => (
                                        <div key={i} className='w-[72px] h-[72px] rounded-xl overflow-hidden border border-border-DEFAULT flex-shrink-0'>
                                            <Image src={src} alt={`photo ${i + 1}`} width={72} height={72} className='w-full h-full object-cover' />
                                        </div>
                                    ))}
                                    {reviewPhotos.length < 3 && (
                                        <label className='w-[72px] h-[72px] rounded-xl border-2 border-border-DEFAULT flex items-center justify-center cursor-pointer flex-shrink-0 bg-white'>
                                            <svg width='28' height='28' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' className='text-text-muted-alt'>
                                                <path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/><circle cx='12' cy='13' r='4'/>
                                            </svg>
                                            <input type='file' accept='image/*' className='hidden' onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (!file) return;
                                                const reader = new FileReader();
                                                reader.onload = (ev) => setReviewPhotos(prev => [...prev, ev.target?.result as string].slice(0, 3));
                                                reader.readAsDataURL(file);
                                            }} />
                                        </label>
                                    )}
                                </div>
                                <p className='font-poppins text-[12px] font-normal text-text-muted-alt'>Upload up to 3 photos to help other buyers</p>
                            </div>
                        </div>

                        {/* Mobile: sticky bottom buttons */}
                        <div className='hidden xs:flex fixed bottom-0 left-0 right-0 gap-3 px-6 py-4 bg-white border-t border-border-DEFAULT z-modal'>
                            <button
                                onClick={async () => {
                                    setIsLoading(true);
                                    const {data} = await TransactionService.completeTransaction(transaction.id);
                                    setIsLoading(false);
                                    setTransaction({...transaction, ...(data || {status: 'COMPLETED'})});
                                    setShowRateReview(false);
                                }}
                                disabled={isLoading}
                                className='flex-1 py-3 border border-primary text-primary rounded-xl font-poppins text-[16px] font-medium disabled:opacity-50'
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={itemConditionRating === 0 || sellerRating === 0 || isLoading}
                                className='flex-1 py-3 bg-primary text-white rounded-xl font-poppins text-[16px] font-medium disabled:opacity-50'
                            >
                                {isLoading ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                )}

                {/* ============ COMPLETED / RELEASED ============ */}
                {['COMPLETED', 'RELEASED'].includes(effectiveStatus) && !showRateReview && (
                    <div className='mt-8'>
                        {/* ===== MOBILE completed view ===== */}
                        <div className='hidden xs:flex flex-col gap-4 px-6 pb-28'>
                            {/* Success banner */}
                            <div className='bg-surface-success border border-success-dark/20 rounded-2xl p-5 flex flex-col items-center gap-2 text-center'>
                                <div className='w-9 h-9 rounded-full bg-success-dark flex items-center justify-center'>
                                    <CheckCircle size={20} className='text-white' />
                                </div>
                                <p className='font-poppins text-[18px] font-semibold text-success-dark'>Transaction Successful</p>
                                <p className='font-poppins text-[13px] font-normal text-text_four leading-snug'>
                                    {isBuyer
                                        ? 'Delivery has been confirmed by you. Payment has been released to seller.'
                                        : 'Delivery has been confirmed. Payment has been released to you.'}
                                </p>
                            </div>

                            {/* Item card */}
                            <div className='bg-white border border-border-DEFAULT rounded-2xl p-3 flex items-center gap-3 shadow-[0px_0px_24px_0px_rgba(2,95,115,0.08)]'>
                                <Image
                                    src='/images/placeholders/placeholder-product.svg'
                                    alt='item'
                                    width={80}
                                    height={80}
                                    className='w-[80px] h-[80px] rounded-xl object-cover flex-shrink-0'
                                />
                                <div className='min-w-0'>
                                    <p className='font-poppins text-[15px] font-semibold text-text_one line-clamp-2 leading-snug'>
                                        {transaction.description || 'Item'}
                                    </p>
                                    <span className='inline-block mt-1.5 bg-surface-success/60 text-success-dark font-poppins text-[11px] font-medium px-2.5 py-0.5 rounded-full'>
                                        {transaction.type === 'SWAP' ? 'Swap only' : transaction.type === 'SWAP_WITH_CASH' ? 'Swap + Cash' : 'Cash only'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Mobile: Back to Home sticky button */}
                        <div className='hidden xs:block fixed bottom-0 left-0 right-0 px-6 py-4 bg-[#FFFFF0] border-t border-border-DEFAULT z-modal'>
                            <button
                                onClick={() => router.push('/')}
                                className='w-full py-4 bg-primary text-white rounded-xl font-poppins text-[16px] font-semibold flex items-center justify-center gap-2'
                            >
                                <ChevronLeft size={20} />
                                Back to Home
                            </button>
                        </div>

                        {/* ===== DESKTOP completed view ===== */}
                        <div className='xs:hidden'>
                            <div className='bg-surface-success/40 border border-success-dark/20 rounded-2xl p-6 text-center mb-8'>
                                <div className='flex items-center justify-center gap-2 mb-2'>
                                    <CheckCircle size={22} className='text-success-dark' />
                                    <h3 className='font-poppins typo-heading-md-semibold text-success-dark'>
                                        Transaction Successful!
                                    </h3>
                                </div>
                                <p className='font-poppins typo-body-md-regular text-text_four'>
                                    {isBuyer
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
                    </div>
                )}
            </div>

            {/* Mobile: Payment Transfer full-screen overlay */}
            {showPaymentTransfer && isBuyer && (
                <div className='hidden xs:flex fixed inset-0 bg-[#FFFFF0] z-overlay flex-col overflow-y-auto'>
                    {/* Header: amount left, Cancel right */}
                    <div className='flex justify-between items-start px-[30px] pt-[68px] pb-4'>
                        <div className='flex flex-col gap-1.5'>
                            <p className='font-poppins text-[16px] font-normal text-text_one'>You are Paying</p>
                            <p className='font-poppins text-[16px] font-semibold text-text_one'>{formatToNaira(transactionAmount + 11000)}</p>
                        </div>
                        <button
                            onClick={() => setShowPaymentTransfer(false)}
                            className='border border-primary text-primary rounded-lg font-poppins text-[16px] font-medium px-[10px] py-[10px] leading-none'
                        >
                            Cancel
                        </button>
                    </div>

                    {/* Pay with Transfer heading + instruction */}
                    <div className='px-[27px] flex flex-col gap-[17px] mt-[98px] mb-[56px]'>
                        <p className='font-poppins text-[16px] font-semibold text-text_one'>Pay with Transfer</p>
                        <p className='font-poppins text-[14px] font-normal text-text_one'>
                            Transfer exactly ₦{(transactionAmount + 11000).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} (including the decimal) to the account below
                        </p>
                    </div>

                    {/* Warning box */}
                    <div className='mx-[29px] bg-surface-coral border border-warning-dark rounded-xl px-4 py-[21px] mb-[49px]'>
                        <p className='font-poppins text-[12px] font-medium text-warning-dark'>
                            Do NOT transfer more than once to the account below or save it for later use.
                        </p>
                    </div>

                    {/* Account details card */}
                    <div className='mx-[25px] bg-white rounded-xl shadow-[0px_0px_24px_0px_rgba(2,95,115,0.1)] px-4 py-3 flex flex-col gap-6 mb-[44px]'>
                        <div className='flex justify-between items-center'>
                            <span className='font-poppins text-[14px] font-light text-text_one'>Bank Name</span>
                            <span className='font-poppins text-[14px] font-semibold text-text_one'>Zenith Bank</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='font-poppins text-[14px] font-light text-text_one'>Account Number</span>
                            <div className='flex items-center gap-3'>
                                <span className='font-poppins text-[14px] font-semibold text-text_one'>4432890753</span>
                                <button onClick={() => navigator.clipboard.writeText('4432890753')}>
                                    <CopyIcon className='w-6 h-6 text-primary' />
                                </button>
                            </div>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='font-poppins text-[14px] font-light text-text_one'>Account Name</span>
                            <span className='font-poppins text-[14px] font-semibold text-text_one'>CREDO( Flipit MarketPlace)</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span className='font-poppins text-[14px] font-light text-text_one'>Account expires in</span>
                            <span className='font-poppins text-[14px] font-semibold text-text_one'>{formatTime(timeLeft)}</span>
                        </div>
                    </div>

                    {/* I have deposited the money button */}
                    <div className='px-[27px] mb-[127px]'>
                        <button
                            onClick={handleVerifyPayment}
                            disabled={isLoading}
                            className='w-full h-11 bg-primary text-white rounded-xl font-poppins text-[16px] font-medium disabled:opacity-50'
                        >
                            {isLoading ? 'Verifying...' : 'I have deposited the money'}
                        </button>
                    </div>

                    {/* Safe Checkout */}
                    <div className='flex items-center gap-3 px-[26px] pb-8'>
                        <Lock size={24} className='text-text_four flex-shrink-0' />
                        <div>
                            <p className='font-poppins text-[10px] font-semibold text-text_one uppercase tracking-wide'>SAFE CHECKOUT</p>
                            <p className='font-poppins text-[10px] font-normal text-text-muted-alt'>All data is encrypted and protected by industrial grade security standard</p>
                        </div>
                    </div>
                </div>
            )}

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
