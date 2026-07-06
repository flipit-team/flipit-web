'use client';
import {useRouter, useSearchParams} from 'next/navigation';
import {ChevronLeft} from 'lucide-react';

const sectionLabels: Record<string, string> = {
    verification: 'Verification',
    'personal-details': 'Personal Details',
    'change-password': 'Change Password',
    'change-language': 'Change Language',
    'manage-notifications': 'Manage Notifications',
    'delete-account': 'Delete Account',
};

const SettingsMobileHeader = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'verification';
    const title = sectionLabels[activeSection] || 'Settings';

    return (
        <div className='hidden xs:block bg-primary rounded-b-[32px] px-6 pt-4 pb-8 fixed top-0 left-0 right-0 z-20'>
            <div className='flex items-center gap-3'>
                <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-white/20 flex items-center justify-center'>
                    <ChevronLeft size={20} className='text-white' />
                </button>
                <h1 className='font-poppins typo-heading-lg-bold text-white flex-1 text-center pr-10'>{title}</h1>
            </div>
        </div>
    );
};

export default SettingsMobileHeader;
