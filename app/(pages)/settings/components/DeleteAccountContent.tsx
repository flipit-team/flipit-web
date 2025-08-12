'use client';
import {useState} from 'react';
import { useRouter } from 'next/navigation';
import NormalSelectBox from '~/ui/common/normal-select-box';
import RegularButton from '~/ui/common/buttons/RegularButton';
import { useAppContext } from '~/contexts/AppContext';

const DeleteAccountContent = () => {
    const [selectedReason, setSelectedReason] = useState('');
    const [showReasonError, setShowReasonError] = useState(false);
    const { setDeleteConfirmCallback } = useAppContext();
    const router = useRouter();

    const deleteReasons = [
        {name: "I'm not getting value from the platform", description: null},
        {name: 'Too many notifications', description: null},
        {name: 'Privacy concerns', description: null},
        {name: 'Found a better alternative', description: null},
        {name: 'Technical issues', description: null},
        {name: 'Other', description: null}
    ];

    const handleDeleteAccount = () => {
        if (selectedReason) {
            setShowReasonError(false);
            // Set the confirmation callback
            setDeleteConfirmCallback(() => () => {
                // Handle actual account deletion logic here
                console.log('Account deleted with reason:', selectedReason);
                // Add API call to delete account
                // Redirect to logout or confirmation page
            });
            
            // Open confirmation modal
            console.log('Opening delete confirmation modal...');
            router.push('/settings?section=delete-account&modal=delete-confirmation');
        } else {
            // Show visual feedback instead of alert
            setShowReasonError(true);
            console.log('No reason selected, showing error');
            return;
        }
    };

    return (
        <div>
            <h2 className='text-lg md:text-xl font-medium text-gray-900 mb-4'>Delete Account</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>

            <div className='space-y-6 max-w-2xl'>
                {/* Warning Text */}
                <p className='text-base text-gray-700 leading-relaxed'>
                    Account deactivation means to delete your account and you will not be able to log in to your profile
                    anymore and all your account history will be deleted without the possibility to restore.
                </p>

                {/* Reason Dropdown */}
                <div className='w-full'>
                    <NormalSelectBox
                        title='Reason'
                        selectedOption={selectedReason}
                        setSelectedOption={(reason) => {
                            setSelectedReason(reason);
                            setShowReasonError(false);
                        }}
                        options={deleteReasons}
                    />
                    {showReasonError && (
                        <p className='text-red-600 text-sm mt-2'>Please select a reason for deleting your account</p>
                    )}
                </div>

                {/* Delete Button */}
                <div className=''>
                    <RegularButton text='Delete my account forever' action={handleDeleteAccount} />
                </div>
            </div>
        </div>
    );
};

export default DeleteAccountContent;
