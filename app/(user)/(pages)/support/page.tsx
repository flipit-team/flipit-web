'use client';
import React, {useState} from 'react';
import Sidebar from '~/ui/common/layout/sidebar';
import {useAppContext} from '~/contexts/AppContext';
import {useAuth} from '~/hooks/useAuth';
import {SupportService} from '~/services/support.service';
import {useToast} from '~/contexts/ToastContext';
import {MessageSquare, Mail, Phone} from 'lucide-react';
import PhoneInput from '~/ui/common/phone-input/PhoneInput';

export default function SupportPage() {
    const {user: contextUser} = useAppContext();
    const {user} = useAuth();
    const {showSuccess, showError} = useToast();
    const authenticatedUser = user || contextUser;
    const username = (authenticatedUser as any)?.userName || (authenticatedUser as any)?.firstName || 'User';

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!firstName || !lastName || !email || !description) {
            showError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        try {
            // TODO: Replace with actual support API endpoint
            const result = await SupportService.requestCallback({
                name: `${firstName} ${lastName}`,
                phoneNumber: phone,
                email,
                message: description,
            });

            if (result.error) {
                showError(result.error.message || 'Failed to send message');
            } else {
                showSuccess('Message sent successfully!');
                setFirstName('');
                setLastName('');
                setEmail('');
                setPhone('');
                setDescription('');
            }
        } catch {
            showError('An error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>, _type: string) => {
        setPhone(e.target.value);
    };

    return (
        <div className='flex min-h-screen bg-white no-scrollbar'>
            <div className='hidden lg:block'>
                <Sidebar username={username} />
            </div>

            <div className='flex-1 p-6 lg:p-10 overflow-x-hidden no-scrollbar'>
                <div className='max-w-[900px]'>
                    {/* Header */}
                    <h1 className='font-poppins font-bold text-[24px] text-text_one mb-2'>
                        Send us a message
                    </h1>
                    <p className='font-poppins text-[14px] text-text_four mb-8 max-w-[700px]'>
                        Do you have a question? A complaint? Or you need help completing your listing or transaction process, Feel free to contact us.
                    </p>

                    {/* Form */}
                    <div className='border border-[#E8E8E8] rounded-xl p-6 mb-6'>
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-6 mb-6'>
                            {/* First Name */}
                            <div>
                                <label className='font-poppins font-semibold text-[14px] text-text_one block mb-2'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='Enter your first name'
                                    className='w-full h-[48px] px-4 border border-[#E8E8E8] rounded-lg font-poppins text-[14px] outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className='font-poppins font-semibold text-[14px] text-text_one block mb-2'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder='Enter your last name'
                                    className='w-full h-[48px] px-4 border border-[#E8E8E8] rounded-lg font-poppins text-[14px] outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className='font-poppins font-semibold text-[14px] text-text_one block mb-2'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                    className='w-full h-[48px] px-4 border border-[#E8E8E8] rounded-lg font-poppins text-[14px] outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Mobile number */}
                            <div>
                                <label className='font-poppins font-semibold text-[14px] text-text_one block mb-2'>
                                    Mobile number
                                </label>
                                <PhoneInput
                                    label=''
                                    name='phone'
                                    value={phone}
                                    setValue={handlePhoneChange}
                                    placeholder='Enter your contact number'
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div className='max-w-[50%] xs:max-w-full'>
                            <label className='font-poppins font-semibold text-[14px] text-text_one block mb-2'>
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Message'
                                rows={5}
                                className='w-full px-4 py-3 border border-[#E8E8E8] rounded-lg font-poppins text-[14px] outline-none focus:border-primary transition-colors resize-none'
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className='flex justify-end mb-10'>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className='px-8 py-3 bg-primary text-white rounded-full font-poppins text-[14px] font-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
                        >
                            {isSubmitting ? 'Sending...' : 'Send a Message'}
                        </button>
                    </div>

                    {/* Support options */}
                    <div className='grid grid-cols-3 xs:grid-cols-1 gap-6'>
                        {/* Live Chat */}
                        <div className='border border-[#E8E8E8] rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-[#E0F4FA] rounded-full flex items-center justify-center mb-4'>
                                <MessageSquare size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins font-bold text-[14px] text-text_one mb-1'>LIVE CHAT</h3>
                            <p className='font-poppins text-[13px] text-text_four mb-4'>5 mins wait time</p>
                            <button className='font-poppins font-semibold text-[13px] text-primary hover:underline'>
                                START CHAT
                            </button>
                        </div>

                        {/* Email */}
                        <div className='border border-[#E8E8E8] rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-[#E0F4FA] rounded-full flex items-center justify-center mb-4'>
                                <Mail size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins font-bold text-[14px] text-text_one mb-1'>EMAIL</h3>
                            <p className='font-poppins text-[13px] text-text_four mb-4'>24 hour response</p>
                            <button className='font-poppins font-semibold text-[13px] text-primary hover:underline'>
                                SEND EMAIL
                            </button>
                        </div>

                        {/* Call Support */}
                        <div className='border border-[#E8E8E8] rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-[#E0F4FA] rounded-full flex items-center justify-center mb-4'>
                                <Phone size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins font-bold text-[14px] text-text_one mb-1'>CALL SUPPORT</h3>
                            <p className='font-poppins text-[13px] text-text_four mb-4'>Exclusive access</p>
                            <button className='font-poppins font-semibold text-[13px] text-primary hover:underline'>
                                REQUEST CALL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
