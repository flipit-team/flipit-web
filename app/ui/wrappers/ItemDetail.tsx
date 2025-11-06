'use client';
import Image from 'next/image';
import React, {useEffect, useState, useCallback} from 'react';
import SellersInfo from '../homepage/sellers-info';
import RegularButton from '../common/buttons/RegularButton';
import {createMessage, formatToNaira, timeAgo} from '~/utils/helpers';
import {ChatService} from '~/services/chat.service';
import {formatErrorForDisplay} from '~/utils/error-messages';
import UsedBadge from '../common/badges/UsedBadge';
import {Item} from '~/utils/interface';
import PopupSheet from '../common/popup-sheet/PopupSheet';
import ProfilePopup from '../homepage/profile-popup';
import MakeAnOffer from '../homepage/make-an-offer';
import {Loader} from 'lucide-react';
import SafetyTips from '../common/safety-tips/SafetyTips';
import ReportModalContent from '../homepage/report-issue';
import CallbackRequest from '../homepage/callback-request';
import Link from 'next/link';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import StarRating from '../common/star-rating/StarRating';
import SendMessage from '../homepage/send-message';
import MessageSent from '../homepage/message-sent';
import ImageGallery from '../common/image-gallery/ImageGallery';
import {useItemLike} from '~/hooks/useLikes';
import RemoveItemConfirmation from '../common/modals/RemoveItemConfirmation';

interface Props {
    item: Item;
}

const ItemDetail = (props: Props) => {
    const {item} = props;
    const [error, setError] = useState<string | null>(null);
    const [viewPhone, setViewPhone] = useState(false);
    const [input, setInput] = useState('');
    const [inputActive, setInputActive] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [messageLoading, setMessageLoading] = useState(false);
    const [messageError, setMessageError] = useState<string>('');
    const [messageSent, setMessageSent] = useState(false);
    const [showUnlikeModal, setShowUnlikeModal] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const {setShowPopup} = useAppContext();

    // Like functionality
    const {isLiked, toggleLike, loading: likeLoading} = useItemLike(item.id);
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams.toString());
    params.set('q', 'callback-request');

    const pushParam = (param: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('q', param);
        router.replace(`${pathname}?${params.toString()}`);
        setShowPopup(true);
    };

    const removeParam = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('q');
        setShowPopup(false);

        // Reset message states when closing modal
        setMessageError('');
        setMessageSent(false);

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
        router.refresh();
    };

    const handleCreate = async () => {
        if (!input) return;

        setCreateLoading(true);
        setError(null);

        try {
            const data = await createMessage(item?.seller.id.toString() ?? '', input, item?.id.toString() ?? '');
            setInput('');
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    const handleSendMessage = async (message: string) => {
        if (!message.trim() || !item?.seller?.id || !item?.id) return;

        setMessageLoading(true);
        setMessageError('');

        try {
            // Create chat with initial message in title field
            const chatResponse = await ChatService.createChat({
                receiverId: parseInt(item.seller.id.toString()),
                itemId: parseInt(item.id.toString()),
                title: message
            });

            if (chatResponse.error) {
                throw new Error(chatResponse.error.message || 'Failed to create chat');
            }

            setMessageSent(true);

            // Switch to success modal
            const params = new URLSearchParams(searchParams.toString());
            params.set('q', 'message-sent');
            router.replace(`${pathname}?${params.toString()}`);
        } catch (err: any) {
            const errorDetails = formatErrorForDisplay(err.message || err);
            setMessageError(errorDetails.message);
        } finally {
            setMessageLoading(false);
        }
    };

    const handleLikeClick = useCallback(
        async (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();

            if (!likeLoading) {
                if (isLiked) {
                    // If item is liked, show confirmation modal instead of immediately unliking
                    setShowUnlikeModal(true);
                } else {
                    // If item is not liked, like it directly
                    try {
                        await toggleLike();
                    } catch (error) {
                        console.error('Failed to like item:', error);
                    }
                }
            }
        },
        [isLiked, toggleLike, likeLoading]
    );

    const handleConfirmUnlike = useCallback(async () => {
        setShowUnlikeModal(false);
        try {
            await toggleLike();
        } catch (error) {
            console.error('Failed to unlike item:', error);
        }
    }, [toggleLike]);

    return (
        <>
            <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
                <div className='p-6 xs:p-0 shadow-lg xs:shadow-none'>
                    <ImageGallery
                        images={item?.imageUrls || []}
                        overlayElements={
                            <>
                                {item?.promoted && (
                                    <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                        Promoted
                                    </div>
                                )}
                                <div className='absolute bottom-4 right-3'>
                                    <button
                                        onClick={handleLikeClick}
                                        disabled={likeLoading}
                                        className={`h-[46px] w-[43px] cursor-pointer transition-opacity duration-200 ${
                                            likeLoading ? 'opacity-50' : 'hover:opacity-80'
                                        }`}
                                        title={isLiked ? 'Remove from saved items' : 'Save item'}
                                    >
                                        <Image
                                            src={isLiked ? '/liked.svg' : '/save-item.svg'}
                                            alt={isLiked ? 'liked item' : 'save item'}
                                            height={46}
                                            width={43}
                                            className='w-full h-full'
                                        />
                                    </button>
                                </div>
                            </>
                        }
                    />
                    <div className='flex items-center justify-between mt-4'>
                        <div className='flex items-center gap-1'>
                            <Image
                                onClick={handleCreate}
                                src={'/eye.svg'}
                                height={22}
                                width={22}
                                alt='mic'
                                className='h-[22px] w-[22px]'
                            />
                            <p className='typo-body_mr text-text_four'>250 views</p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <p className='typo-body_mr text-text_one'>Share with friends</p>
                            <div className='flex items-center gap-3'>
                                <Image
                                    onClick={handleCreate}
                                    src={'/facebook.svg'}
                                    height={24}
                                    width={24}
                                    alt='mic'
                                    className='h-[24px] w-[24px]'
                                />
                                <Image
                                    onClick={handleCreate}
                                    src={'/whatsapp.svg'}
                                    height={24}
                                    width={24}
                                    alt='mic'
                                    className='h-[24px] w-[24px]'
                                />
                                <Image
                                    onClick={handleCreate}
                                    src={'/x.svg'}
                                    height={24}
                                    width={24}
                                    alt='mic'
                                    className='h-[24px] w-[24px]'
                                />
                            </div>
                        </div>
                    </div>
                    <div className='mt-6 mb-4'>
                        <div className='typo-body_lm text-text_one'>Details</div>
                        <p className='typo-body_mr text-text_one mt-2'>{item?.description}</p>
                    </div>

                    <div>
                        <div className='typo-body_lm'>Specifications</div>
                        <table className='w-full mt-2 typo-body_sr'>
                            <tbody>
                                <tr>
                                    <td className='pr-8 py-1'>Type</td>
                                    <td>Camera</td>
                                </tr>
                                <tr>
                                    <td className='pr-8 py-1'>Brand</td>
                                    <td>Canon</td>
                                </tr>
                                <tr>
                                    <td className='pr-8 py-1'>Condition</td>
                                    <td>Fairly used</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className='p-6 xs:p-0 shadow-lg xs:shadow-none'>
                    <UsedBadge text={item?.condition} />
                    <div className='typo-heading_ms xs:typo-heading_ss text-text_one mt-[10px] capitalize'>
                        {item?.title}
                    </div>
                    <p className='typo-heading_sm text-primary xs:typo-body_mm xs:mb-1'>
                        {formatToNaira(item?.cashAmount ?? 0)}
                    </p>
                    <p className='typo-body_mr text-text_four mb-[42px]'>{timeAgo(item?.dateCreated)}</p>
                    <RegularButton text='Make an offer' slug='make-an-offer' usePopup />
                    <div className='h-6'></div>
                    <RegularButton text='Buy right away' isLight action={() => router.push('/transaction/1')} />

                    <div className='typo-body_mm text-text_one mt-6'>Location</div>
                    <div className='typo-body_mr text-text_four mb-8'>{item?.location}</div>
                    <SellersInfo />
                    <div className='flex mb-4'>
                        <Image
                            src={item?.seller?.avatar || '/placeholder-avatar.svg'}
                            height={52}
                            width={52}
                            sizes="52px"
                            quality={70}
                            alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                            className='h-[52px] w-[52px] rounded-full object-cover'
                        />
                        <div className='w-full ml-2'>
                            <div className='typo-body_lm'>{item?.seller.firstName + ' ' + item?.seller.lastName}</div>
                            <div className='h-[23px] w-max px-[2px] bg-surface-primary-16 text-primary  flex items-center justify-center rounded typo-body_sr'>
                                {item?.seller.dateVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className='flex my-1'>
                                <StarRating rating={item?.seller.avgRating || item?.seller.avg_rating || 0} size={20} />
                            </div>
                            <p className='typo-body_sr text-text_four'>Responds within minutes</p>
                            <p className='typo-body_sr text-text_four'>Joined Flipit in 2024</p>
                        </div>
                    </div>
                    <div className='flex gap-6 mb-6'>
                        <div
                            onClick={() => pushParam('send-message')}
                            className={`w-[232px] border border-primary flex items-center justify-center h-[51px] bg-surface-primary-16 rounded-lg text-primary typo-body_ls cursor-pointer`}
                        >
                            {'Send Message'}
                        </div>
                        <div
                            onClick={() => pushParam('callback-request')}
                            className={`w-[232px] text-text_four border border-text_four flex items-center justify-center h-[51px] rounded-lg typo-body_ls cursor-pointer`}
                        >
                            {'Request Callback'}
                        </div>
                    </div>
                    <SafetyTips />
                    <div className='flex items-center gap-4 mt-6 justify-self-center'>
                        <div className='typo-body_lm'>{item?.seller.reviewCount || 0} Feedback</div>
                        {(item?.seller.reviewCount || 0) > 0 && (
                            <Link
                                href={`/feedback?sellerId=${item?.seller.id}&itemId=${item?.id}`}
                                className='border border-border_gray h-[30px] w-[93px] flex items-center justify-center typo-body_mr text-text_four rounded-lg cursor-pointer'
                            >
                                View all
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            <PopupSheet>
                <ProfilePopup
                    seller={
                        item?.seller
                            ? {
                                  title: item.seller.title || '',
                                  firstName: item.seller.firstName,
                                  middleName: item.seller.middleName || '',
                                  lastName: item.seller.lastName,
                                  email: item.seller.email,
                                  phoneNumber: item.seller.phoneNumber,
                                  avatar: item.seller.avatar || item.seller.profileImageUrl || '',
                                  avg_rating: item.seller.avg_rating || item.seller.avgRating || 0,
                                  status: item.seller.status || 'Active',
                                  phoneNumberVerified: item.seller.phoneNumberVerified || false,
                                  dateVerified: new Date(
                                      item.seller.dateVerified || item.seller.dateCreated || new Date()
                                  ),
                                  reviewCount: item.seller.reviewCount || 0
                              }
                            : undefined
                    }
                    onClose={() => removeParam()}
                    onSubmit={() => removeParam()}
                />
                <MakeAnOffer item={item} onClose={() => removeParam()} onSubmit={() => removeParam()} />
                <ReportModalContent
                    title='Report Canon EOS RP Camera +Small Rig'
                    onClose={() => removeParam()}
                    onSubmit={() => removeParam()}
                />
                <CallbackRequest
                    title='Request for Callback'
                    onClose={() => removeParam()}
                    onSubmit={() => removeParam()}
                />
                <SendMessage
                    title='Send message to seller'
                    onClose={() => removeParam()}
                    onSubmit={handleSendMessage}
                    loading={messageLoading}
                    error={messageError}
                />
                <MessageSent title='Message Sent' onClose={() => removeParam()} />
            </PopupSheet>

            {/* Unlike confirmation modal */}
            <RemoveItemConfirmation
                item={item}
                isOpen={showUnlikeModal}
                onClose={() => setShowUnlikeModal(false)}
                onConfirm={handleConfirmUnlike}
                isRemoving={likeLoading}
            />
        </>
    );
};

export default ItemDetail;
