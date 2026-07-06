'use client';
import React, {useState} from 'react';
import {TransactionDTO} from '~/types/transaction';
import {formatToNaira} from '~/utils/helpers';
import TransactionService from '~/services/transaction.service';
import {BankCardIcon, ShieldCheckFilledIcon, DollarCircleIcon, CheckCircleFilledIcon} from '../icons';

interface Props {
    transaction: TransactionDTO;
    userRole: 'seller' | 'buyer' | null;
    onPaymentComplete: () => void;
}

const PaymentSection = ({transaction, userRole, onPaymentComplete}: Props) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedMethod, setSelectedMethod] = useState<'paystack' | 'bank_transfer'>('paystack');

    const canMakePayment =
        userRole === 'buyer' &&
        transaction.status === 'PENDING';

    const handleInitiatePayment = async () => {
        setIsProcessing(true);
        try {
            // TODO: selectedMethod is not sent to backend — verifyTransaction doesn't accept a body.
            // Payment method should be set during transaction creation or via a separate endpoint.
            // Verify transaction to trigger payment flow
            const response = await TransactionService.verifyTransaction(transaction.id);

            if (response.data) {
                onPaymentComplete();
            } else {
                alert('Payment verification failed. Please try again.');
            }
        } catch (error) {
            console.error('Failed to process payment:', error);
            alert('Failed to process payment. Please try again.');
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
                    <span className='typo-heading_ms text-primary'>{formatToNaira(transaction.amount || 0)}</span>
                </div>
                {transaction.type === 'SWAP_WITH_CASH' && (
                    <p className='typo-body_sr text-text_four'>Cash portion of the exchange</p>
                )}
            </div>

            {/* Payment Status */}
            {transaction.reference && (
                <div className='border border-border_gray rounded-lg p-4 mb-6'>
                    <h3 className='typo-body_lm text-text_one mb-4'>Payment Status</h3>
                    <div className='space-y-3'>
                        <div className='flex items-center justify-between'>
                            <span className='typo-body_mr text-text_four'>Status:</span>
                            <span
                                className={`typo-body_mr px-3 py-1 rounded-full ${
                                    transaction.status === 'SUCCESS'
                                        ? 'bg-surface-primary text-primary'
                                        : transaction.status === 'FAILED'
                                          ? 'bg-surface-error text-error'
                                          : 'bg-surface-secondary text-warning'
                                }`}
                            >
                                {transaction.status}
                            </span>
                        </div>
                        {transaction.reference && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Reference:</span>
                                <span className='typo-body_sr text-text_one font-mono'>{transaction.reference}</span>
                            </div>
                        )}
                        {transaction.paymentMethod && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Method:</span>
                                <span className='typo-body_mr text-text_one capitalize'>
                                    {transaction.paymentMethod.replace(/_/g, ' ')}
                                </span>
                            </div>
                        )}
                        {transaction.transactionDate && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Date:</span>
                                <span className='typo-body_sr text-text_one'>
                                    {new Date(transaction.transactionDate).toLocaleString()}
                                </span>
                            </div>
                        )}
                    </div>
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
                            <BankCardIcon className='w-6 h-6 text-primary' />
                        </label>
                    </div>

                    {/* Security Badge */}
                    <div className='bg-surface-primary border border-primary/20 rounded-lg p-4'>
                        <div className='flex items-start gap-2'>
                            <ShieldCheckFilledIcon className='w-5 h-5 text-primary mt-0.5' />
                            <div>
                                <h4 className='typo-body_lr text-primary mb-1'>Secure Escrow Protection</h4>
                                <p className='typo-body_sr text-text_one'>
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
                                <BankCardIcon className='w-5 h-5' />
                                Pay {formatToNaira(transaction.amount || 0)}
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Waiting for Payment (Seller View) */}
            {userRole === 'seller' && transaction.status === 'PENDING' && (
                <div className='text-center py-8'>
                    <div className='w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4'>
                        <DollarCircleIcon className='w-8 h-8 text-warning' />
                    </div>
                    <h3 className='typo-body_lm text-text_one mb-2'>Waiting for Payment</h3>
                    <p className='typo-body_mr text-text_four'>
                        The buyer has been notified to complete the payment. You will be notified once payment is received.
                    </p>
                </div>
            )}

            {/* Payment Completed */}
            {transaction.status === 'SUCCESS' && (
                <div className='text-center py-8'>
                    <div className='w-16 h-16 bg-surface-primary rounded-full flex items-center justify-center mx-auto mb-4'>
                        <CheckCircleFilledIcon className='w-8 h-8 text-primary' />
                    </div>
                    <h3 className='typo-body_lm text-primary mb-2'>Payment Completed</h3>
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
