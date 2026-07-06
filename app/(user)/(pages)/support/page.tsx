'use client';
import React, {useState} from 'react';
import {useRouter} from 'next/navigation';
import Sidebar from '~/ui/common/layout/sidebar';
import {useAppContext} from '~/contexts/AppContext';
import {useAuth} from '~/hooks/useAuth';
import {SupportService} from '~/services/support.service';
import {useToast} from '~/contexts/ToastContext';
import {MessageSquare, Mail, Phone, ChevronLeft} from 'lucide-react';
import PhoneInput from '~/ui/common/phone-input/PhoneInput';

export default function SupportPage() {
    const router = useRouter();
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
        <div className='flex min-h-screen bg-white xs:bg-[#FFFFF0] no-scrollbar'>
            <div className='hidden lg:block xs:hidden'>
                <Sidebar username={username} />
            </div>

            {/* Mobile Header */}
            <div className='hidden xs:block bg-primary rounded-b-[32px] px-6 pt-4 pb-8 mb-6 fixed top-0 left-0 right-0 z-20'>
                <div className='flex items-center gap-3'>
                    <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                        <ChevronLeft size={20} className='text-white' />
                    </button>
                    <h1 className='font-poppins typo-heading-lg-bold text-white flex-1 text-center pr-10'>Help & Support</h1>
                </div>
            </div>

            <div className='flex-1 p-6 lg:p-10 xs:px-4 xs:pt-28 xs:pb-24 overflow-x-hidden no-scrollbar'>
                <div className='max-w-[900px]'>
                    {/* Header */}
                    <h1 className='font-poppins typo-heading-lg-bold text-text_one mb-2 xs:hidden'>
                        Send us a message
                    </h1>
                    <p className='font-poppins typo-body-md-regular text-text_four mb-8 max-w-[700px] xs:hidden'>
                        Do you have a question? A complaint? Or you need help completing your listing or transaction process, Feel free to contact us.
                    </p>

                    {/* Mobile subheading */}
                    <h2 className='hidden xs:block font-poppins typo-heading-md-bold text-text_one mb-2'>Send us a message</h2>
                    <p className='hidden xs:block font-poppins typo-body-sm-regular text-text_four mb-6'>
                        Do you have a question? A complaint? Or you need help completing your listing or transaction process, Feel free to contact us.
                    </p>

                    {/* Form */}
                    <div className='border border-border-DEFAULT rounded-xl p-6 xs:p-4 mb-6'>
                        <div className='grid grid-cols-2 xs:grid-cols-1 gap-6 mb-6'>
                            {/* First Name */}
                            <div>
                                <label className='font-poppins typo-body-md-semibold text-text_one block mb-2'>
                                    First Name
                                </label>
                                <input
                                    type='text'
                                    value={firstName}
                                    onChange={(e) => setFirstName(e.target.value)}
                                    placeholder='Enter your first name'
                                    className='w-full h-[48px] px-4 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Last Name */}
                            <div>
                                <label className='font-poppins typo-body-md-semibold text-text_one block mb-2'>
                                    Last Name
                                </label>
                                <input
                                    type='text'
                                    value={lastName}
                                    onChange={(e) => setLastName(e.target.value)}
                                    placeholder='Enter your last name'
                                    className='w-full h-[48px] px-4 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Email */}
                            <div>
                                <label className='font-poppins typo-body-md-semibold text-text_one block mb-2'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder='Enter your email'
                                    className='w-full h-[48px] px-4 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary transition-colors'
                                />
                            </div>

                            {/* Mobile number */}
                            <div>
                                <label className='font-poppins typo-body-md-semibold text-text_one block mb-2'>
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
                        <div className='w-full'>
                            <label className='font-poppins typo-body-md-semibold text-text_one block mb-2'>
                                Description
                            </label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder='Message'
                                rows={5}
                                className='w-full px-4 py-3 border border-border-DEFAULT rounded-lg font-poppins typo-body-md-regular outline-none focus:border-primary transition-colors resize-none'
                            />
                        </div>
                    </div>

                    {/* Submit button */}
                    <div className='flex justify-end mb-10'>
                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className='px-8 py-3 bg-primary text-white rounded-lg font-poppins typo-body-md-medium hover:bg-primary/90 transition-colors disabled:opacity-50'
                        >
                            {isSubmitting ? 'Sending...' : 'Send a Message'}
                        </button>
                    </div>

                    {/* Support options */}
                    <div className='grid grid-cols-3 xs:grid-cols-1 gap-6 xs:gap-3'>
                        {/* Live Chat */}
                        <div className='bg-amber-50 border border-border-DEFAULT rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-yellow-50 rounded-full flex items-center justify-center mb-4'>
                                <MessageSquare size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins typo-body-md-semibold text-text_one mb-1'>LIVE CHAT</h3>
                            <p className='font-poppins typo-body-xs-medium text-text_four mb-4'>5 mins wait time</p>
                            <button className='font-poppins typo-body-xs-medium text-primary hover:underline'>
                                START CHAT
                            </button>
                        </div>

                        {/* Email */}
                        <div className='bg-amber-50 border border-border-DEFAULT rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-yellow-50 rounded-full flex items-center justify-center mb-4'>
                                <Mail size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins typo-body-md-semibold text-text_one mb-1'>EMAIL</h3>
                            <p className='font-poppins typo-body-xs-medium text-text_four mb-4'>24 hour response</p>
                            <button className='font-poppins typo-body-xs-medium text-primary hover:underline'>
                                SEND EMAIL
                            </button>
                        </div>

                        {/* Call Support */}
                        <div className='bg-amber-50 border border-border-DEFAULT rounded-xl p-6 flex flex-col items-center text-center'>
                            <div className='w-[48px] h-[48px] bg-yellow-50 rounded-full flex items-center justify-center mb-4'>
                                <Phone size={22} className='text-primary' />
                            </div>
                            <h3 className='font-poppins typo-body-md-semibold text-text_one mb-1'>CALL SUPPORT</h3>
                            <p className='font-poppins typo-body-xs-medium text-text_four mb-4'>Exclusive access</p>
                            <button className='font-poppins typo-body-xs-medium text-primary hover:underline'>
                                REQUEST CALL
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
