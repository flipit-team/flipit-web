'use client';
import {Loader} from 'lucide-react';
import Image from 'next/image';
import {useParams, useRouter} from 'next/navigation';
import React, {useEffect, useState, useRef} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {ChevronLeft} from 'lucide-react';
import {useUnreadCount} from '~/contexts/UnreadCountContext';
import {useChatMessages} from '~/hooks/useChatMessages';
import {formatTimeTo12Hour, formatMessageTime, sendMessage} from '~/utils/helpers';
import {Message} from '~/utils/interface';
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
    const [chatTitle, setChatTitle] = useState<string>('');
    const [otherName, setOtherName] = useState<string>('');
    const [otherAvatar, setOtherAvatar] = useState<string>('');
    const markedAsReadRef = useRef<Set<string>>(new Set());

    const {messages, isLoading, error: chatError, mutate: mutateMessages} = useChatMessages(chatId);

    // Fetch chat details from chats list
    useEffect(() => {
        const fetchChatDetails = async () => {
            try {
                const res = await fetch('/api/v1/chats');
                if (res.ok) {
                    const data = await res.json();
                    const allChats = [...(data.seller || []), ...(data.buyer || [])];
                    const currentChat = allChats.find((c: any) => {
                        const chat = c.chat || c;
                        return String(chat.chatId) === String(chatId);
                    });
                    if (currentChat) {
                        const chat = currentChat.chat || currentChat;
                        setChatTitle(chat.title || '');
                        const userId = Number(user?.userId);
                        if (chat.initiatorId === userId) {
                            setOtherName(chat.receiverName || '');
                            setOtherAvatar(chat.receiverAvatar || '');
                        } else {
                            setOtherName(chat.initiatorName || '');
                            setOtherAvatar(chat.initiatorAvatar || '');
                        }
                    }
                }
            } catch (err) {
                // Keep fallback values
            }
        };
        if (chatId) fetchChatDetails();
    }, [chatId, user?.userId]);

    // Mark messages as read when chat changes
    useEffect(() => {
        if (chatId && !markedAsReadRef.current.has(chatId)) {
            markedAsReadRef.current.add(chatId);

            // Optimistically decrement counter (assume 1 unread for now)
            // The actual count will sync from backend on next refresh
            decrementMessageCount(1);
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
        <div className='h-full flex flex-col flex-1 bg-[#FFFFF0]'>
            {/* Header */}
            <div className='flex items-center gap-3 px-4 py-3'>
                <button
                    onClick={() => router.back()}
                    className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'
                    aria-label='Go back'
                >
                    <ChevronLeft size={20} className='text-text_one' />
                </button>
                <Image
                    src={otherAvatar || '/images/placeholders/placeholder-avatar.svg'}
                    height={44}
                    width={44}
                    alt='avatar'
                    className='h-[44px] w-[44px] rounded-full object-cover flex-shrink-0'
                />
                <div className='min-w-0'>
                    <p className='font-poppins typo-body-md-bold text-text_one truncate'>{otherName || 'User'}</p>
                    <p className='font-poppins typo-body-xs-regular text-text_four truncate'>{chatTitle || 'Chat'}</p>
                    <p className='font-poppins typo-body-xs-regular text-primary'>Last seen recently</p>
                </div>
            </div>

            {/* Messages */}
            <div className='flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4'>
                {isLoading ? (
                    <div className='flex justify-center items-center h-full'>
                        <div className='flex items-center gap-2 text-text-secondary'>
                            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-primary'></div>
                            <span className='typo-body-md-regular'>Loading messages...</span>
                        </div>
                    </div>
                ) : (
                    messages?.map((item, i) => {
                        const isMe = item.sentBy === Number(user?.userId);
                        return (
                            <div key={i} className={`max-w-[80%] ${isMe ? 'ml-auto' : 'mr-auto'}`}>
                                <div
                                    className={`${isMe ? 'bg-gray-200' : 'bg-surface-primary-10'} px-4 py-3 rounded-2xl font-poppins typo-body-md-regular text-text_one`}
                                >
                                    {item.message}
                                </div>
                                <p className={`font-poppins typo-body-xs-regular text-text_four mt-1 ${isMe ? 'text-right' : ''}`}>
                                    {formatTimeTo12Hour(item.dateCreated)}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input bar */}
            <div className='px-4 py-3 flex items-center gap-3'>
                <button className='flex-shrink-0'>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#666' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                        <path d='M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z'/>
                        <circle cx='12' cy='13' r='4'/>
                    </svg>
                </button>
                <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                    type='text'
                    className='flex-1 h-[40px] px-4 bg-gray-100 rounded-full typo-body-md-regular font-poppins focus:ring-transparent outline-none placeholder:text-text_four'
                    placeholder='Type in your message here'
                />
                <button onClick={handleSend} disabled={loading || !input} className='flex-shrink-0 disabled:opacity-50'>
                    <svg width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='#025F73' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round'>
                        <line x1='22' y1='2' x2='11' y2='13'/>
                        <polygon points='22 2 15 22 11 13 2 9 22 2'/>
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default MobileChat;
