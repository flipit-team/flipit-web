'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import SellersInfo from '../homepage/sellers-info';
import RegularButton from '../common/buttons/RegularButton';
import {createMessage, formatToNaira, timeAgo} from '~/utils/helpers';
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
import SendMessage from '../homepage/send-message';
import ImageGallery from '../common/image-gallery/ImageGallery';

interface Props {
    item: Item;
}

const Home = (props: Props) => {
    const {item} = props;
    const [error, setError] = useState<string | null>(null);
    const [viewPhone, setViewPhone] = useState(false);
    const [input, setInput] = useState('');
    const [inputActive, setInputActive] = useState(false);
    const [createLoading, setCreateLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const router = useRouter();
    const pathname = usePathname();

    const {setShowPopup} = useAppContext();
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

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
        router.refresh();
    };

    const handleCreate = async () => {
        if (!input) return;

        setCreateLoading(true);
        setError(null);

        try {
            const data = await createMessage(item?.seller.id ?? '', input, item?.id.toString() ?? '');
            console.log('✅ Message sent:', data);
            setInput('');
            setSuccess(true);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setCreateLoading(false);
        }
    };

    return (
        <>
            <div className='grid-sizes grid grid-cols-[712px_1fr] xs:grid-cols-1 gap-6 h-full mt-10 xs:mb-6'>
                <div className='p-6 xs:p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'>
                    <ImageGallery
                        mainImage={{
                            src: '/camera-large.png',
                            alt: 'picture',
                            width: 712,
                            height: 443
                        }}
                        thumbnails={[
                            { src: '/camera-large.png', alt: 'picture', width: 222, height: 150 },
                            { src: '/camera-large.png', alt: 'picture', width: 222, height: 150 },
                            { src: '/camera-large.png', alt: 'picture', width: 222, height: 150 }
                        ]}
                        thumbnailPosition="bottom"
                        overlayElements={
                            <>
                                <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute top-7 left-3 flex items-center justify-center rounded'>
                                    Promoted
                                </div>
                                <div className='absolute top-4 right-3'>
                                    <Image
                                        className='h-[46px] w-[43px] cursor-pointer'
                                        src={'/save-item.svg'}
                                        alt='search'
                                        height={46}
                                        width={43}
                                    />
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
                <div className='p-6 xs:p-0 shadow-[0px_4px_10px_rgba(0,0,0,0.2)]'>
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
                    <RegularButton text='Buy right away' isLight action={() => setInputActive(!inputActive)} />

                    <div className='typo-body_mm text-text_one mt-6'>Location</div>
                    <div className='typo-body_mr text-text_four mb-8'>{item?.location}</div>
                    <SellersInfo />
                    <div className='flex mb-4'>
                        <Image
                            src={'/camera-large.png'}
                            height={52}
                            width={52}
                            alt='picture'
                            className='h-[52px] w-[52px] rounded-full'
                        />
                        <div className='w-full ml-2'>
                            <div className='typo-body_lm'>{item?.seller.firstName + ' ' + item?.seller.lastName}</div>
                            <div className='h-[23px] w-max px-[2px] bg-[#005f7329] text-primary  flex items-center justify-center rounded typo-body_sr'>
                                {item?.seller.dateVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className='flex my-1'>
                                {Array.from('11111').map((item, i) => {
                                    return (
                                        <Image
                                            key={i}
                                            src={'/full-star.svg'}
                                            height={20}
                                            width={20}
                                            alt='picture'
                                            className='h-[20px] w-[20px] rounded-full'
                                        />
                                    );
                                })}
                            </div>
                            <p className='typo-body_sr text-text_four'>Responds within minutes</p>
                            <p className='typo-body_sr text-text_four'>Joined Flipit in 2024</p>
                        </div>
                    </div>
                    <div className='flex gap-6 mb-6'>
                        <div
                            onClick={() => pushParam('send-message')}
                            className={`w-[232px] border border-primary flex items-center justify-center h-[51px] bg-[#005f7329] rounded-lg text-primary typo-body_ls cursor-pointer`}
                        >
                            {'Send Message'}
                        </div>
                        <div
                            onClick={() => pushParam('callback-request')}
                            className={`w-[232px] text-text_four border border-text_four flex items-center justify-center h-[51px] rounded-lg typo-body_ls cursor-pointer`}
                        >
                            {'Request for Callback'}
                        </div>
                    </div>
                    <SafetyTips />
                    <div className='flex items-center gap-4 mt-6 justify-self-center'>
                        <div className='typo-body_lm'>4 Feedback</div>
                        <Link
                            href={'/feedback'}
                            className='border border-border_gray h-[30px] w-[93px] flex items-center justify-center typo-body_mr text-text_four rounded-lg cursor-pointer'
                        >
                            View all
                        </Link>
                    </div>
                </div>
            </div>
            <PopupSheet>
                <ProfilePopup seller={item?.seller} onClose={() => removeParam()} onSubmit={() => removeParam()} />
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
                    onSubmit={() => removeParam()}
                />
            </PopupSheet>
        </>
    );
};

export default Home;
