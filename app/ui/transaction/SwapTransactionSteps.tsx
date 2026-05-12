'use client';
import React, {useState} from 'react';
import Image from 'next/image';
import {TransactionDTO} from '~/types/transaction';
import {ShieldCheck, CheckCircle} from 'lucide-react';

interface Props {
    transaction: TransactionDTO;
    currentStepIndex: number;
    isBuyer: boolean;
    isSeller: boolean;
    onStatusChange: (status: string) => void;
    onShowRateReview: () => void;
}

// Swap Exchange Step — both users choose logistics and generate shipping code
const SwapExchangeStep = ({transaction, isBuyer}: {transaction: TransactionDTO; isBuyer: boolean}) => {
    const [selectedLogistics, setSelectedLogistics] = useState<string>('guo');
    const [codeGenerated, setCodeGenerated] = useState(false);
    const uniqueCode = '9956-2345';
    const logisticsName = selectedLogistics === 'gig' ? 'GIG' : 'GUO';

    return (
        <div className='mt-8'>
            <h3 className='font-poppins font-semibold text-[16px] text-text_one mb-2'>Review Order</h3>

            {/* Swap Confirmed banner */}
            <div className='border border-[#E8E8E8] rounded-xl p-5 text-center mb-6'>
                <div className='flex items-center justify-center gap-2 mb-1'>
                    <CheckCircle size={18} className='text-[#08973F]' />
                    <span className='font-poppins font-semibold text-[16px] text-[#08973F]'>Swap Confirmed !</span>
                </div>
                <p className='font-poppins text-[14px] text-[#A49E9E]'>
                    Both parties have agreed to swap term. Proceed to shipping within timeframe.
                </p>
            </div>

            {/* Order & Transaction IDs */}
            <p className='font-poppins text-[14px] text-text_one mb-6'>
                Order #43467  Transaction ID : <span className='font-semibold'>FLPT #323156798</span>
            </p>

            {/* Two item cards */}
            <div className='grid grid-cols-2 xs:grid-cols-1 gap-6 mb-6'>
                <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-[40px] h-[40px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[16px] text-primary'>
                            A
                        </div>
                        <div>
                            <p className='font-poppins font-semibold text-[14px] text-text_one'>
                                {isBuyer ? "User A's Item" : 'Your Item'}
                            </p>
                            <p className='font-poppins text-[13px] text-text_four'>
                                {transaction.seller?.firstName || 'John'} {transaction.seller?.lastName || 'Doe'}
                            </p>
                        </div>
                    </div>
                    <Image src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'} alt='Item A' width={300} height={200} className='rounded-xl object-cover w-full h-[200px] mb-3' />
                    <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.sellerItem?.title || 'Canon EOS RP Camera +Small Rig | Clean U...'}</p>
                    <p className='font-poppins text-[13px] text-text_four mt-1'>Condition : {transaction.sellerItem?.condition || 'Brand new'}</p>
                </div>
                <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                    <div className='flex items-center gap-3 mb-3'>
                        <div className='w-[40px] h-[40px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[16px] text-primary'>
                            B
                        </div>
                        <div>
                            <p className='font-poppins font-semibold text-[14px] text-text_one'>
                                {isBuyer ? 'Your Item' : "User B's Item"}
                            </p>
                            <p className='font-poppins text-[13px] text-text_four'>
                                {transaction.buyer?.firstName || 'Sarah'} {transaction.buyer?.lastName || 'Duke'}
                            </p>
                        </div>
                    </div>
                    <Image src={transaction.buyerItem?.imageUrls?.[0] || '/placeholder-product.svg'} alt='Item B' width={300} height={200} className='rounded-xl object-cover w-full h-[200px] mb-3' />
                    <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.buyerItem?.title || 'Iphone 15 Pro Max ( Metallic Grey)'}</p>
                    <p className='font-poppins text-[13px] text-text_four mt-1'>Condition : {transaction.buyerItem?.condition || 'Fairly Used'}</p>
                </div>
            </div>

            {/* Logistics selection */}
            <div className='border border-[#E8E8E8] rounded-2xl p-6 mb-6'>
                <h4 className='font-poppins font-semibold text-[16px] text-text_one text-center mb-5'>Choose Preferred Logistics Service</h4>
                <div className='space-y-3 mb-6'>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input type='radio' name='swap-logistics' value='gig' checked={selectedLogistics === 'gig'} onChange={() => setSelectedLogistics('gig')} className='w-[18px] h-[18px] accent-primary' />
                        <span className='font-poppins text-[14px] text-text_one'>GIG Logistics Services</span>
                    </label>
                    <label className='flex items-center gap-3 cursor-pointer'>
                        <input type='radio' name='swap-logistics' value='guo' checked={selectedLogistics === 'guo'} onChange={() => setSelectedLogistics('guo')} className='w-[18px] h-[18px] accent-primary' />
                        <span className='font-poppins text-[14px] text-text_one'>GUO Logistics Services</span>
                    </label>
                </div>
                <div className='flex justify-center'>
                    <button onClick={() => setCodeGenerated(true)} className='px-8 py-2.5 border border-primary text-primary rounded-lg font-poppins text-[14px] font-medium hover:bg-primary hover:text-white transition-colors'>
                        Generate Unique code
                    </button>
                </div>
            </div>

            {/* After code generation */}
            {codeGenerated && (
                <>
                    {/* Unique Code + Shipping Deadline */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-6 flex xs:flex-col items-center justify-between mb-6'>
                        <div>
                            <p className='font-poppins font-semibold text-[11px] text-[#A49E9E] uppercase tracking-wider mb-2'>UNIQUE CODE</p>
                            <div className='border-[3px] border-dashed border-primary bg-[#C9EBF4] rounded-xl px-5 py-4 flex items-center gap-4 w-max'>
                                <span className='font-poppins font-bold text-[20px] text-primary'>{uniqueCode}</span>
                                <button onClick={() => navigator.clipboard.writeText(uniqueCode)} className='text-primary hover:opacity-70' title='Copy code'>
                                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z' /></svg>
                                </button>
                            </div>
                        </div>
                        <div className='h-[80px] w-[1px] bg-[#E8E8E8] mx-8 xs:hidden'></div>
                        <div>
                            <p className='font-poppins font-semibold text-[11px] text-[#A49E9E] uppercase tracking-wider mb-2'>SHIPPING DEADLINE</p>
                            <div className='border border-[#E8E8E8] rounded-xl px-8 py-4'>
                                <span className='font-poppins font-bold text-[20px] text-[#FF674B]'>45 : 59 :44</span>
                            </div>
                        </div>
                    </div>

                    {/* Logistics Instructions */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-6 mb-6'>
                        <h4 className='font-poppins font-bold text-[16px] text-text_one mb-1'>{logisticsName} logistics Instructions</h4>
                        <p className='font-poppins text-[13px] text-[#A49E9E] mb-5'>Please follow these steps to complete your part of the swap.</p>
                        <hr className='border-[#E8E8E8] mb-5' />
                        <div className='space-y-5'>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>Securely pack your items</p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>Ensure the item is padded to protect from damage during transportation</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>Visit the {logisticsName} Logistics Outlet</p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>Drop Off the package at any authorized {logisticsName} outlet near you.</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-3'>
                                <CheckCircle size={20} className='text-[#08973F] flex-shrink-0 mt-0.5' />
                                <div>
                                    <p className='font-poppins font-bold text-[14px] text-text_one'>Present Your Shipping Code</p>
                                    <p className='font-poppins text-[13px] text-[#A49E9E]'>Show the agent your unique code {uniqueCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

// Swap Activation Step — waiting for both items to be dropped off
const SwapActivationStep = () => (
    <div className='mt-8 flex flex-col items-center justify-center py-16'>
        <div className='flex items-center gap-2 mb-3'>
            <svg className='w-6 h-6 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
            </svg>
            <h3 className='font-poppins font-bold text-[18px] text-primary'>Swap Activation In Progress</h3>
        </div>
        <p className='font-poppins text-[14px] text-[#A49E9E] text-center max-w-[400px]'>
            Waiting for User B to drop off their item. Your item has been authenticated at the hub.
        </p>
    </div>
);

// Swap Delivery Step — tracking + item preview OR confirm delivery
const SwapDeliveryStep = ({transaction, onConfirm}: {transaction: TransactionDTO; onConfirm: () => void}) => {
    const [showConfirm, setShowConfirm] = useState(false);

    if (showConfirm) {
        return (
            <div className='mt-8'>
                {/* Confirm Delivery banner */}
                <div className='border border-[#E8E8E8] rounded-xl p-5 text-center mb-8'>
                    <div className='flex items-center justify-center gap-2 mb-1'>
                        <CheckCircle size={18} className='text-[#08973F]' />
                        <span className='font-poppins font-semibold text-[16px] text-[#08973F]'>Confirm Delivery</span>
                    </div>
                    <p className='font-poppins text-[14px] text-[#A49E9E]'>
                        Please verify you have received the item from your swap partner to finalize the transaction.
                    </p>
                </div>

                {/* Two user confirmation cards */}
                <div className='grid grid-cols-2 xs:grid-cols-1 gap-6'>
                    {/* User A (You) */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-[36px] h-[36px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[14px] text-primary'>A</div>
                                <span className='font-poppins font-semibold text-[16px] text-text_one'>User A (You)</span>
                            </div>
                            <span className='px-3 py-1 bg-[#A49E9E] text-white rounded font-poppins text-[11px] font-medium uppercase'>PENDING</span>
                        </div>
                        <hr className='border-[#E8E8E8] mb-4' />
                        <p className='font-poppins text-[14px] text-text_one mb-6'>
                            Click below once you have received and inspected the {transaction.buyerItem?.title || 'Iphone 15 Pro Max'}.
                        </p>
                        <button
                            onClick={onConfirm}
                            className='w-full py-3 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors mb-3'
                        >
                            I have received my Item
                        </button>
                        <p className='font-poppins text-[14px] text-[#A49E9E] text-center cursor-pointer hover:text-text_one'>Report an Issue</p>
                    </div>

                    {/* User B */}
                    <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                        <div className='flex items-center justify-between mb-4'>
                            <div className='flex items-center gap-3'>
                                <div className='w-[36px] h-[36px] rounded-full bg-[#C9EBF4] flex items-center justify-center font-poppins font-bold text-[14px] text-primary'>B</div>
                                <span className='font-poppins font-semibold text-[16px] text-text_one'>{transaction.buyer?.firstName || 'Sarah'} {transaction.buyer?.lastName || 'Duke'}</span>
                            </div>
                            <span className='px-3 py-1 bg-[#08973F] text-white rounded font-poppins text-[11px] font-medium uppercase'>CONFIRMED</span>
                        </div>
                        <hr className='border-[#E8E8E8] mb-4' />
                        <p className='font-poppins text-[14px] text-[#A49E9E] mb-6'>
                            User B has confirmed receipt of the {transaction.sellerItem?.title || 'Canon Camera'}.
                        </p>
                        <button disabled className='w-full py-3 bg-[#B8C9CE] text-white rounded-lg font-poppins text-[14px] font-medium cursor-not-allowed'>
                            Received
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='mt-8'>
            {/* Swap Activated banner */}
            <div className='border border-[#E8E8E8] rounded-xl p-5 text-center mb-6'>
                <div className='flex items-center justify-center gap-2 mb-1'>
                    <CheckCircle size={18} className='text-[#08973F]' />
                    <span className='font-poppins font-semibold text-[16px] text-[#08973F]'>Swap Activated</span>
                </div>
                <p className='font-poppins text-[14px] text-[#A49E9E]'>
                    User B has deposited his item. Swap has been activated.
                </p>
            </div>

            <p className='font-poppins text-[14px] text-text_one mb-6'>
                Order #43467  Transaction ID : <span className='font-semibold'>FLPT #323156798</span>
            </p>

            {/* Map + Item Preview */}
            <div className='grid grid-cols-[1fr_300px] xs:grid-cols-1 gap-6 mb-6'>
                <div className='border border-[#E8E8E8] rounded-2xl p-5'>
                    <h4 className='font-poppins font-bold text-[14px] text-text_one mb-3'>Live Transit</h4>
                    <div className='w-full h-[350px] bg-[#E8F4E8] rounded-xl flex items-center justify-center mb-4'>
                        <div className='text-center'>
                            <svg className='w-10 h-10 text-primary mx-auto mb-2' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' />
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' />
                            </svg>
                            <p className='font-poppins text-[13px] text-primary'>Live map tracking</p>
                        </div>
                    </div>
                    <p className='font-poppins text-[13px] text-[#A49E9E]'>Estimated Time of Arrival</p>
                    <p className='font-poppins font-semibold text-[14px] text-text_one'>March 16, 2024 10:00 AM</p>
                </div>

                {/* Item Preview */}
                <div>
                    <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Item Preview</p>
                    <p className='font-poppins text-[12px] text-text_four mb-2'>Sender: {transaction.buyer?.firstName || 'Sarah'} {transaction.buyer?.lastName || 'Duke'}</p>
                    <Image src={transaction.buyerItem?.imageUrls?.[0] || '/placeholder-product.svg'} alt='Item' width={280} height={200} className='rounded-xl object-cover w-full h-[200px] mb-2' />
                    <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.buyerItem?.title || 'Iphone 15 Pro Max ( Metallic Grey)'}</p>
                    <p className='font-poppins text-[13px] text-text_four'>Condition : {transaction.buyerItem?.condition || 'Fairly Used'}</p>
                </div>
            </div>

            {/* Tracking Information */}
            <div className='border border-[#E8E8E8] rounded-2xl p-6 mb-6'>
                <h4 className='font-poppins font-bold text-[16px] text-text_one mb-5'>Tracking information</h4>
                <div className='grid grid-cols-2 xs:grid-cols-1 gap-y-5 gap-x-8'>
                    <div>
                        <div className='flex items-center gap-2 mb-1'>
                            <svg className='w-5 h-5 text-text_one' fill='none' stroke='currentColor' viewBox='0 0 24 24'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' /><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M3 4h1l2 10h13l2-8H5' /></svg>
                            <span className='font-poppins font-bold text-[14px] text-text_one'>GUO Logistics</span>
                        </div>
                        <p className='font-poppins text-[13px] text-text_four'>Tracking # : FLPT 323156798</p>
                    </div>
                    <div>
                        <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Last Update</p>
                        <p className='font-poppins text-[13px] text-text_four'>Package left facility in Enugu March 14, 2024</p>
                    </div>
                    <div>
                        <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Status</p>
                        <span className='inline-block px-3 py-1 bg-[#C9EBF4] text-primary rounded font-poppins text-[12px] font-medium'>In Transit</span>
                    </div>
                    <div>
                        <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Last Location</p>
                        <p className='font-poppins text-[13px] text-text_four'>Enugu, Enugu</p>
                    </div>
                    <div>
                        <p className='font-poppins font-bold text-[14px] text-text_one mb-1'>Estimated Delivery</p>
                        <p className='font-poppins text-[13px] text-text_four'>March 16, 2024</p>
                    </div>
                </div>
            </div>

            <div className='flex justify-center'>
                <button onClick={() => setShowConfirm(true)} className='px-12 py-3 bg-primary text-white rounded-lg font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors'>
                    Proceed to Delivery Confirmation
                </button>
            </div>
        </div>
    );
};

// Swap Completed View
const SwapCompletedView = ({transaction}: {transaction: TransactionDTO}) => (
    <div className='mt-8'>
        {/* Success banner */}
        <div className='bg-[#C9FFDF]/40 border border-[#08973F]/20 rounded-2xl p-6 text-center mb-8'>
            <div className='flex items-center justify-center gap-2 mb-2'>
                <CheckCircle size={22} className='text-[#08973F]' />
                <h3 className='font-poppins font-bold text-[18px] text-[#08973F]'>Swap Successful 🎉</h3>
            </div>
            <p className='font-poppins text-[14px] text-text_four'>
                Delivery has been confirmed by both parties. Items have been verified, and transaction is now finalized.
            </p>
        </div>

        {/* Delivery Summary */}
        <div className='border border-[#E8E8E8] rounded-2xl p-6'>
            <p className='font-poppins font-semibold text-[14px] text-[#A49E9E] uppercase tracking-wider mb-4'>DELIVERY SUMMARY</p>
            <div className='grid grid-cols-2 xs:grid-cols-1 gap-4'>
                <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-3'>
                    <Image src={transaction.sellerItem?.imageUrls?.[0] || '/placeholder-product.svg'} alt='Item A' width={80} height={80} className='rounded-lg object-cover w-[80px] h-[80px]' />
                    <div className='flex flex-col justify-between'>
                        <div>
                            <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.seller?.firstName || 'John'} {transaction.seller?.lastName || 'Doe'}</p>
                            <p className='font-poppins text-[13px] text-text_four'>{transaction.sellerItem?.title || 'Camera'}</p>
                        </div>
                        <span className='w-fit px-3 py-0.5 bg-[#C9FFDF] text-[#08973F] rounded font-poppins text-[11px] font-medium'>Delivered</span>
                    </div>
                </div>
                <div className='border border-[#E8E8E8] rounded-xl p-4 flex gap-3'>
                    <Image src={transaction.buyerItem?.imageUrls?.[0] || '/placeholder-product.svg'} alt='Item B' width={80} height={80} className='rounded-lg object-cover w-[80px] h-[80px]' />
                    <div className='flex flex-col justify-between'>
                        <div>
                            <p className='font-poppins font-semibold text-[14px] text-text_one'>{transaction.buyer?.firstName || 'Sarah'} {transaction.buyer?.lastName || 'Duke'}</p>
                            <p className='font-poppins text-[13px] text-text_four'>{transaction.buyerItem?.title || 'Iphone 15'}</p>
                        </div>
                        <span className='w-fit px-3 py-0.5 bg-[#C9FFDF] text-[#08973F] rounded font-poppins text-[11px] font-medium'>Delivered</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
);

// Main export — renders the correct step for swap transactions
const SwapTransactionSteps = ({transaction, currentStepIndex, isBuyer, isSeller, onStatusChange, onShowRateReview}: Props) => {
    const isCompleted = transaction.status === 'COMPLETED';

    if (isCompleted) {
        return <SwapCompletedView transaction={transaction} />;
    }

    switch (currentStepIndex) {
        case 1:
            return <SwapExchangeStep transaction={transaction} isBuyer={isBuyer} />;
        case 2:
            return <SwapActivationStep />;
        case 3:
            return (
                <SwapDeliveryStep
                    transaction={transaction}
                    onConfirm={() => {
                        onStatusChange('REVIEW_PENDING');
                        onShowRateReview();
                    }}
                />
            );
        default:
            return null;
    }
};

export default SwapTransactionSteps;
