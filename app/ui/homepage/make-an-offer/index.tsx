'use client';
import Image from 'next/image';
import Link from 'next/link';
import {useRouter, useSearchParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import RegularButton from '~/ui/common/buttons/RegularButton';
import {formatToNaira} from '~/utils/helpers';
import {Item} from '~/utils/interface';

const options = [
    {id: 1, title: 'iPhone 12 Promax', img: '/camera.png'},
    {id: 2, title: 'Sony Camera', img: '/camera.png'}
];

interface Props {
    item?: Item | null;
    onClose: () => void;
    onSubmit: (payload: any) => void;
}

const MakeAnOffer = (props: Props) => {
    const {item, onClose, onSubmit} = props;
    const router = useRouter();
    const {user} = useAppContext();
    const searchParams = useSearchParams();
    const query = searchParams.get('q');
    const [myItems, setMyItems] = useState<Item[]>([]);
    const [withCash, setWithCash] = useState(false);
    const [withItem, setWithItem] = useState(false);
    const [amount, setAmount] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<
        | {
              id: number;
              title: string;
              img: string;
          }
        | undefined
    >();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>('');
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchItems = async () => {
            if (!user?.userId) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/items/get-user-items?userId=${user.userId}`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.apierror?.message || 'Failed to fetch items');
                }

                const data = await res.json();
                setMyItems(data);
            } catch (err: any) {
                setError(err.message || 'Something went wrong');
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [user?.userId]);

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        // Validation - at least one option must be selected
        if (!withCash && !withItem) {
            setError('Please select at least one offer type (Cash or Item)');
            setLoading(false);
            return;
        }

        if (withCash && (!amount || Number(amount) <= 0)) {
            setError('Please enter a valid cash amount');
            setLoading(false);
            return;
        }

        if (withItem && !selectedOption) {
            setError('Please select an item to offer');
            setLoading(false);
            return;
        }

        if (!item?.id) {
            setError('Item information is missing');
            setLoading(false);
            return;
        }

        // Build payload based on selections
        const payload: any = {
            itemId: item?.id,
            userId: user?.userId,
            withCash: withCash,
        };

        if (withCash) {
            payload.cashAmount = Number(amount);
        }

        if (withItem) {
            payload.offeredItemId = selectedOption?.id;
        }

        // Additional validation for null IDs
        if (withItem && !selectedOption?.id) {
            setError('Selected item ID is missing');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/bids/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                
                let errorMessage = 'Failed to create offer';
                
                // Try to extract error message from different response formats
                if (data.details) {
                    try {
                        const parsedDetails = JSON.parse(data.details);
                        errorMessage = parsedDetails.apierror?.debugMessage || parsedDetails.apierror?.message || errorMessage;
                    } catch (e) {
                        errorMessage = data.details;
                    }
                } else if (data.error) {
                    errorMessage = data.error;
                } else if (data.message) {
                    errorMessage = data.message;
                }
                
                setError(errorMessage);
            } else {
                setSuccess(true);
                setTimeout(() => {
                    onClose();
                    router.replace('/current-bids');
                }, 1500);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (query === 'make-an-offer')
        return (
            <div className='w-[1096px] flex flex-col justify-center items-center xs:w-full xs:px-4'>
                <div className='w-full xs:hidden'>
                    <Image
                        src={'/close-white.svg'}
                        height={45}
                        width={45}
                        alt='bell'
                        className='h-[45px] w-[45px] ml-auto'
                        onClick={() => onClose()}
                    />
                </div>
                <div className='h-[625px] w-full bg-white rounded-lg p-[50px] xs:p-0 xs:h-max xs:w-full xs:py-[32px]'>
                    <div className='hidden xs:block'>
                        <Image
                            src={'/cancel.svg'}
                            height={16}
                            width={16}
                            alt='bell'
                            className='h-[16px] w-[16px] ml-auto mr-4'
                            onClick={() => onClose()}
                        />
                    </div>
                    <div className='flex flex-col  mb-4 xs:px-4'>
                        {error && <div className='mb-4 text-center text-red-500'>{error}</div>}
                        {success && <div className='mb-4 text-center text-green-500'>Offer submitted successfully! Redirecting...</div>}
                        <div className='mb-4'>
                            <p className='typo-heading_ms xs:typo-body_ls capitalize'>{item?.title}</p>
                            <p className='typo-heading_ms xs:typo-body_ls text-primary'>
                                {formatToNaira(item?.cashAmount ?? 0)}
                            </p>
                        </div>
                        <div className='grid grid-cols-[443px_1fr] xs:flex xs:flex-col gap-[44px] xs:gap-[22px] '>
                            <Image
                                src={item?.imageUrls?.[0] || '/placeholder-product.svg'}
                                height={439}
                                width={443}
                                alt='picture'
                                className='h-[439px] w-[443px] xs:h-[327px] xs:w-full object-cover'
                            />
                            <div className='flex flex-col gap-6'>
                                <p className='typo-heading_ss xs:typo-body_ls'>How do you want to bid?</p>
                                <div className='flex space-x-6 xs:flex-col xs:space-x-0 xs:space-y-3'>
                                    {/* Checkbox 1 - With Cash */}
                                    <label className='flex items-center space-x-2 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={withCash}
                                            onChange={(e) => setWithCash(e.target.checked)}
                                            className='w-5 h-5 text-primary accent-primary border-border_gray rounded focus:ring-primary focus:ring-2'
                                        />
                                        <span className='typo-body_lr xs:typo-body_mr'>With Cash</span>
                                    </label>

                                    {/* Checkbox 2 - With Item */}
                                    <label className='flex items-center space-x-2 cursor-pointer'>
                                        <input
                                            type='checkbox'
                                            checked={withItem}
                                            onChange={(e) => setWithItem(e.target.checked)}
                                            className='w-5 h-5 text-primary accent-primary border-border_gray rounded focus:ring-primary focus:ring-2'
                                        />
                                        <span className='typo-body_lr xs:typo-body_mr'>With an Item</span>
                                    </label>
                                </div>

                                {/* Cash Input - Show when withCash is checked */}
                                {withCash && (
                                    <div className='relative w-full xs:flex-none mx-auto outline-none border-none'>
                                        <label htmlFor='cash-amount' className='typo-body_mr xs:typo-body_mr'>
                                            Offer your price
                                        </label>
                                        <input
                                            id='cash-amount'
                                            type='number'
                                            placeholder='Enter amount'
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            className='w-full h-[49px] pl-6 pr-4 py-2 typo-body_lr xs:typo-body_mr text-text_one border border-border_gray outline-none rounded-md focus:outline-none focus:ring-transparent focus:border-none'
                                        />
                                    </div>
                                )}

                                {/* Item Selector - Show when withItem is checked */}
                                {withItem && (
                                    <div className='relative w-full xs:flex-none mx-auto outline-none border-none'>
                                        <label htmlFor='item-select' className='typo-body_mr xs:typo-body_mr'>
                                            Select an Item
                                        </label>
                                        <div className='relative w-full h-[49px]'>
                                            <div
                                                className='flex items-center justify-between border p-2 rounded-lg cursor-pointer bg-white shadow-sm'
                                                onClick={() => setIsOpen(!isOpen)}
                                            >
                                                <div className='flex items-center gap-2'>
                                                    {selectedOption ? (
                                                        <span className='typo-body_lr'>{selectedOption.title}</span>
                                                    ) : (
                                                        <span className='typo-body_lr text-text_one '>
                                                            Select option
                                                        </span>
                                                    )}
                                                </div>
                                                <div className='flex items-center gap-2'>
                                                    {isOpen ? (
                                                        <Image
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                setSelectedOption(options[0]);
                                                                setIsOpen(false);
                                                            }}
                                                            src={'/cancel-circle.svg'}
                                                            height={20}
                                                            width={20}
                                                            alt='cancel'
                                                        />
                                                    ) : (
                                                        <Image
                                                            src={'/chevron-down.svg'}
                                                            height={14}
                                                            width={14}
                                                            alt='chevron down'
                                                        />
                                                    )}
                                                </div>
                                            </div>

                                            {isOpen && (
                                                <div className='absolute left-0 p-[22px] w-full bg-white border rounded-lg shadow-md z-10'>
                                                    <ul className='max-h-48 overflow-auto'>
                                                        {myItems.map((option) => (
                                                            <li
                                                                key={option.id}
                                                                className='flex h-[54px] items-center gap-4 mb-[24px] xs:mb-0 hover:bg-gray-100 cursor-pointer'
                                                                onClick={() => {
                                                                    setSelectedOption({
                                                                        id: option.id,
                                                                        img: option.imageUrls?.[0] || '/placeholder-product.svg',
                                                                        title: option.title
                                                                    });
                                                                    setIsOpen(false);
                                                                }}
                                                            >
                                                                <Image
                                                                    src={option.imageUrls?.[0] || '/placeholder-product.svg'}
                                                                    alt={option.title}
                                                                    width={54}
                                                                    height={54}
                                                                    className='h-[54px] w-[54px] xs:h-[32px] xs:w-[32px] object-cover rounded'
                                                                />
                                                                <span className='xs:typo-body_mr'>{option.title}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                    <Link
                                                        href={'/post-an-item'}
                                                        className='w-max mt-[20px] text-center typo-heading_sm xs:typo-body_lm text-primary'
                                                    >
                                                        + Add New Item
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                <div className='w-full'>
                                    <RegularButton text='Place offer' action={handleSubmit} isLoading={loading} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
};

export default MakeAnOffer;
