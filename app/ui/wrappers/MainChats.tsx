'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, {useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {Chat} from '~/utils/interface';
import dynamic from 'next/dynamic';
import {formatTimeTo12Hour, sendMessage} from '~/utils/helpers';
import NoData from '../common/no-data/NoData';
import {useRouter, useSearchParams} from 'next/navigation';
import {useChatMessages, useUserMessages} from '~/hooks/useChatMessages';
import {Loader} from 'lucide-react';
const LoaderMain = dynamic(() => import('../common/loader/Loader'), {ssr: false});

interface Props {
    chatData: {buyer: Chat[]; seller: Chat[]};
}
const MainChats = (props: Props) => {
    const {chatData} = props;
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {userId} = useAppContext();
    const chatId = searchParams.get('chatId');
    const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('buyer');
    const displayedChat = activeTab === 'buyer' ? chatData.buyer : chatData.seller;
    const [activeChat, setActiveChat] = useState<Chat | null>(null);

    const pushParam = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('chatId', id);
        router.push(`/messages?${params.toString()}`);
    };

    const {messages, isLoading, error: chatError} = useChatMessages(chatId);
    const {
        messages: userMessages,
        isLoading: userMessagesLoading,
        error: userMessagesError
    } = useUserMessages(userId?.toString());

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await sendMessage(activeChat?.chatId ?? '', input);
            console.log('✅ Message sent:', data);
            setInput('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (userMessagesLoading)
        return (
            <div className='w-full py-10'>
                <LoaderMain color='green' />
            </div>
        );
    if (!chatData.seller?.length && !chatData.buyer?.length) {
        return (
            <div className='h-full my-auto'>
                <NoData text='No Chats Available' />;
            </div>
        );
    }

    return (
        <div className='mx-[120px] xs:mx-0 my-6 xs:my-0'>
            <h1 className='typo-heading_ms my-6 xs:hidden'>My Messages</h1>
            <div className='grid grid-cols-[424px_1fr] xs:grid-cols-1 gap-6'>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent xs:hidden'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_lm'>
                        <div
                            className={` py-6 ${activeTab === 'seller' ? ' border-b border-primary text-primary' : 'text-text_four'}`}
                            onClick={() => setActiveTab('seller')}
                        >
                            Selling
                        </div>
                        <div
                            className={` py-6 ${activeTab === 'buyer' ? ' border-b border-primary text-primary' : 'text-text_four'}`}
                            onClick={() => setActiveTab('buyer')}
                        >
                            Buying
                        </div>
                    </div>
                    {displayedChat?.map((chat, i) => {
                        return (
                            <div
                                key={i}
                                onClick={() => {
                                    pushParam(chat.chatId);
                                    setActiveChat(chat);
                                }}
                                className={`h-[130px] ${chat.chatId === activeChat?.chatId ? 'bg-[rgba(0,95,115,0.1)]' : ''} flex p-6 border-b border-[#EEEEE9]`}
                            >
                                <Image
                                    src={chat.initiatorAvatar ?? '/profile-picture.svg'}
                                    height={50}
                                    width={50}
                                    alt='picture'
                                    className='h-[50px] w-[50px] mr-4'
                                />
                                <div>
                                    <p className='text-primary typo-body_lm capitalize'>{chat.initiatorName}</p>
                                    <p className='typo-body_mr w-[203px] line-clamp-2'>{chat.title}</p>
                                </div>
                                <p className='typo-body_sr xs:hidden'></p>
                                {formatTimeTo12Hour(chat.dateCreated)}
                            </div>
                        );
                    })}
                </div>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent hidden xs:block'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_lm'>
                        <div
                            className={`text-primary py-6 ${activeTab === 'seller' ? ' border-b border-primary' : ''}`}
                            onClick={() => setActiveTab('seller')}
                        >
                            Selling
                        </div>
                        <div
                            className={`text-text_four py-6 ${activeTab === 'buyer' ? ' border-b border-primary' : ''}`}
                            onClick={() => setActiveTab('buyer')}
                        >
                            Buying
                        </div>
                    </div>
                    {displayedChat?.map((chat, i) => {
                        return (
                            <Link
                                key={i}
                                href={`/messages/${chat.chatId}`}
                                className={`h-[130px] ${chat.chatId === activeChat?.chatId ? 'bg-[rgba(0,95,115,0.1)]' : ''} flex p-6 border-b border-[#EEEEE9]`}
                            >
                                <Image
                                    src={chat.initiatorAvatar ?? '/profile-picture.svg'}
                                    height={50}
                                    width={50}
                                    alt='picture'
                                    className='h-[50px] w-[50px] mr-4'
                                />
                                <div>
                                    <p className='text-primary typo-body_lm capitalize'>{chat.initiatorName}</p>
                                    <p className='typo-body_mr w-[203px] line-clamp-2'>{chat.title}</p>
                                </div>
                                <p className='typo-body_sr xs:hidden'></p>
                                {formatTimeTo12Hour(chat.dateCreated)}
                            </Link>
                        );
                    })}
                </div>
                <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent xs:hidden'>
                    {activeChat && (
                        <div className='flex items-center p-6'>
                            <Image
                                src={activeChat?.initiatorAvatar ?? '/profile-picture.svg'}
                                height={50}
                                width={50}
                                alt='picture'
                                className='h-[50px] w-[50px] mr-4'
                            />
                            <p className='typo-body_lm capitalize'>{activeChat?.initiatorName}</p>
                        </div>
                    )}
                    {activeChat && (
                        <div className='flex items-center justify-center typo-heading_sm text-primary bg-[rgba(0,95,115,0.2)] h-[42px]'>
                            {activeChat?.title}
                        </div>
                    )}
                    <div className='p-[40px] flex flex-col gap-2'>
                        {messages?.map((item, i) => {
                            return (
                                <div key={i} className={`w-2/4 ${item.sentBy === userId ? 'ml-auto' : 'mr-auto'}`}>
                                    <div
                                        className={`${item.sentBy === userId ? 'bg-[rgba(0,95,115,0.1)]' : 'bg-[#f8f8f7]'} p-3 rounded-lg`}
                                    >
                                        {item.message}
                                    </div>
                                    <p
                                        className={`text-[#87928A] typo-body_mr ${item.sentBy === userId ? '' : 'text-right'}`}
                                    >
                                        {formatTimeTo12Hour(item.dateCreated)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {activeChat && (
                        <div className='h-[96px] border-t border-border_gray flex items-center px-[40px]'>
                            <Image
                                src={'/microphone.svg'}
                                height={24}
                                width={24}
                                alt='mic'
                                className='h-[24px] w-[24px] mr-2'
                            />
                            <input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                type='text'
                                className='h-full w-full typo-body_lr focus:ring-transparent outline-none'
                                placeholder='Type in your message here'
                            />
                            {loading ? (
                                <Loader height={35} width={35} />
                            ) : (
                                <Image
                                    onClick={handleSend}
                                    src={'/send.svg'}
                                    height={39}
                                    width={87}
                                    alt='mic'
                                    className='h-[39px] w-[87px]'
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainChats;
