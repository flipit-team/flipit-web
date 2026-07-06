'use client';
import Image from 'next/image';
import React, {useEffect, useState, useCallback} from 'react';
import SellersInfo from '../homepage/sellers-info';
import RegularButton from '../common/buttons/RegularButton';
import {createMessage, formatToNaira, timeAgo} from '~/utils/helpers';
import {ChatService} from '~/services/chat.service';
import {formatErrorForDisplay} from '~/utils/error-messages';
import UsedBadge from '../common/badges/UsedBadge';
import TransactionTypeBadge from '../common/badges/TransactionTypeBadge';
import {Item} from '~/utils/interface';
import PopupSheet from '../common/popup-sheet/PopupSheet';
import ProfilePopup from '../homepage/profile-popup';
import MakeAnOffer from '../homepage/make-an-offer';
import {Loader, ChevronLeft, Bookmark, ChevronRight} from 'lucide-react';
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
    const [expandedSection, setExpandedSection] = useState<string | null>(null);
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

    // Determine CTA text
    const ctaText = item?.acceptCash && !(item?.flipForImgUrls && item.flipForImgUrls.length > 0)
        ? 'Buy Right Away'
        : !item?.acceptCash && !!(item?.flipForImgUrls && item.flipForImgUrls.length > 0)
        ? 'Make a Barter Offer'
        : 'Make an Offer';

    return (
        <>
            {/* Desktop back button */}
            <button
                onClick={() => router.back()}
                className='flex items-center gap-1 text-text_one typo-body_mr mt-6 mb-4 ml-6 xs:hidden cursor-pointer hover:text-primary transition-colors'
            >
                <ChevronLeft size={20} />
                <span>Go Back</span>
            </button>

            {/* Mobile header */}
            <div className='hidden xs:flex items-center gap-3 px-4 pt-4 pb-2 mb-2'>
                <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center'>
                    <ChevronLeft size={20} className='text-text_one' />
                </button>
                <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Item Details</h1>
            </div>

            <div className='grid-sizes grid grid-cols-[2fr_1fr] xs:grid-cols-1 gap-6 xs:gap-0 h-full xs:mb-6 xs:pb-24'>
                <div className='p-6 xs:p-0 shadow-lg xs:shadow-none'>
                    <ImageGallery
                        images={item?.imageUrls || []}
                        overlayElements={
                            <>
                                {item?.promoted && (
                                    <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute top-7 left-3 xs:top-2 xs:left-2 flex items-center justify-center rounded'>
                                        Promoted
                                    </div>
                                )}
                                {/* Trade type badge on image — hidden on mobile (shown in content below) */}
                                <div className='absolute top-3 left-3 xs:hidden'>
                                    <TransactionTypeBadge acceptCash={item?.acceptCash ?? true} hasSwapItems={false} />
                                </div>
                                <div className='absolute bottom-4 right-3 xs:hidden'>
                                    <button
                                        onClick={handleLikeClick}
                                        disabled={likeLoading}
                                        className={`h-[46px] w-[43px] cursor-pointer transition-opacity duration-200 ${
                                            likeLoading ? 'opacity-50' : 'hover:opacity-80'
                                        }`}
                                        title={isLiked ? 'Remove from saved items' : 'Save item'}
                                    >
                                        <Image
                                            src={isLiked ? '/icons/action/liked.svg' : '/icons/action/save.svg'}
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
                    <div className='flex items-center justify-between mt-4 xs:mt-2'>
                        <div className='flex items-center gap-1'>
                            <Image
                                src={'/icons/ui/eye.svg'}
                                height={22}
                                width={22}
                                alt='views'
                                className='h-[22px] w-[22px] xs:h-[16px] xs:w-[16px]'
                            />
                            <p className='typo-body_mr xs:typo-body_sr text-text_four'>
                                <span className='xs:hidden'>{timeAgo(item?.dateCreated)}</span>
                                <span className='hidden xs:inline'>{(item as any)?.views || 0} views</span>
                            </p>
                        </div>
                        <div className='flex items-center gap-3'>
                            <p className='typo-body_mr text-text_one'>Share with friends</p>
                            <div className='flex items-center gap-3'>
                                <Image
                                    onClick={() => window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(window.location.href))}
                                    src={'/icons/social/facebook.svg'}
                                    height={24}
                                    width={24}
                                    alt='share on facebook'
                                    className='h-[24px] w-[24px] cursor-pointer'
                                />
                                <Image
                                    onClick={() => window.open('https://wa.me/?text=' + encodeURIComponent(item?.title + ' ' + window.location.href))}
                                    src={'/icons/social/whatsapp.svg'}
                                    height={24}
                                    width={24}
                                    alt='share on whatsapp'
                                    className='h-[24px] w-[24px] cursor-pointer'
                                />
                                <Image
                                    onClick={() => window.open('https://twitter.com/intent/tweet?url=' + encodeURIComponent(window.location.href) + '&text=' + encodeURIComponent(item?.title || ''))}
                                    src={'/icons/social/x.svg'}
                                    height={24}
                                    width={24}
                                    alt='share on x'
                                    className='h-[24px] w-[24px] cursor-pointer'
                                />
                            </div>
                        </div>
                    </div>

                    {/* Mobile: trade badge + title + price + posted time */}
                    <div className='hidden xs:block mt-3'>
                        <div className='mb-2'>
                            <div className='w-fit'><TransactionTypeBadge acceptCash={item?.acceptCash ?? true} hasSwapItems={false} /></div>
                        </div>
                        <h2 className='font-poppins font-semibold text-[20px] text-text_one capitalize'>{item?.title}</h2>
                        {item?.acceptCash && (
                            <p className='font-poppins typo-body-lg-semibold text-primary mt-1'>
                                {formatToNaira(item?.cashAmount ?? 0)}
                            </p>
                        )}
                        <p className='font-poppins typo-body-xs-regular text-text_four mt-1'>{timeAgo(item?.dateCreated)}</p>
                    </div>

                    {/* Desktop: Details section (always visible) */}
                    <div className='mt-6 mb-4 xs:hidden'>
                        <div className='typo-body_lm text-text_one'>Details</div>
                        <p className='typo-body_mr text-text_one mt-2'>{item?.description}</p>
                    </div>

                    {/* Desktop: Specifications section (always visible) */}
                    <div className='xs:hidden'>
                        <div className='typo-body_lm'>Specifications</div>
                        <table className='w-full mt-2 typo-body_sr'>
                            <tbody>
                                <tr>
                                    <td className='pr-8 py-1'>Type</td>
                                    <td>{item?.itemCategory?.name || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className='pr-8 py-1'>Brand</td>
                                    <td>{item?.brand || 'N/A'}</td>
                                </tr>
                                <tr>
                                    <td className='pr-8 py-1'>Condition</td>
                                    <td>{item?.condition || 'N/A'}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile: Collapsible sections */}
                    <div className='hidden xs:flex flex-col gap-2 mt-4'>
                        {/* Description */}
                        <button
                            onClick={() => setExpandedSection(expandedSection === 'description' ? null : 'description')}
                            className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                        >
                            <span className='font-poppins typo-body-md-medium text-text_one'>Description</span>
                            <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'description' ? 'rotate-90' : ''}`} />
                        </button>
                        {expandedSection === 'description' && (
                            <div className='px-4 pb-3'>
                                <p className='typo-body_mr text-text_one'>{item?.description}</p>
                            </div>
                        )}

                        {/* Specification */}
                        <button
                            onClick={() => setExpandedSection(expandedSection === 'specification' ? null : 'specification')}
                            className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                        >
                            <span className='font-poppins typo-body-md-medium text-text_one'>Specification</span>
                            <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'specification' ? 'rotate-90' : ''}`} />
                        </button>
                        {expandedSection === 'specification' && (
                            <div className='px-4 pb-3'>
                                <table className='w-full typo-body_sr'>
                                    <tbody>
                                        <tr>
                                            <td className='pr-8 py-1'>Type</td>
                                            <td>{item?.itemCategory?.name || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-8 py-1'>Brand</td>
                                            <td>{item?.brand || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td className='pr-8 py-1'>Condition</td>
                                            <td>{item?.condition || 'N/A'}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Seller Information */}
                        <button
                            onClick={() => setExpandedSection(expandedSection === 'seller' ? null : 'seller')}
                            className='w-full flex items-center justify-between bg-surface-primary rounded-lg px-4 py-3'
                        >
                            <span className='font-poppins typo-body-md-medium text-text_one'>Seller Information</span>
                            <ChevronRight size={18} className={`text-primary transition-transform ${expandedSection === 'seller' ? 'rotate-90' : ''}`} />
                        </button>
                        {expandedSection === 'seller' && (
                            <div className='px-4 pb-3'>
                                <div className='flex mb-3'>
                                    <Image
                                        src={item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                        height={44}
                                        width={44}
                                        sizes="44px"
                                        quality={70}
                                        alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                                        className='h-[44px] w-[44px] rounded-full object-cover'
                                    />
                                    <div className='ml-2'>
                                        <div className='typo-body_lm'>{item?.seller.firstName + ' ' + item?.seller.lastName}</div>
                                        <div className='flex items-center gap-1'>
                                            <StarRating rating={item?.seller.avgRating || item?.seller.avg_rating || 0} size={16} />
                                            <span className='typo-body_sr text-text_four'>{item?.seller.reviewCount || 0} reviews</span>
                                        </div>
                                        <p className='typo-body_sr text-text_four'>{item?.location || 'Nigeria'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                <div className='xs:hidden'>
                    {/* Item info box */}
                    <div className='border border-border_gray rounded-lg p-6 mb-6'>
                        {/* Trade type badge + description */}
                        <div className='mb-3'>
                            {/* Swap only */}
                            {!item?.acceptCash && !!(item?.flipForImgUrls && item.flipForImgUrls.length > 0) && (
                                <>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-fit'>
                                            <TransactionTypeBadge acceptCash={false} hasSwapItems={true} />
                                        </div>
                                        <span className='font-poppins typo-body-md-regular text-text_one'>Seller accepts item trades</span>
                                    </div>
                                    <p className='font-poppins typo-body-md-regular text-text_one'>
                                        Interested in trading? Seller is trading for <span className='font-semibold'>{item?.itemCategory?.name?.toLowerCase() || 'items'}</span>
                                    </p>
                                </>
                            )}
                            {/* Cash + Swap */}
                            {item?.acceptCash && !!(item?.flipForImgUrls && item.flipForImgUrls.length > 0) && (
                                <>
                                    <div className='flex items-center gap-3 mb-2'>
                                        <div className='w-fit'>
                                            <TransactionTypeBadge acceptCash={true} hasSwapItems={true} />
                                        </div>
                                        <span className='font-poppins typo-body-md-regular text-text_one'>Seller accepts item trades plus cash</span>
                                    </div>
                                    <p className='font-poppins typo-body-md-regular text-text_one'>
                                        Interested in trading? Seller is trading for <span className='font-semibold'>{item?.itemCategory?.name?.toLowerCase() || 'items'}</span>
                                    </p>
                                </>
                            )}
                            {/* Cash only */}
                            {item?.acceptCash && !(item?.flipForImgUrls && item.flipForImgUrls.length > 0) && (
                                <div className='w-fit'>
                                    <TransactionTypeBadge acceptCash={true} hasSwapItems={false} />
                                </div>
                            )}
                        </div>

                        {/* Title */}
                        <h2 className='font-poppins font-semibold text-[18px] text-text_one capitalize mt-2'>
                            {item?.title}
                        </h2>

                        {/* Price - only show for cash and mixed trade */}
                        {item?.acceptCash && (
                            <p className='font-poppins typo-body-lg-semibold text-primary mt-1'>
                                {formatToNaira(item?.cashAmount ?? 0)}
                            </p>
                        )}

                        <p className='font-poppins typo-body-xs-regular text-text_four mt-1 mb-4'>{timeAgo(item?.dateCreated)}</p>

                        {/* Action button */}
                        {item?.acceptCash && !(item?.flipForImgUrls && item.flipForImgUrls.length > 0) ? (
                            <RegularButton text='Buy Right Away' slug='make-an-offer' usePopup />
                        ) : !item?.acceptCash && !!(item?.flipForImgUrls && item.flipForImgUrls.length > 0) ? (
                            <RegularButton text='Make a Barter Offer' slug='make-an-offer' usePopup />
                        ) : (
                            <RegularButton text='Make an Offer' slug='make-an-offer' usePopup />
                        )}
                    </div>

                    {/* Seller information section */}
                    <div className='border border-border_gray rounded-lg p-6 mt-8'>
                        <SellersInfo />
                        <div className='flex mb-4'>
                            <Image
                                src={item?.seller?.avatar || '/images/placeholders/placeholder-avatar.svg'}
                                height={52}
                                width={52}
                                sizes="52px"
                                quality={70}
                                alt={`${item?.seller.firstName} ${item?.seller.lastName}`}
                                className='h-[52px] w-[52px] rounded-full object-cover'
                            />
                            <div className='w-full ml-2'>
                                <div className='typo-body_lm'>{item?.seller.firstName + ' ' + item?.seller.lastName}</div>
                                <div className='h-[23px] w-max px-[2px] bg-surface-primary-16 text-primary flex items-center justify-center rounded typo-body_sr'>
                                    {item?.seller.dateVerified ? 'Verified profile' : 'Unverified profile'}
                                </div>
                                <div className='flex my-1'>
                                    <StarRating rating={item?.seller.avgRating || item?.seller.avg_rating || 0} size={20} />
                                </div>
                                <p className='typo-body_sr text-text_four'>{item?.location || 'Nigeria'}</p>
                            </div>
                        </div>
                        <div className='flex gap-4'>
                            <div
                                onClick={() => pushParam('send-message')}
                                className='flex-1 border border-primary flex items-center justify-center h-[44px] bg-surface-primary-16 rounded-lg text-primary typo-body_ls cursor-pointer hover:text-primary-light hover:border-primary-light transition-colors'
                            >
                                Send a Message
                            </div>
                        </div>
                    </div>
                    <div className='mt-8'>
                        <SafetyTips />
                    </div>
                    <div className='flex items-center gap-4 mt-6 justify-self-center'>
                        <div className='typo-body_lm'>{item?.seller.reviewCount || 0} Feedback</div>
                        {(item?.seller.reviewCount || 0) > 0 && (
                            <Link
                                href={`/feedback?sellerId=${item?.seller.id}&itemId=${item?.id}`}
                                className='border border-border_gray h-[30px] w-[93px] flex items-center justify-center typo-body_mr text-text_four rounded-lg cursor-pointer hover:text-primary-light hover:border-primary-light transition-colors'
                            >
                                View all
                            </Link>
                        )}
                    </div>
                </div>
            </div>
            {/* Mobile fixed bottom action bar */}
            <div className='hidden xs:flex items-center fixed bottom-0 left-0 right-0 bg-white px-4 py-3 z-[9999] gap-6'>
                <button
                    onClick={handleLikeClick}
                    disabled={likeLoading}
                    className='w-11 h-11 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0'
                >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill={isLiked ? '#025F73' : 'none'} stroke="#025F73" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>
                </button>
                <button
                    onClick={() => pushParam('make-an-offer')}
                    className='flex-1 h-[48px] bg-primary text-white rounded-xl font-poppins typo-body-md-semibold'
                >
                    {ctaText}
                </button>
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
                <MakeAnOffer item={item} onClose={() => removeParam()} />
                <ReportModalContent
                    title={`Report ${item?.title || 'this item'}`}
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
