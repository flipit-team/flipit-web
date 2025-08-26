'use client';
import {useState} from 'react';
import InputBox from '~/ui/common/input-box';
import RegularButton from '~/ui/common/buttons/RegularButton';
import {UserService} from '~/services/user.service';
import {useToast} from '~/contexts/ToastContext';

const ChangePasswordContent = () => {
    const {showError} = useToast();
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

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

    const handleChangePassword = async () => {
        if (!currentPassword.trim() || !newPassword.trim() || !confirmPassword.trim()) {
            showError('Please fill in all password fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            showError('New password and confirm password do not match');
            return;
        }

        if (newPassword.length < 6) {
            showError('New password must be at least 6 characters long');
            return;
        }

        try {
            setLoading(true);
            const result = await UserService.changePassword({
                currentPassword: currentPassword.trim(),
                newPassword: newPassword.trim(),
                confirmPassword: confirmPassword.trim(),
            });
            
            if (result.data) {
                setShowSuccessModal(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showError(result.error || 'Failed to change password');
            }
        } catch (error) {
            showError('An error occurred while changing your password');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            {/* Success Modal */}
            {showSuccessModal && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
                    <div className='bg-white rounded-lg p-6 max-w-sm mx-4 text-center'>
                        <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M5 13l4 4L19 7'></path>
                            </svg>
                        </div>
                        <h3 className='text-lg font-semibold text-gray-900 mb-2'>Password Changed Successfully!</h3>
                        <p className='text-gray-600 mb-4'>Your password has been updated successfully.</p>
                        <button
                            onClick={() => setShowSuccessModal(false)}
                            className='bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors'
                        >
                            OK
                        </button>
                    </div>
                </div>
            )}
            
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
                    <RegularButton 
                        text={loading ? 'Changing...' : 'Change Password'} 
                        action={handleChangePassword}
                        isLoading={loading}
                        disabled={loading}
                    />
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordContent;
