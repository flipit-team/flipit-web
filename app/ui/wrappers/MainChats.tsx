'use client';
import Image from 'next/image';
import Link from 'next/link';
import React, {useState, useEffect, useRef} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {useUnreadCount} from '~/contexts/UnreadCountContext';
import {Chat} from '~/utils/interface';
import dynamic from 'next/dynamic';
import {formatTimeTo12Hour, formatMessageTime, sendMessage, transformChatsResponse} from '~/utils/helpers';
import { ChatService } from '~/services/chat.service';
import NoData from '../common/no-data/NoData';
import DeleteConfirmationModal from '../common/delete-confirmation-modal/DeleteConfirmationModal';
import CountBadge from '../common/count-badge/CountBadge';
import {useRouter, useSearchParams} from 'next/navigation';
import {useChatMessages, useUserMessages} from '~/hooks/useChatMessages';
import {Loader} from 'lucide-react';
import {dummyChats} from '~/utils/dummy';
const LoaderMain = dynamic(() => import('../common/loader/Loader'), {ssr: false});

interface Props {
    chatData: {buyer: Chat[]; seller: Chat[]};
}
const MainChats = (props: Props) => {
    const {chatData: serverChatData} = props;
    const [apiChatData, setApiChatData] = useState(serverChatData);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [lastMessages, setLastMessages] = useState<Record<string, string>>({});
    const hasInit = useRef(false);

    // Fetch last message for each chat
    const fetchLastMessages = async (chats: Chat[]) => {
        const messagesMap: Record<string, string> = {};

        await Promise.all(
            chats.map(async (chat) => {
                try {
                    const res = await fetch(`/api/v1/chats/${chat.chatId}/messages`);
                    if (res.ok) {
                        const messages = await res.json();
                        if (messages && messages.length > 0) {
                            // Get the last message
                            const lastMsg = messages[messages.length - 1];
                            messagesMap[chat.chatId] = lastMsg.message;
                        }
                    }
                } catch (error) {
                    console.error(`Failed to fetch messages for chat ${chat.chatId}:`, error);
                }
            })
        );

        setLastMessages(messagesMap);
    };

    // Fetch chat data from API - only run once
    useEffect(() => {
        if (hasInit.current) return; // Prevent multiple calls

        const fetchChatData = async () => {
            if (serverChatData.buyer.length > 0 || serverChatData.seller.length > 0) {
                setIsInitialLoading(false);
                return;
            }

            try {
                const res = await fetch('/api/v1/chats');
                if (res.ok) {
                    const backendData = await res.json();
                    // Transform the new backend structure to our frontend structure
                    const transformedData = transformChatsResponse(backendData);
                    setApiChatData(transformedData);

                    // Fetch last messages for all chats
                    const allChats = [...transformedData.buyer, ...transformedData.seller];
                    await fetchLastMessages(allChats);
                }
            } catch (error) {
                console.error('Failed to fetch chats:', error);
            } finally {
                setIsInitialLoading(false);
            }
        };

        hasInit.current = true;
        fetchChatData();
    }, []);

    const chatData = apiChatData;
    const searchParams = useSearchParams();
    const router = useRouter();
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
    const {user} = useAppContext();
    const {decrementMessageCount} = useUnreadCount();
    const chatId = searchParams.get('chatId');
    const [activeTab, setActiveTab] = useState<'seller' | 'buyer'>('buyer');
    const displayedChat = activeTab === 'buyer' ? chatData.buyer : chatData.seller;
    const [activeChat, setActiveChat] = useState<Chat | null>(null);
    const markedAsReadRef = useRef<Set<string>>(new Set());

    // Calculate unread counts for each tab
    const sellerUnreadCount = chatData.seller.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);
    const buyerUnreadCount = chatData.buyer.reduce((sum, chat) => sum + (chat.unreadCount || 0), 0);

    // Refresh chat data periodically to get new messages
    useEffect(() => {
        const refreshChats = async () => {
            try {
                const res = await fetch('/api/v1/chats');
                if (res.ok) {
                    const backendData = await res.json();
                    const transformedData = transformChatsResponse(backendData);
                    setApiChatData(transformedData);

                    // Fetch last messages for all chats
                    const allChats = [...transformedData.buyer, ...transformedData.seller];
                    await fetchLastMessages(allChats);
                }
            } catch (error) {
                console.error('Failed to refresh chats:', error);
            }
        };

        // Poll every 3 seconds for new messages
        const interval = setInterval(refreshChats, 3000);

        return () => clearInterval(interval);
    }, []);

    // Get the other person's details (not the current user)
    const getOtherPerson = (chat: Chat) => {
        const currentUserId = Number(user?.userId);
        const isInitiator = chat.initiatorId === currentUserId;

        return {
            name: isInitiator ? chat.receiverName : chat.initiatorName,
            avatar: isInitiator ? chat.receiverAvatar : chat.initiatorAvatar
        };
    };

    const pushParam = (id: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('chatId', id);
        router.push(`/messages?${params.toString()}`);
    };

    // Handle marking chat as read when viewing it
    const handleChatClick = (chat: Chat) => {
        pushParam(chat.chatId);
        setActiveChat(chat);

        // Optimistically decrement the counter if this chat has unread messages
        if (chat.unreadCount && chat.unreadCount > 0 && !markedAsReadRef.current.has(chat.chatId)) {
            decrementMessageCount(chat.unreadCount);
            markedAsReadRef.current.add(chat.chatId);

            // Mark chat as read in the UI immediately
            setApiChatData(prev => ({
                buyer: prev.buyer.map(c => c.chatId === chat.chatId ? {...c, unreadCount: 0} : c),
                seller: prev.seller.map(c => c.chatId === chat.chatId ? {...c, unreadCount: 0} : c)
            }));

            // Call backend to mark as read (fire and forget)
            ChatService.markMessagesAsRead(chat.chatId).catch(err => {
                console.error('Failed to mark messages as read:', err);
            });
        }
    };

    const {messages, isLoading, error: chatError, mutate: mutateMessages} = useChatMessages(chatId);
    const {
        messages: userMessages,
        isLoading: userMessagesLoading,
        error: userMessagesError
    } = useUserMessages(user?.userId?.toString());

    const handleSend = async () => {
        if (!input.trim()) return;

        setLoading(true);
        setError(null);

        try {
            const data = await sendMessage(activeChat?.chatId ?? '', input);
            setInput('');

            // Immediately refresh messages after sending
            mutateMessages();
        } catch (err: any) {
            setError(err.message || 'Failed to send message');
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteClick = (chat: Chat, event: React.MouseEvent) => {
        event.stopPropagation(); // Prevent chat selection when clicking delete
        setChatToDelete(chat);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!chatToDelete) return;

        setDeleteLoading(chatToDelete.chatId);

        try {
            await ChatService.deleteChat(chatToDelete.chatId);
            
            // Remove from local state
            setApiChatData(prev => ({
                buyer: prev.buyer.filter(chat => chat.chatId !== chatToDelete.chatId),
                seller: prev.seller.filter(chat => chat.chatId !== chatToDelete.chatId)
            }));
            
            // Clear active chat if it was deleted
            if (activeChat?.chatId === chatToDelete.chatId) {
                setActiveChat(null);
                router.push('/messages');
            }
            
            // Close modal
            setShowDeleteModal(false);
            setChatToDelete(null);
        } catch (err: any) {
            setError('Failed to delete chat. Please try again.');
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleCancelDelete = () => {
        setShowDeleteModal(false);
        setChatToDelete(null);
    };

    if (userMessagesLoading || isInitialLoading)
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
                <div className='shadow-lg xs:shadow-transparent xs:hidden'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_lm'>
                        {chatData.seller.length > 0 && (
                            <div
                                className={`py-6 cursor-pointer flex items-center gap-2 ${activeTab === 'seller' ? ' border-b border-primary text-primary' : 'text-text_four'}`}
                                onClick={() => setActiveTab('seller')}
                            >
                                My Sales
                                {sellerUnreadCount > 0 && (
                                    <span className='bg-secondary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1'>
                                        {sellerUnreadCount > 99 ? '99+' : sellerUnreadCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {chatData.buyer.length > 0 && (
                            <div
                                className={`py-6 cursor-pointer flex items-center gap-2 ${activeTab === 'buyer' ? ' border-b border-primary text-primary' : 'text-text_four'}`}
                                onClick={() => setActiveTab('buyer')}
                            >
                                My Purchases
                                {buyerUnreadCount > 0 && (
                                    <span className='bg-secondary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1'>
                                        {buyerUnreadCount > 99 ? '99+' : buyerUnreadCount}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {displayedChat?.map((chat: any, i: number) => {
                        const otherPerson = getOtherPerson(chat);
                        const lastMessage = lastMessages[chat.chatId];
                        return (
                            <div
                                key={i}
                                onClick={() => handleChatClick(chat)}
                                className={`min-h-[130px] ${chat.chatId === activeChat?.chatId ? 'bg-surface-primary-10' : ''} flex p-6 border-b border-border-secondary cursor-pointer hover:bg-surface-primary-10 transition-colors`}
                            >
                                <Image
                                    src={otherPerson.avatar || '/placeholder-avatar.svg'}
                                    height={50}
                                    width={50}
                                    alt={otherPerson.name}
                                    className='h-[50px] w-[50px] mr-4 rounded-full object-cover flex-shrink-0'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-primary typo-body_lm capitalize mb-1'>{otherPerson.name}</p>
                                    <p className='typo-body_sm text-text_three mb-1'>
                                        <span className='font-medium'>Product:</span> {chat.title}
                                    </p>
                                    {lastMessage && (
                                        <p className='typo-body_sr text-text_four truncate'>
                                            <span className='font-medium'>Message:</span> {lastMessage}
                                        </p>
                                    )}
                                </div>
                                <div className='flex flex-col items-end gap-2 ml-2 flex-shrink-0'>
                                    <p className='typo-body_sr'>{formatMessageTime(chat.dateCreated)}</p>
                                    {chat.unreadCount > 0 && (
                                        <div className='bg-secondary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium'>
                                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                        </div>
                                    )}
                                    <button
                                        onClick={(e) => handleDeleteClick(chat, e)}
                                        disabled={deleteLoading === chat.chatId}
                                        className='text-error hover:text-error/80 transition-colors disabled:opacity-50'
                                        title='Delete chat'
                                    >
                                        {deleteLoading === chat.chatId ? (
                                            <Loader className='h-4 w-4' />
                                        ) : (
                                            <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className='shadow-lg xs:shadow-transparent hidden xs:block'>
                    <div className='px-6 flex items-center gap-[34px] typo-body_lm'>
                        {chatData.seller.length > 0 && (
                            <div
                                className={`text-primary py-6 cursor-pointer flex items-center gap-2 ${activeTab === 'seller' ? ' border-b border-primary' : ''}`}
                                onClick={() => setActiveTab('seller')}
                            >
                                My Sales
                                {sellerUnreadCount > 0 && (
                                    <span className='bg-secondary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1'>
                                        {sellerUnreadCount > 99 ? '99+' : sellerUnreadCount}
                                    </span>
                                )}
                            </div>
                        )}
                        {chatData.buyer.length > 0 && (
                            <div
                                className={`text-text_four py-6 cursor-pointer flex items-center gap-2 ${activeTab === 'buyer' ? ' border-b border-primary' : ''}`}
                                onClick={() => setActiveTab('buyer')}
                            >
                                My Purchases
                                {buyerUnreadCount > 0 && (
                                    <span className='bg-secondary text-white text-[10px] font-bold rounded-full h-[18px] min-w-[18px] flex items-center justify-center px-1'>
                                        {buyerUnreadCount > 99 ? '99+' : buyerUnreadCount}
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                    {displayedChat?.map((chat: any, i: number) => {
                        const otherPerson = getOtherPerson(chat);
                        const lastMessage = lastMessages[chat.chatId];
                        return (
                            <Link
                                key={i}
                                href={`/messages/${chat.chatId}`}
                                className={`min-h-[130px] ${chat.chatId === activeChat?.chatId ? 'bg-surface-primary-10' : ''} flex p-6 border-b border-border-secondary`}
                            >
                                <Image
                                    src={otherPerson.avatar || '/placeholder-avatar.svg'}
                                    height={50}
                                    width={50}
                                    alt={otherPerson.name}
                                    className='h-[50px] w-[50px] mr-4 rounded-full object-cover flex-shrink-0'
                                />
                                <div className='flex-1 min-w-0'>
                                    <p className='text-primary typo-body_lm capitalize mb-1'>{otherPerson.name}</p>
                                    <p className='typo-body_sm text-text_three mb-1'>
                                        <span className='font-medium'>Product:</span> {chat.title}
                                    </p>
                                    {lastMessage && (
                                        <p className='typo-body_sr text-text_four truncate'>
                                            <span className='font-medium'>Message:</span> {lastMessage}
                                        </p>
                                    )}
                                </div>
                                <div className='flex flex-col items-end gap-2 ml-2 flex-shrink-0'>
                                    <p className='typo-body_sr'>{formatMessageTime(chat.dateCreated)}</p>
                                    {chat.unreadCount > 0 && (
                                        <div className='bg-secondary text-white rounded-full h-5 w-5 flex items-center justify-center text-xs font-medium'>
                                            {chat.unreadCount > 9 ? '9+' : chat.unreadCount}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        );
                    })}
                </div>
                <div className='shadow-lg xs:shadow-transparent xs:hidden'>
                    {activeChat && (() => {
                        const otherPerson = getOtherPerson(activeChat);
                        return (
                            <div className='flex items-center p-6'>
                                <Image
                                    src={otherPerson.avatar || '/placeholder-avatar.svg'}
                                    height={50}
                                    width={50}
                                    alt={otherPerson.name}
                                    className='h-[50px] w-[50px] mr-4 rounded-full object-cover'
                                />
                                <p className='typo-body_lm capitalize'>{otherPerson.name}</p>
                            </div>
                        );
                    })()}
                    {activeChat && (
                        <div className='flex items-center justify-center typo-heading_sm text-primary bg-surface-primary-20 h-[42px]'>
                            {activeChat?.title}
                        </div>
                    )}
                    <div className='p-[40px] flex flex-col gap-2'>
                        {messages?.map((item, i) => {
                            return (
                                <div key={i} className={`w-2/4 ${item.sentBy === Number(user?.userId) ? 'ml-auto' : 'mr-auto'}`}>
                                    <div
                                        className={`${item.sentBy === Number(user?.userId) ? 'bg-surface-primary-10' : 'bg-background-tertiary'} p-3 rounded-lg`}
                                    >
                                        {item.message}
                                    </div>
                                    <p
                                        className={`text-text-accent typo-body_mr ${item.sentBy === Number(user?.userId) ? '' : 'text-right'}`}
                                    >
                                        {formatMessageTime(item.dateCreated)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                    {activeChat && (
                        <div className='border-t border-border_gray'>
                            {error && (
                                <div className='px-[40px] py-2 bg-red-50 border-b border-red-200'>
                                    <p className='text-red-700 text-sm'>{error}</p>
                                </div>
                            )}
                            <div className='h-[96px] flex items-center px-[40px]'>
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
                                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                    type='text'
                                    disabled={loading}
                                    className='h-full w-full typo-body_lr focus:ring-transparent outline-none disabled:opacity-50'
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
                                        alt='send'
                                        className='h-[39px] w-[87px] cursor-pointer'
                                    />
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            <DeleteConfirmationModal
                isOpen={showDeleteModal}
                title="Delete Chat"
                message={`Are you sure you want to delete this chat with ${chatToDelete?.initiatorName}? This action cannot be undone.`}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
                isDeleting={deleteLoading === chatToDelete?.chatId}
            />
        </div>
    );
};

export default MainChats;
