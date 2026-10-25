'use client';
import {useState, useEffect, useRef} from 'react';
import Image from 'next/image';
import PageHeader from '../components/PageHeader';
import LogoLoader from '~/ui/common/logo-loader/LogoLoader';
import {Search, Send, Paperclip} from 'lucide-react';
import {AdminService} from '~/services';
import {ChatDTO, MessageDTO} from '~/types/api';

export default function AdminChats() {
    const [chats, setChats] = useState<ChatDTO[]>([]);
    const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
    const [messages, setMessages] = useState<MessageDTO[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            const result = await AdminService.getChats();
            if (result.data) {
                setChats(result.data);
                if (result.data.length > 0) setSelectedChat(result.data[0]);
            }
            setLoading(false);
        };
        fetchChats();
    }, []);

    useEffect(() => {
        if (!selectedChat) return;
        const fetchMessages = async () => {
            const result = await AdminService.getChatMessages(selectedChat.chatId);
            if (result.data) setMessages(result.data);
        };
        fetchMessages();
    }, [selectedChat]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    }, [messages]);

    const filteredChats = chats.filter(
        (chat) =>
            chat.initiatorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.receiverName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            chat.title?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;
        setSending(true);
        const result = await AdminService.sendAdminMessage(selectedChat.chatId, newMessage.trim());
        setSending(false);
        if (result.data) {
            setMessages(prev => [...prev, result.data!]);
            setNewMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (loading) return <LogoLoader />;

    return (
        <div>
            <PageHeader
                title='Chats'
                description='Communicate with customers and provide real-time support for auction-related queries'
            />

            <div className='px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex'>
                    {/* Chat List Sidebar */}
                    <div className='w-1/3 border-r border-gray-200 flex flex-col'>
                        <div className='p-4 border-b border-gray-200'>
                            <div className='relative'>
                                <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                                    <Search className='h-5 w-5 text-gray-400' />
                                </div>
                                <input
                                    type='text'
                                    placeholder='Search chats...'
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                                />
                            </div>
                        </div>

                        <div className='flex-1 overflow-y-auto'>
                            {filteredChats.length === 0 ? (
                                <p className='text-center text-gray-400 typo-body_sr py-8'>No chats found</p>
                            ) : filteredChats.map((chat) => (
                                <div
                                    key={chat.chatId}
                                    onClick={() => setSelectedChat(chat)}
                                    className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                                        selectedChat?.chatId === chat.chatId ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                                    }`}
                                >
                                    <div className='flex items-center space-x-3'>
                                        <Image
                                            src={chat.initiatorAvatar || '/icons/action/camera.png'}
                                            alt={chat.initiatorName}
                                            width={40}
                                            height={40}
                                            className='rounded-full object-cover'
                                        />
                                        <div className='flex-1 min-w-0'>
                                            <p className='typo-body_ms text-text_one truncate'>{chat.initiatorName}</p>
                                            <p className='typo-body_sr text-text_four truncate'>{chat.title || 'No title'}</p>
                                            <p className='typo-body_sr text-text_four'>{new Date(chat.dateCreated).toLocaleDateString()}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Interface */}
                    <div className='flex-1 flex flex-col'>
                        {selectedChat ? (
                            <>
                                <div className='p-4 border-b border-gray-200 flex items-center space-x-3'>
                                    <Image
                                        src={selectedChat.initiatorAvatar || '/icons/action/camera.png'}
                                        alt={selectedChat.initiatorName}
                                        width={40}
                                        height={40}
                                        className='rounded-full object-cover'
                                    />
                                    <div>
                                        <p className='typo-body_ms text-text_one'>{selectedChat.initiatorName}</p>
                                        <p className='typo-body_sr text-text_four'>{selectedChat.title}</p>
                                    </div>
                                </div>

                                <div className='flex-1 p-4 overflow-y-auto space-y-4'>
                                    {messages.map((msg, i) => (
                                        <div
                                            key={i}
                                            className={`flex ${msg.sentBy === selectedChat.initiatorId ? 'justify-start' : 'justify-end'}`}
                                        >
                                            <div
                                                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                                                    msg.sentBy === selectedChat.initiatorId
                                                        ? 'bg-gray-100 text-text_one'
                                                        : 'bg-primary text-white'
                                                }`}
                                            >
                                                <p className='typo-body_sr'>{msg.message}</p>
                                                <p className={`typo-body_sr mt-1 ${msg.sentBy === selectedChat.initiatorId ? 'text-text_four' : 'text-white/80'}`}>
                                                    {new Date(msg.dateCreated).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>

                                <div className='p-4 border-t border-gray-200'>
                                    <div className='flex items-center space-x-3'>
                                        <button className='p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100'>
                                            <Paperclip className='h-5 w-5' />
                                        </button>
                                        <input
                                            type='text'
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyPress={handleKeyPress}
                                            placeholder='Type your message...'
                                            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none'
                                        />
                                        <button
                                            onClick={handleSendMessage}
                                            disabled={!newMessage.trim() || sending}
                                            className='p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed'
                                        >
                                            <Send className='h-5 w-5' />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className='flex-1 flex items-center justify-center text-gray-400'>
                                <p>Select a chat to start messaging</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
