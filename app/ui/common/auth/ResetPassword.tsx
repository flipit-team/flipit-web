import React from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';

const ResetPassword = () => {
    return (
        <div className='h-full flex flex-col justify-center xs:justify-normal xs:mt-14'>
            <h1 className='typo-heading_large_bold text-primary mb-2 xs:text-center'>Reset Password</h1>
            <p className='typo-body_large_regular text-text_one xs:text-center'>
                Enter your email to receive a link to reset your password.
            </p>

            <div className='my-6'>
                <InputBox label='Email address' name='email' placeholder='Enter email address' type='email' />
            </div>

            <AuthButton title='Submit' bg />
        </div>
    );
};

export default ResetPassword;
