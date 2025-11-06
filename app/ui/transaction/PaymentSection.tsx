'use client';
import React, {useState} from 'react';
import {TransactionDTO} from '~/types/transaction';
import {formatToNaira} from '~/utils/helpers';
import TransactionService from '~/services/transaction.service';

interface Props {
    transaction: TransactionDTO;
    userRole: 'seller' | 'buyer' | null;
    onPaymentComplete: () => void;
}

const PaymentSection = ({transaction, userRole, onPaymentComplete}: Props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'bank_transfer'>('paystack');

    const payment = transaction.payment;
    const canMakePayment =
        userRole === 'buyer' &&
        ['PAYMENT_PENDING', 'OFFER_ACCEPTED'].includes(transaction.status) &&
        (!payment || payment.status !== 'COMPLETED');

    const handleInitiatePayment = async () => {
        setIsProcessing(true);
        try {
            // Initialize payment with Paystack/Flutterwave
            const response = await TransactionService.initializePayment({
                transactionId: transaction.id,
                amount: transaction.cashAmount || 0,
                paymentMethod: selectedMethod,
                callbackUrl: `${window.location.origin}/transaction/${transaction.id}?payment=success`
            });

            if (response.data) {
                // Redirect to payment gateway
                // In real implementation, you'd get authorization_url from response
                alert('Payment gateway integration needed. This would redirect to Paystack/Flutterwave.');
                // window.location.href = response.data.authorization_url;
            }
        } catch (error) {
            console.error('Failed to initialize payment:', error);
            alert('Failed to initialize payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
            <h2 className='typo-heading_ss text-text_one mb-6'>Payment Details</h2>

            {/* Payment Amount */}
            <div className='bg-surface-primary-10 rounded-lg p-6 mb-6'>
                <div className='flex items-center justify-between mb-2'>
                    <span className='typo-body_mr text-text_four'>Amount to Pay:</span>
                    <span className='typo-heading_ms text-primary'>{formatToNaira(transaction.cashAmount || 0)}</span>
                </div>
                {transaction.transactionType === 'ITEM_PLUS_CASH' && (
                    <p className='typo-body_sr text-text_four'>Cash portion of the exchange</p>
                )}
            </div>

            {/* Payment Status */}
            {payment && (
                <div className='border border-border_gray rounded-lg p-4 mb-6'>
                    <h3 className='typo-body_lm text-text_one mb-4'>Payment Status</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='typo-body_mr text-text_four'>Status:</span>
                            <span
                                className={`typo-body_mr px-3 py-1 rounded-full ${
                                    payment.status === 'COMPLETED'
                                        ? 'bg-green-100 text-green-600'
                                        : payment.status === 'FAILED'
                                          ? 'bg-red-100 text-red-600'
                                          : 'bg-yellow-100 text-yellow-600'
                                }`}
                            >
                                {payment.status}
                            </span>
                        </div>
                        {payment.paymentReference && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Reference:</span>
                                <span className='typo-body_sr text-text_one font-mono'>{payment.paymentReference}</span>
                            </div>
                        )}
                        {payment.paymentMethod && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Method:</span>
                                <span className='typo-body_mr text-text_one capitalize'>
                                    {payment.paymentMethod.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}
                        {payment.dateCompleted && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Completed:</span>
                                <span className='typo-body_sr text-text_one'>
                                    {new Date(payment.dateCompleted).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Escrow Information */}
                    {payment.status === 'IN_ESCROW' && (
                        <div className='mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                            <div className='flex items-start gap-2'>
                                <svg className='w-5 h-5 text-blue-600 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path
                                        fillRule='evenodd'
                                        d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                <div>
                                    <h4 className='typo-body_lr text-blue-800 mb-1'>Payment in Escrow</h4>
                                    <p className='typo-body_sr text-blue-700'>
                                        Your payment is securely held in escrow. The seller will receive it once you
                                        confirm delivery.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Make Payment Section */}
            {canMakePayment && (
                <div className='space-y-4'>
                    <h3 className='typo-body_lm text-text_one'>Select Payment Method</h3>

                    {/* Payment Methods */}
                    <div className='space-y-3'>
                        <label
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedMethod === 'paystack'
                                    ? 'border-primary bg-surface-primary-10'
                                    : 'border-border_gray hover:border-primary/30'
                            }`}
                        >
                            <input
                                type='radio'
                                name='payment-method'
                                value='paystack'
                                checked={selectedMethod === 'paystack'}
                                onChange={(e) => setSelectedMethod(e.target.value as any)}
                                className='w-5 h-5 text-primary'
                            />
                            <div className='flex-1'>
                                <p className='typo-body_lr text-text_one'>Card Payment (Paystack)</p>
                                <p className='typo-body_sr text-text_four'>Pay securely with your debit/credit card</p>
                            </div>
                            <div className='flex gap-2'>
                                <div className='w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs'>
                                    VISA
                                </div>
                                <div className='w-8 h-6 bg-gray-200 rounded flex items-center justify-center text-xs'>
                                    MC
                                </div>
                            </div>
                        </label>

                        <label
                            className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                selectedMethod === 'bank_transfer'
                                    ? 'border-primary bg-surface-primary-10'
                                    : 'border-border_gray hover:border-primary/30'
                            }`}
                        >
                            <input
                                type='radio'
                                name='payment-method'
                                value='bank_transfer'
                                checked={selectedMethod === 'bank_transfer'}
                                onChange={(e) => setSelectedMethod(e.target.value as any)}
                                className='w-5 h-5 text-primary'
                            />
                            <div className='flex-1'>
                                <p className='typo-body_lr text-text_one'>Bank Transfer</p>
                                <p className='typo-body_sr text-text_four'>Transfer to our escrow account</p>
                            </div>
                            <svg className='w-6 h-6 text-primary' fill='currentColor' viewBox='0 0 20 20'>
                                <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                                <path
                                    fillRule='evenodd'
                                    d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                                    clipRule='evenodd'
                                />
                            </svg>
                        </label>
                    </div>

                    {/* Security Badge */}
                    <div className='bg-green-50 border border-green-200 rounded-lg p-4'>
                        <div className='flex items-start gap-2'>
                            <svg className='w-5 h-5 text-green-600 mt-0.5' fill='currentColor' viewBox='0 0 20 20'>
                                <path
                                    fillRule='evenodd'
                                    d='M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            <div>
                                <h4 className='typo-body_lr text-green-800 mb-1'>Secure Escrow Protection</h4>
                                <p className='typo-body_sr text-green-700'>
                                    Your payment is held securely until you confirm delivery. Seller cannot access funds
                                    until transaction is complete.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Pay Button */}
                    <button
                        onClick={handleInitiatePayment}
                        disabled={isProcessing}
                        className='w-full h-[52px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                    >
                        {isProcessing ? (
                            <>
                                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                Processing...
                            </>
                        ) : (
                            <>
                                <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                    <path d='M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z' />
                                    <path
                                        fillRule='evenodd'
                                        d='M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z'
                                        clipRule='evenodd'
                                    />
                                </svg>
                                Pay {formatToNaira(transaction.cashAmount || 0)}
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Waiting for Payment (Seller View) */}
            {userRole === 'seller' && ['PAYMENT_PENDING', 'OFFER_ACCEPTED'].includes(transaction.status) && (
                <div className='text-center py-8'>
                    <div className='w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-yellow-600' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z' />
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </div>
                    <h3 className='typo-body_lm text-text_one mb-2'>Waiting for Payment</h3>
                    <p className='typo-body_mr text-text_four'>
                        The buyer has been notified to complete the payment. You will be notified once payment is received.
                    </p>
                </div>
            )}

            {/* Payment Completed */}
            {payment && payment.status === 'COMPLETED' && (
                <div className='text-center py-8'>
                    <div className='w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                            <path
                                fillRule='evenodd'
                                d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z'
                                clipRule='evenodd'
                            />
                        </svg>
                    </div>
                    <h3 className='typo-body_lm text-green-600 mb-2'>Payment Completed</h3>
                    <p className='typo-body_mr text-text_four'>
                        {userRole === 'buyer'
                            ? 'Your payment has been received and is securely held in escrow.'
                            : 'Payment has been received. You can now proceed with shipping.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default PaymentSection;
