'use client';
import { useState } from 'react';
import Image from 'next/image';
import PageHeader from '../components/PageHeader';
import { 
  MagnifyingGlassIcon,
  PaperAirplaneIcon,
  FaceSmileIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';

// Mock chat data
const chatsList = [
  {
    id: 1,
    customerName: 'John Doe',
    customerId: 'CUST-001',
    lastMessage: 'Is the iPhone still available for auction?',
    timestamp: '2 mins ago',
    unreadCount: 3,
    avatar: '/camera-large.png',
    isOnline: true
  },
  {
    id: 2,
    customerName: 'Sarah Johnson',
    customerId: 'CUST-002',
    lastMessage: 'Thank you for the quick response!',
    timestamp: '15 mins ago',
    unreadCount: 0,
    avatar: '/camera-large.png',
    isOnline: true
  },
  {
    id: 3,
    customerName: 'Michael Chen',
    customerId: 'CUST-003',
    lastMessage: 'I need help with my payment',
    timestamp: '1 hour ago',
    unreadCount: 1,
    avatar: '/camera-large.png',
    isOnline: false
  },
  {
    id: 4,
    customerName: 'Emma Wilson',
    customerId: 'CUST-004',
    lastMessage: 'When will the auction start?',
    timestamp: '2 hours ago',
    unreadCount: 0,
    avatar: '/camera-large.png',
    isOnline: true
  },
  {
    id: 5,
    customerName: 'David Rodriguez',
    customerId: 'CUST-005',
    lastMessage: 'Can you provide more details about the item?',
    timestamp: '3 hours ago',
    unreadCount: 2,
    avatar: '/camera-large.png',
    isOnline: false
  }
];

const messages = [
  {
    id: 1,
    senderId: 'CUST-001',
    senderName: 'John Doe',
    message: 'Hi, I\'m interested in the iPhone 14 Pro Max listing. Is it still available for auction?',
    timestamp: '10:30 AM',
    isFromCustomer: true
  },
  {
    id: 2,
    senderId: 'ADMIN',
    senderName: 'Admin Support',
    message: 'Hello John! Yes, the iPhone 14 Pro Max is still available. The auction starts tomorrow at 2 PM.',
    timestamp: '10:32 AM',
    isFromCustomer: false
  },
  {
    id: 3,
    senderId: 'CUST-001',
    senderName: 'John Doe',
    message: 'Great! What\'s the starting bid?',
    timestamp: '10:33 AM',
    isFromCustomer: true
  },
  {
    id: 4,
    senderId: 'ADMIN',
    senderName: 'Admin Support',
    message: 'The starting bid is ₦800,000. You can view all details on the listing page.',
    timestamp: '10:35 AM',
    isFromCustomer: false
  },
  {
    id: 5,
    senderId: 'CUST-001',
    senderName: 'John Doe',
    message: 'Perfect! One more question - what\'s the condition of the device?',
    timestamp: '10:45 AM',
    isFromCustomer: true
  }
];

export default function AdminChats() {
  const [selectedChat, setSelectedChat] = useState(chatsList[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredChats = chatsList.filter(chat =>
    chat.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    chat.customerId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // Here you would typically send the message to your backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div>
      <PageHeader 
        title="Chats" 
        description="Communicate with customers and provide real-time support for auction-related queries"
      />

      <div className="px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px] flex">
          {/* Chat List Sidebar */}
          <div className="w-1/3 border-r border-gray-200 flex flex-col">
            {/* Search Bar */}
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search chats..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                />
              </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                    selectedChat.id === chat.id ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <Image
                        src={chat.avatar}
                        alt={chat.customerName}
                        width={40}
                        height={40}
                        className="rounded-full object-cover"
                      />
                      {chat.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="typo-body_ms text-text_one truncate">{chat.customerName}</p>
                        <div className="flex items-center space-x-2">
                          <span className="typo-body_sr text-text_four">{chat.timestamp}</span>
                          {chat.unreadCount > 0 && (
                            <span className="bg-primary text-white rounded-full w-5 h-5 flex items-center justify-center typo-body_sr">
                              {chat.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="typo-body_sr text-text_four">{chat.customerId}</p>
                      <p className="typo-body_sr text-text_three truncate mt-1">{chat.lastMessage}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Interface */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center space-x-3">
              <Image
                src={selectedChat.avatar}
                alt={selectedChat.customerName}
                width={40}
                height={40}
                className="rounded-full object-cover"
              />
              <div>
                <p className="typo-body_ms text-text_one">{selectedChat.customerName}</p>
                <p className="typo-body_sr text-text_four">{selectedChat.customerId}</p>
                <p className="typo-body_sr text-green-600">
                  {selectedChat.isOnline ? 'Online' : 'Last seen 2 hours ago'}
                </p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isFromCustomer ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.isFromCustomer
                        ? 'bg-gray-100 text-text_one'
                        : 'bg-primary text-white'
                    }`}
                  >
                    <p className="typo-body_sr">{message.message}</p>
                    <p className={`typo-body_sr mt-1 ${
                      message.isFromCustomer ? 'text-text_four' : 'text-white/80'
                    }`}>
                      {message.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center space-x-3">
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type your message..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg typo-body_sr focus:ring-2 focus:ring-primary focus:border-primary outline-none"
                  />
                </div>
                <button className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="p-2 bg-primary text-white rounded-full hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  <PaperAirplaneIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}