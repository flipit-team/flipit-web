'use client';
import React, {useState, useEffect} from 'react';
import Image from 'next/image';
import {TransactionDTO, ShippingDetails} from '~/types/transaction';
import ShippingService, {GIGTrackingInfo} from '~/services/shipping.service';
import TransactionService from '~/services/transaction.service';

interface Props {
    transaction: TransactionDTO;
    userRole: 'seller' | 'buyer' | null;
    onShippingUpdate: () => void;
}

const ShippingSection = ({transaction, userRole, onShippingUpdate}: Props) => {
    const [showShippingForm, setShowShippingForm] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [trackingInfo, setTrackingInfo] = useState<GIGTrackingInfo | null>(null);
    const [shippingFormData, setShippingFormData] = useState({
        senderName: '',
        senderPhone: '',
        senderAddress: '',
        senderState: '',
        senderLGA: '',
        receiverName: '',
        receiverPhone: '',
        receiverAddress: '',
        receiverState: '',
        receiverLGA: '',
        pickupDate: '',
        specialInstructions: ''
    });

    const sellerShipping = transaction.sellerShipping;
    const buyerShipping = transaction.buyerShipping;
    const userShipping = userRole === 'seller' ? sellerShipping : buyerShipping;
    const otherShipping = userRole === 'seller' ? buyerShipping : sellerShipping;

    const needsToShip =
        (userRole === 'seller' &&
            ['PAYMENT_RECEIVED', 'SHIPPING_PENDING'].includes(transaction.status) &&
            !sellerShipping) ||
        (userRole === 'buyer' &&
            transaction.transactionType === 'ITEM_EXCHANGE' &&
            transaction.status === 'SELLER_SHIPPED' &&
            !buyerShipping);

    // Load tracking info when waybill is available
    useEffect(() => {
        const loadTrackingInfo = async () => {
            if (userShipping?.waybillNumber) {
                try {
                    const response = await ShippingService.trackShipment(userShipping.waybillNumber);
                    if (response.data) {
                        setTrackingInfo(response.data);
                    }
                } catch (error) {
                    console.error('Failed to load tracking info:', error);
                }
            }
        };

        loadTrackingInfo();
    }, [userShipping?.waybillNumber]);

    const handleShippingSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Create shipping with GIG Logistics
            const response = await ShippingService.createShipment({
                senderName: shippingFormData.senderName,
                senderPhone: shippingFormData.senderPhone,
                senderEmail: '', // Get from user context
                senderAddress: shippingFormData.senderAddress,
                senderState: shippingFormData.senderState,
                senderLGA: shippingFormData.senderLGA,
                receiverName: shippingFormData.receiverName,
                receiverPhone: shippingFormData.receiverPhone,
                receiverEmail: '', // Get from other party
                receiverAddress: shippingFormData.receiverAddress,
                receiverState: shippingFormData.receiverState,
                receiverLGA: shippingFormData.receiverLGA,
                itemDescription:
                    userRole === 'seller' ? transaction.sellerItem.title : transaction.buyerItem?.title || '',
                itemValue:
                    userRole === 'seller'
                        ? transaction.sellerItem.cashAmount || 0
                        : transaction.buyerItem?.cashAmount || 0,
                deliveryType: 'STANDARD',
                paymentMethod: 'PREPAID',
                pickupDate: shippingFormData.pickupDate,
                specialInstructions: shippingFormData.specialInstructions
            });

            if (response.data) {
                // Create shipping record in transaction
                await TransactionService.createShipping({
                    transactionId: transaction.id,
                    ...shippingFormData
                });

                alert('Shipping arranged successfully! Your waybill number: ' + response.data.waybillNumber);
                setShowShippingForm(false);
                onShippingUpdate();
            }
        } catch (error) {
            console.error('Failed to arrange shipping:', error);
            alert('Failed to arrange shipping. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const formatShippingStatus = (status: string) => {
        return ShippingService.formatTrackingStatus(status);
    };

    return (
        <div className='space-y-6'>
            {/* Your Shipping */}
            {userShipping && (
                <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
                    <h2 className='typo-heading_ss text-text_one mb-6'>
                        {userRole === 'seller' ? 'Your Shipment' : 'Your Item Shipment'}
                    </h2>

                    {/* Shipping Status */}
                    <div className='bg-surface-primary-10 rounded-lg p-4 mb-6'>
                        <div className='flex items-center justify-between mb-3'>
                            <span className='typo-body_mr text-text_four'>Status:</span>
                            <span
                                className={`typo-body_lr px-3 py-1 rounded-full ${
                                    formatShippingStatus(userShipping.status).color
                                } bg-opacity-10`}
                            >
                                {formatShippingStatus(userShipping.status).icon}{' '}
                                {formatShippingStatus(userShipping.status).label}
                            </span>
                        </div>
                        {userShipping.waybillNumber && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Waybill:</span>
                                <span className='typo-body_lr text-text_one font-mono'>
                                    {ShippingService.formatWaybillNumber(userShipping.waybillNumber)}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Shipping Details */}
                    <div className='grid grid-cols-2 xs:grid-cols-1 gap-4 mb-6'>
                        <div className='border border-border_gray rounded-lg p-4'>
                            <h3 className='typo-body_lr text-text_four mb-3'>Pickup Address</h3>
                            <p className='typo-body_mr text-text_one'>{userShipping.senderName}</p>
                            <p className='typo-body_sr text-text_four'>{userShipping.senderPhone}</p>
                            <p className='typo-body_sr text-text_four mt-2'>{userShipping.senderAddress}</p>
                        </div>
                        <div className='border border-border_gray rounded-lg p-4'>
                            <h3 className='typo-body_lr text-text_four mb-3'>Delivery Address</h3>
                            <p className='typo-body_mr text-text_one'>{userShipping.receiverName}</p>
                            <p className='typo-body_sr text-text_four'>{userShipping.receiverPhone}</p>
                            <p className='typo-body_sr text-text_four mt-2'>{userShipping.receiverAddress}</p>
                        </div>
                    </div>

                    {/* Tracking Timeline */}
                    {trackingInfo && trackingInfo.history && trackingInfo.history.length > 0 && (
                        <div>
                            <h3 className='typo-body_lm text-text_one mb-4'>Tracking History</h3>
                            <div className='space-y-4'>
                                {trackingInfo.history.map((event, index) => (
                                    <div key={index} className='flex gap-4'>
                                        <div className='relative'>
                                            <div className='w-3 h-3 bg-primary rounded-full'></div>
                                            {index < trackingInfo.history.length - 1 && (
                                                <div className='absolute top-3 left-[5px] w-[2px] h-full bg-gray-200'></div>
                                            )}
                                        </div>
                                        <div className='flex-1 pb-4'>
                                            <div className='flex items-start justify-between mb-1'>
                                                <p className='typo-body_lr text-text_one'>{event.description}</p>
                                                <span className='typo-body_sr text-text_four whitespace-nowrap ml-2'>
                                                    {new Date(event.dateTime).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className='typo-body_sr text-text_four'>{event.location}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Track Shipment Button */}
                    {userShipping.trackingUrl && (
                        <a
                            href={userShipping.trackingUrl}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='mt-6 w-full h-[48px] border border-primary text-primary rounded-lg typo-body_lr hover:bg-surface-primary-10 flex items-center justify-center gap-2'
                        >
                            <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                                />
                            </svg>
                            Track on GIG Website
                        </a>
                    )}
                </div>
            )}

            {/* Other Party's Shipping */}
            {otherShipping && (
                <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
                    <h2 className='typo-heading_ss text-text_one mb-6'>
                        {userRole === 'seller' ? 'Buyer\'s Shipment' : 'Seller\'s Shipment'}
                    </h2>

                    <div className='bg-gray-50 rounded-lg p-4'>
                        <div className='flex items-center justify-between mb-3'>
                            <span className='typo-body_mr text-text_four'>Status:</span>
                            <span
                                className={`typo-body_lr px-3 py-1 rounded-full ${
                                    formatShippingStatus(otherShipping.status).color
                                } bg-opacity-10`}
                            >
                                {formatShippingStatus(otherShipping.status).icon}{' '}
                                {formatShippingStatus(otherShipping.status).label}
                            </span>
                        </div>
                        {otherShipping.waybillNumber && (
                            <div className='flex items-center justify-between'>
                                <span className='typo-body_mr text-text_four'>Waybill:</span>
                                <span className='typo-body_lr text-text_one font-mono'>
                                    {ShippingService.formatWaybillNumber(otherShipping.waybillNumber)}
                                </span>
                            </div>
                        )}
                        {otherShipping.estimatedDelivery && (
                            <div className='flex items-center justify-between mt-2'>
                                <span className='typo-body_mr text-text_four'>Est. Delivery:</span>
                                <span className='typo-body_sr text-text_one'>
                                    {new Date(otherShipping.estimatedDelivery).toLocaleDateString()}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* Arrange Shipping */}
            {needsToShip && !showShippingForm && (
                <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4 text-center'>
                    <div className='w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                            <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
                        </svg>
                    </div>
                    <h3 className='typo-body_lm text-text_one mb-2'>Arrange Shipping with GIG Logistics</h3>
                    <p className='typo-body_mr text-text_four mb-6'>
                        Schedule a pickup for your item and track delivery in real-time
                    </p>
                    <button
                        onClick={() => setShowShippingForm(true)}
                        className='h-[48px] px-8 bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90'
                    >
                        Arrange Shipping
                    </button>
                </div>
            )}

            {/* Shipping Form */}
            {showShippingForm && (
                <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4'>
                    <h2 className='typo-heading_ss text-text_one mb-6'>Shipping Details</h2>

                    <form onSubmit={handleShippingSubmit} className='space-y-6'>
                        {/* Pickup Information */}
                        <div>
                            <h3 className='typo-body_lm text-text_one mb-4'>Pickup Information</h3>
                            <div className='grid grid-cols-2 xs:grid-cols-1 gap-4'>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Full Name*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.senderName}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, senderName: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Phone Number*</label>
                                    <input
                                        type='tel'
                                        required
                                        value={shippingFormData.senderPhone}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, senderPhone: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div className='col-span-2 xs:col-span-1'>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Pickup Address*</label>
                                    <textarea
                                        required
                                        value={shippingFormData.senderAddress}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, senderAddress: e.target.value})
                                        }
                                        rows={2}
                                        className='w-full border border-border_gray rounded-lg px-4 py-3 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>State*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.senderState}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, senderState: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>LGA*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.senderLGA}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, senderLGA: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Delivery Information */}
                        <div>
                            <h3 className='typo-body_lm text-text_one mb-4'>Delivery Information</h3>
                            <div className='grid grid-cols-2 xs:grid-cols-1 gap-4'>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Receiver Name*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.receiverName}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, receiverName: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Receiver Phone*</label>
                                    <input
                                        type='tel'
                                        required
                                        value={shippingFormData.receiverPhone}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, receiverPhone: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div className='col-span-2 xs:col-span-1'>
                                    <label className='typo-body_sr text-text_four mb-2 block'>Delivery Address*</label>
                                    <textarea
                                        required
                                        value={shippingFormData.receiverAddress}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, receiverAddress: e.target.value})
                                        }
                                        rows={2}
                                        className='w-full border border-border_gray rounded-lg px-4 py-3 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>State*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.receiverState}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, receiverState: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                                <div>
                                    <label className='typo-body_sr text-text_four mb-2 block'>LGA*</label>
                                    <input
                                        type='text'
                                        required
                                        value={shippingFormData.receiverLGA}
                                        onChange={(e) =>
                                            setShippingFormData({...shippingFormData, receiverLGA: e.target.value})
                                        }
                                        className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Additional Details */}
                        <div>
                            <label className='typo-body_sr text-text_four mb-2 block'>Preferred Pickup Date</label>
                            <input
                                type='date'
                                value={shippingFormData.pickupDate}
                                onChange={(e) => setShippingFormData({...shippingFormData, pickupDate: e.target.value})}
                                min={new Date().toISOString().split('T')[0]}
                                className='w-full h-[44px] border border-border_gray rounded-lg px-4 typo-body_mr focus:outline-none focus:border-primary'
                            />
                        </div>

                        <div>
                            <label className='typo-body_sr text-text_four mb-2 block'>Special Instructions</label>
                            <textarea
                                value={shippingFormData.specialInstructions}
                                onChange={(e) =>
                                    setShippingFormData({...shippingFormData, specialInstructions: e.target.value})
                                }
                                rows={3}
                                placeholder='Any special handling instructions...'
                                className='w-full border border-border_gray rounded-lg px-4 py-3 typo-body_mr focus:outline-none focus:border-primary'
                            />
                        </div>

                        {/* Buttons */}
                        <div className='flex gap-4'>
                            <button
                                type='button'
                                onClick={() => setShowShippingForm(false)}
                                className='flex-1 h-[48px] border border-border_gray text-text_four rounded-lg typo-body_lr hover:bg-gray-50'
                            >
                                Cancel
                            </button>
                            <button
                                type='submit'
                                disabled={isLoading}
                                className='flex-1 h-[48px] bg-primary text-white rounded-lg typo-body_lr hover:bg-primary/90 disabled:opacity-50'
                            >
                                {isLoading ? 'Processing...' : 'Schedule Pickup'}
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Waiting for Shipping */}
            {!needsToShip && !userShipping && (
                <div className='shadow-lg rounded-lg bg-white p-6 xs:px-4 text-center py-8'>
                    <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                        <svg className='w-8 h-8 text-gray-400' fill='currentColor' viewBox='0 0 20 20'>
                            <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                            <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
                        </svg>
                    </div>
                    <h3 className='typo-body_lm text-text_one mb-2'>Waiting for Shipment</h3>
                    <p className='typo-body_mr text-text_four'>
                        {userRole === 'buyer'
                            ? 'The seller will arrange shipping soon. You\'ll be notified when the item is shipped.'
                            : 'You need to complete payment before arranging shipping.'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default ShippingSection;
