'use client';
import {Loader} from 'lucide-react';
import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useState, useRef} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {useUnreadCount} from '~/contexts/UnreadCountContext';
import {useChatMessages} from '~/hooks/useChatMessages';
import {formatTimeTo12Hour, formatMessageTime, sendMessage} from '~/utils/helpers';
import {Message} from '~/utils/interface';
import {ChatService} from '~/services/chat.service';

const MobileChat = () => {
    const params = useParams();
    const router = useRouter();
    const chatId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAppContext();
    const {decrementMessageCount} = useUnreadCount();
    const [chats, setChats] = useState<Message[] | null>([]);
    const [input, setInput] = useState('');
    const hasMarkedAsRead = useRef(false);

    const {messages, isLoading, error: chatError, mutate: mutateMessages} = useChatMessages(chatId);

    // Mark messages as read when component mounts
    useEffect(() => {
        if (chatId && !hasMarkedAsRead.current) {
            hasMarkedAsRead.current = true;

            // Optimistically decrement counter (assume 1 unread for now)
            // The actual count will sync from backend on next refresh
            decrementMessageCount(1);

            // Mark as read in backend (fire and forget)
            ChatService.markMessagesAsRead(chatId).catch(err => {
                console.error('Failed to mark messages as read:', err);
            });
        }
    }, [chatId, decrementMessageCount]);

    const handleSend = async () => {
        if (!input) return;

        setLoading(true);
        setError(null);

        try {
            const data = await sendMessage(chatId ?? '', input);
            setInput('');

            // Immediately refresh messages after sending
            mutateMessages();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='shadow-lg xs:shadow-transparent h-full flex flex-col flex-1'>
            <div className='flex items-center justify-center typo-heading_sm xs:typo-body_lm text-primary bg-surface-primary-20 h-[42px] relative px-4'>
                <button
                    onClick={() => router.back()}
                    className='absolute left-4 flex items-center justify-center'
                    aria-label='Go back'
                >
                    <svg
                        className='w-6 h-6 text-primary'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                    >
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M15 19l-7-7 7-7'
                        />
                    </svg>
                </button>
                iPhone 12 promax
            </div>

            <div className='p-[40px] flex flex-col gap-2 flex-1 h-full'>
                {isLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='flex items-center gap-2 text-text-secondary'>
                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
                            <span className='typo-body-md-regular'>Loading messages...</span>
                        </div>
                    </div>
                ) : (
                    messages?.map((item, i) => {
                        return (
                            <div key={i} className={`w-[90%] ${item.sentBy === Number(user?.userId) ? 'mr-auto' : 'ml-auto'}`}>
                                <div
                                    className={`${item.sentBy === Number(user?.userId) ? 'bg-background-tertiary' : 'bg-surface-primary-10'} p-3 rounded-lg`}
                                >
                                    {item.message}
                                </div>
                                <p className={`text-text-accent typo-body_mr  ${item.sentBy === Number(user?.userId) ? '' : 'text-right'}`}>
                                    {formatMessageTime(item.dateCreated)}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>
            <div className='h-[86px] border-t border-border_gray flex items-center px-[20px]'>
                <Image src={'/microphone.svg'} height={24} width={24} alt='mic' className='h-[24px] w-[24px] mr-2' />
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
                        src={'/send-mobile.svg'}
                        onClick={handleSend}
                        height={39}
                        width={87}
                        alt='mic'
                        className='h-[39px] w-[87px]'
                    />
                )}
            </div>
        </div>
    );
};

export default MobileChat;
