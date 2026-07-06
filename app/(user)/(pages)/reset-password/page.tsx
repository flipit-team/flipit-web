'use client';
import React, {useState} from 'react';
import {useSearchParams, useRouter} from 'next/navigation';

const ResetPasswordPage = () => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        if (!newPassword || !confirmPassword) {
            setErrorMessage('Please fill in all fields');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }

        if (newPassword.length < 8) {
            setErrorMessage('Password must be at least 8 characters');
            return;
        }

        setIsLoading(true);

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({token, newPassword, confirmPassword})
            });

            const data = await res.json();

            if (!res.ok) {
                const message = data?.apierror?.message || 'Password reset failed';
                setErrorMessage(message);
                setIsLoading(false);
                return;
            }

            router.push('/login');
        } catch (err: any) {
            setErrorMessage(err.message || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!token) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <div className='text-center'>
                    <h1 className='font-poppins typo-heading_lb text-primary mb-2'>Invalid Link</h1>
                    <p className='typo-body_lr text-text_one'>This password reset link is invalid or has expired.</p>
                </div>
            </div>
        );
    }

    return (
        <div className='flex items-center justify-center min-h-screen'>
            <div className='w-full max-w-[400px] px-4'>
                <h1 className='font-poppins typo-heading_lb text-primary mb-2'>Set New Password</h1>
                <p className='font-poppins typo-body_lr text-text_one mb-6'>
                    Enter your new password below.
                </p>

                {errorMessage && (
                    <div className='typo-body_mm text-red-400 text-center mb-4'>{errorMessage}</div>
                )}

                <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                    <div className='w-full'>
                        <label htmlFor='newPassword' className='block mb-2 typo-body_mr'>New Password</label>
                        <input
                            id='newPassword'
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='Enter new password'
                            className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
                        />
                    </div>

                    <div className='w-full'>
                        <label htmlFor='confirmPassword' className='block mb-2 typo-body_mr'>Confirm Password</label>
                        <input
                            id='confirmPassword'
                            type='password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder='Confirm new password'
                            className='h-[49px] w-full px-4 border border-border_gray rounded-md shadow-sm focus:ring-transparent outline-none'
                        />
                    </div>

                    <button
                        type='submit'
                        disabled={isLoading}
                        className='h-[49px] w-full bg-primary text-white rounded-md font-poppins typo-body_mr disabled:opacity-50'
                    >
                        {isLoading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPasswordPage;
