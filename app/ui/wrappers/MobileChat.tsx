'use client';
import {Loader} from 'lucide-react';
import Image from 'next/image';
import {useParams} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';
import {useChatMessages} from '~/hooks/useChatMessages';
import {formatTimeTo12Hour, sendMessage} from '~/utils/helpers';
import {Message} from '~/utils/interface';

const MobileChat = () => {
    const params = useParams();
    const chatId = Array.isArray(params.slug) ? params.slug[0] : params.slug;

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const {user} = useAppContext();
    const [chats, setChats] = useState<Message[] | null>([]);
    const [input, setInput] = useState('');

    const {messages, isLoading, error: chatError} = useChatMessages(chatId);

    const handleSend = async () => {
        if (!input) return;

        setLoading(true);
        setError(null);

        try {
            const data = await sendMessage(chatId ?? '', input);
            setInput('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent h-full flex flex-col flex-1'>
            <div className='flex items-center justify-center typo-heading_sm xs:typo-body_lm text-primary bg-[rgba(0,95,115,0.2)] h-[42px]'>
                iPhone 12 promax
            </div>

            <div className='p-[40px] flex flex-col gap-2 flex-1 h-full'>
                {messages?.map((item, i) => {
                    return (
                        <div key={i} className={`w-[90%] ${item.sentBy === Number(user?.userId) ? 'mr-auto' : 'ml-auto'}`}>
                            <div
                                className={`${item.sentBy === Number(user?.userId) ? 'bg-[#f8f8f7]' : 'bg-[rgba(0,95,115,0.1)]'} p-3 rounded-lg`}
                            >
                                {item.message}
                            </div>
                            <p className={`text-[#87928A] typo-body_mr  ${item.sentBy === Number(user?.userId) ? '' : 'text-right'}`}>
                                {formatTimeTo12Hour(item.dateCreated)}
                            </p>
                        </div>
                    );
                })}
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
