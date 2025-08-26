'use client';
import React, {useState} from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';
import {handleApiError} from '~/utils/helpers';
import {useRouter, useSearchParams} from 'next/navigation';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const searchParams = useSearchParams();
    const router = useRouter();
    const [successMessage, setSuccessMessage] = useState('');

    const handleSubmit = async () => {
        if (!email) {
            return;
        }

        setIsLoading(true);


        try {
            const res = await fetch(`/api/auth/recovery?email=${email}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'}
            });

            // if (!res.ok) {
            //     // const message = handleApiError(data);
            //     // setErrorMessage(message);
            //     setIsLoading(false);

            //     return;
            // }
            setSuccessMessage('Password changed successfully');
            // Push new URL param without full page reload
            const newParams = new URLSearchParams(searchParams.toString());
            newParams.set('modal', 'check-inbox');
            setTimeout(() => {
                router.replace(`/?${newParams.toString()}`);
            }, 0);
            setIsLoading(false);
        } catch (err: any) {

            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setErrorMessage('');
        if (type === 'email') {
            setEmail(e.target.value);
        }
    };
    return (
        <div className='h-full flex flex-col justify-center xs:justify-normal xs:mt-14'>
            <h1 className='typo-heading_lb text-primary mb-2 xs:text-center'>Reset Password</h1>
            <p className='typo-body_lr text-text_one xs:text-center'>
                Enter your email to receive a link to reset your password.
            </p>

            <div className='my-6'>
                <InputBox
                    label='Email address'
                    name='email'
                    placeholder='Enter email address'
                    type='email'
                    setValue={handleInput}
                    value={email}
                />
            </div>

            <AuthButton title='Submit' bg onClick={() => handleSubmit()} isLoading={isLoading} />
        </div>
    );
};

export default ResetPassword;
