'use client';
import {useState} from 'react';
import InputBox from '~/ui/common/input-box';
import RegularButton from '~/ui/common/buttons/RegularButton';

const ChangePasswordContent = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldType: string) => {
        const value = e.target.value;
        switch (fieldType) {
            case 'current-password':
                setCurrentPassword(value);
                break;
            case 'new-password':
                setNewPassword(value);
                break;
            case 'confirm-password':
                setConfirmPassword(value);
                break;
        }
    };

    const handleChangePassword = () => {
        // Handle password change logic here
        console.log('Changing password:', {
            currentPassword,
            newPassword,
            confirmPassword
        });
    };

    return (
        <div>
            <h2 className='text-lg md:text-xl font-medium text-gray-900 mb-4'>Change Password</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>

            <div className='space-y-6'>
                {/* Current Password */}
                <InputBox
                    label='Current Password'
                    name='current-password'
                    placeholder='Enter current password'
                    type='password'
                    value={currentPassword}
                    setValue={(e) => handleInputChange(e, 'current-password')}
                />

                {/* New Password and Confirm Password side by side */}
                <div className='flex flex-col md:flex-row gap-4'>
                    <div className='flex-1'>
                        <InputBox
                            label='New Password'
                            name='new-password'
                            placeholder='Enter new password'
                            type='password'
                            value={newPassword}
                            setValue={(e) => handleInputChange(e, 'new-password')}
                        />
                    </div>

                    <div className='flex-1'>
                        <InputBox
                            label='Confirm Password'
                            name='confirm-password'
                            placeholder='Confirm new password'
                            type='password'
                            value={confirmPassword}
                            setValue={(e) => handleInputChange(e, 'confirm-password')}
                        />
                    </div>
                </div>

                {/* Change Password Button */}
                <div className='w-[194px]'>
                    <RegularButton text='Change Password' action={handleChangePassword} />
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordContent;
