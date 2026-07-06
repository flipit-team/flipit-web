'use client';
import React, {useEffect, useState} from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import useAuth from '~/hooks/useAuth';
import { AuthService } from '~/services/auth.service';
import Image from 'next/image';
import { formatErrorForDisplay } from '~/utils/error-messages';
import ErrorDisplay from '../error-display/ErrorDisplay';
import PhoneInput from '../phone-input/PhoneInput';

const Form = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [errorTitle, setErrorTitle] = useState('');
    const [errorAction, setErrorAction] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPhone('');
        setFullName('');
    }, [isLogin]);

    const loginWithGoogle = () => {
        window.location.href = '/api/auth/google-login';
    };

    const pushParam = (param: string) => {
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('auth', param);
        setTimeout(() => {
            router.replace(`/login?${newParams.toString()}`);
        }, 0);
    };

    const clearErrors = () => {
        setErrorMessage('');
        setErrorTitle('');
        setErrorAction('');
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        clearErrors();
        const value = e.target.value;

        switch (type) {
            case 'email':
                setEmail(value);
                break;
            case 'fullName':
                setFullName(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'phone':
                setPhone(value);
                break;
        }
    };

    const handleAuth = async () => {
        setIsLoading(true);
        clearErrors();

        try {
            if (isLogin) {
                const result = await login({
                    username: email,
                    password: password
                });

                if (result.success) {
                    const redirectTo = searchParams.get('redirectTo') || '/';
                    router.push(redirectTo);
                } else {
                    const errorDetails = formatErrorForDisplay(result.error || 'Login failed');
                    setErrorTitle(errorDetails.title);
                    setErrorMessage(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                }
            } else {
                if (!phone?.trim() || phone.length < 10) {
                    const errorDetails = formatErrorForDisplay('Phone number is required');
                    setErrorTitle(errorDetails.title);
                    setErrorMessage(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                    return;
                }

                // Split full name into first and last name for API
                const nameParts = fullName.trim().split(/\s+/);
                const firstName = nameParts[0] || '';
                const lastName = nameParts.slice(1).join(' ') || '';

                const result = await signup({
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phone: phone,
                    password: password,
                });

                if (result.success) {
                    router.push('/?modal=check-inbox');
                } else {
                    const errorDetails = formatErrorForDisplay(result.error || 'Signup failed');
                    setErrorTitle(errorDetails.title);
                    setErrorMessage(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                }
            }
        } catch (error) {
            const errorDetails = formatErrorForDisplay(error);
            setErrorTitle(errorDetails.title);
            setErrorMessage(errorDetails.message);
            setErrorAction(errorDetails.action || '');
        } finally {
            setIsLoading(false);
        }
    };

    const getIcon = (condition?: boolean) => {
        return condition ? (
            <Image src={'/icons/status/green-check.svg'} height={20} width={20} alt='check' className='h-[20px] w-[20px]' />
        ) : (
            <Image src={'/icons/status/red-check.svg'} height={20} width={20} alt='check' className='h-[20px] w-[20px]' />
        );
    };

    const lengthValid = password.length >= 8 && password.length <= 20;
    const letterValid = /[A-Za-z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[^A-Za-z0-9]/.test(password);
    const isStrong = lengthValid && letterValid && numberValid && specialCharValid;

    const btnActive = isLogin
        ? !!email && !!password
        : !!email && !!fullName && !!phone && isStrong;

    return (
        <div className='flex flex-col xs:pb-8'>
            <div className='w-full mt-[32px]'>
                {errorMessage && (
                    <ErrorDisplay
                        error={{
                            title: errorTitle,
                            message: errorMessage,
                            action: errorAction
                        }}
                        className="mb-4"
                    />
                )}

                <h1 className='font-poppins font-bold text-[24px] leading-[1.6] text-primary mb-1 xs:text-center'>
                    <span className='xs:hidden'>{isLogin ? 'Welcome Back !' : 'Create an account'}</span>
                    <span className='hidden xs:inline'>{isLogin ? 'Sign In' : 'Sign Up'}</span>
                </h1>

                {isLogin && (
                    <>
                        <p className='font-poppins typo-body-lg-medium leading-[1.4] text-text_two mb-[32px] xs:hidden'>
                            Log in to continue shopping for items
                        </p>
                        <div className='hidden xs:flex items-center justify-center gap-1 mb-[32px]'>
                            <p className='font-poppins typo-body-lg-regular leading-[1.2] text-text_one'>
                                Don&apos;t have an account?
                            </p>
                            <p
                                onClick={() => setIsLogin(false)}
                                className='font-poppins typo-body-lg-bold leading-[1.2] text-primary cursor-pointer'
                            >
                                Create one
                            </p>
                        </div>
                    </>
                )}

                {!isLogin && (
                    <div className='flex items-center gap-1 mb-[32px] xs:justify-center'>
                        <p className='font-poppins typo-body-lg-regular leading-[1.2] text-text_one'>
                            Already have an account?
                        </p>
                        <p
                            onClick={() => setIsLogin(true)}
                            className='font-poppins typo-body-lg-bold leading-[1.2] text-primary cursor-pointer'
                        >
                            Sign In
                        </p>
                    </div>
                )}

                <form
                    className='typo-body_mr text-text_one flex flex-col gap-[24px]'
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (btnActive) handleAuth();
                    }}
                >
                    {isLogin ? (
                        <>
                            <InputBox
                                value={email}
                                setValue={handleInput}
                                label='Email'
                                name='email'
                                placeholder='Enter email address'
                                type='email'
                            />
                            <div>
                                <InputBox
                                    value={password}
                                    setValue={handleInput}
                                    label='Password'
                                    name='password'
                                    placeholder='Enter Password'
                                    type='password'
                                />
                                <div className='flex justify-end mt-[10px]'>
                                    <span
                                        className='font-poppins typo-body-lg-semibold leading-[1.6] text-primary cursor-pointer'
                                        onClick={() => pushParam('reset')}
                                    >
                                        Forgot Password
                                    </span>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <InputBox
                                value={fullName}
                                setValue={handleInput}
                                label='Full Name'
                                name='fullName'
                                placeholder='Enter Full Name'
                                type='text'
                            />
                            <InputBox
                                value={email}
                                setValue={handleInput}
                                label='Email Address'
                                name='email'
                                placeholder='Enter email address'
                                type='email'
                            />
                            <div>
                                <InputBox
                                    value={password}
                                    setValue={handleInput}
                                    label='Password'
                                    name='password'
                                    placeholder='Enter password'
                                    type='password'
                                />
                                {password && (
                                    <div className='space-y-2 text-text-tertiary typo-label_xsr mt-4'>
                                        <div className='flex items-center gap-2'>
                                            {getIcon(lengthValid)}
                                            <span>8 characters (20 max)</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            {getIcon(letterValid && numberValid && specialCharValid)}
                                            <span>1 letter, 1 number, 1 special character (# ? ! @)</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            {getIcon(isStrong)}
                                            <span>Strong password</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <PhoneInput
                                label='Phone Number'
                                name='phone'
                                value={phone}
                                setValue={handleInput}
                                placeholder="Enter digits only"
                            />
                        </>
                    )}

                    <div>
                        <AuthButton
                            bg={btnActive}
                            title={isLogin ? 'Sign In' : 'Sign up'}
                            onClick={() => {
                                if (btnActive) handleAuth();
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </form>

                <div className='flex items-center gap-[10px] my-[18px]'>
                    <hr className='flex-1 border-border_gray' />
                    <span className='font-poppins typo-body-lg-regular text-black'>OR</span>
                    <hr className='flex-1 border-border_gray' />
                </div>

                {/* Desktop: full-width text buttons */}
                <div className='flex flex-col gap-4 xs:hidden'>
                    <AuthButton title='Continue with Google' icon='/icons/social/google-icon.svg' border onClick={loginWithGoogle} />
                    <AuthButton title='Continue with Facebook' icon='/icons/social/facebook-icon.svg' border link='/' />
                </div>
                {/* Mobile: circular icon-only buttons */}
                <div className='hidden xs:flex items-center justify-center gap-4'>
                    <div
                        onClick={loginWithGoogle}
                        className='w-[48px] h-[48px] rounded-full border border-border_gray flex items-center justify-center cursor-pointer'
                    >
                        <Image src='/icons/social/google-icon.svg' alt='Google' height={24} width={24} className='h-6 w-6' />
                    </div>
                    <div
                        onClick={() => { window.location.href = '/'; }}
                        className='w-[48px] h-[48px] rounded-full border border-border_gray flex items-center justify-center cursor-pointer'
                    >
                        <Image src='/icons/social/facebook-icon.svg' alt='Facebook' height={24} width={24} className='h-6 w-6' />
                    </div>
                </div>
            </div>

            {isLogin && (
                <div className='flex items-center justify-center gap-1 mt-[40px] xs:hidden'>
                    <p className='font-poppins typo-body-lg-regular leading-[1.2] text-text_one'>
                        Don&apos;t have an account?
                    </p>
                    <p
                        onClick={() => setIsLogin(false)}
                        className='font-poppins typo-body-lg-bold leading-[1.2] text-primary cursor-pointer'
                    >
                        Create one
                    </p>
                </div>
            )}
        </div>
    );
};

export default Form;
