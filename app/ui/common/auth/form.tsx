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
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
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
        setUsername(''); // Clear username when switching modes
        setFirstname('');
        setLastname('');
        setDateOfBirth('');
    }, [isLogin]);

    const loginWithGoogle = async () => {
        try {
            const { data, error } = await AuthService.getGoogleLoginUrl();
            if (error) {
                setErrorMessage(error.message);
                return;
            }
            if (data?.url) {
                window.location.href = data.url;
            } else {
                window.location.href = '/api/auth/google-login';
            }
        } catch (error) {
            setErrorMessage('Failed to initiate Google login');
            window.location.href = '/api/auth/google-login';
        }
    };

    const pushParam = (param: string) => {
        // Push new URL param without full page reload
        const newParams = new URLSearchParams(searchParams.toString());
        newParams.set('auth', param);
        setTimeout(() => {
            router.replace(`/?${newParams.toString()}`);
        }, 0);
    };

    const formInputs = isLogin
        ? [
              {
                  label: 'Email/Username',
                  placeholder: 'Enter email or username',
                  type: 'text',
                  name: 'username'
              },
              {
                  label: 'Password',
                  placeholder: 'Enter password',
                  type: 'password',
                  name: 'password'
              }
          ]
        : [
              {
                  label: 'First name',
                  placeholder: 'Enter first name',
                  type: 'text',
                  name: 'firstname'
              },
              {
                  label: 'Last name',
                  placeholder: 'Enter last name',
                  type: 'text',
                  name: 'lastname'
              },
              {
                  label: 'Email address',
                  placeholder: 'Enter email address',
                  type: 'email',
                  name: 'email'
              },
              {
                  label: 'Phone number',
                  placeholder: '08012345678',
                  type: 'tel',
                  name: 'phone'
              },
              {
                  label: 'Date of Birth',
                  placeholder: 'YYYY-MM-DD',
                  type: 'date',
                  name: 'dateOfBirth'
              },
              {
                  label: 'Password',
                  placeholder: 'Enter password',
                  type: 'password',
                  name: 'password'
              }
          ];

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setErrorMessage('');
        setErrorTitle('');
        setErrorAction('');
        const value = e.target.value;
        
        switch (type) {
            case 'email':
                setEmail(value);
                break;
            case 'username':
                setUsername(value);
                break;
            case 'password':
                setPassword(value);
                break;
            case 'firstname':
                setFirstname(value);
                break;
            case 'lastname':
                setLastname(value);
                break;
            case 'phone':
                setPhone(value);
                break;
            case 'dateOfBirth':
                setDateOfBirth(value);
                break;
        }
    };

    const handleValue = (input: {label: string; placeholder: string; type: string; name: string}) => {
        switch (input.name) {
            case 'email':
                return email;
            case 'username':
                return username;
            case 'password':
                return password;
            case 'firstname':
                return firstname;
            case 'lastname':
                return lastname;
            case 'phone':
                return phone;
            case 'dateOfBirth':
                return dateOfBirth;
            default:
                return '';
        }
    };
    const handleAuth = async () => {
        setIsLoading(true);
        setErrorMessage('');
        setErrorTitle('');
        setErrorAction('');

        try {
            if (isLogin) {
                const result = await login({
                    username: username || email,
                    password: password
                });

                if (result.success) {
                    // Redirect to intended page or home
                    const redirectTo = searchParams.get('redirectTo') || '/home';
                    router.push(redirectTo);
                } else {
                    const errorDetails = formatErrorForDisplay(result.error || 'Login failed');
                    setErrorTitle(errorDetails.title);
                    setErrorMessage(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                }
            } else {
                // Additional validation for signup
                if (!phone?.trim() || phone.length < 14) { // +234XXXXXXXXXX = 14 chars minimum
                    const errorDetails = formatErrorForDisplay('Phone number is required');
                    setErrorTitle(errorDetails.title);
                    setErrorMessage(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                    return;
                }

                const result = await signup({
                    username: email, // Use email as username for signup
                    firstName: firstname,
                    lastName: lastname,
                    email: email,
                    phone: phone, // PhoneInput already provides formatted phone with +234
                    password: password,
                    dateOfBirth: dateOfBirth
                });

                if (result.success) {
                    router.push('/home?modal=check-inbox');
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
            <Image src={'/green-check.svg'} height={20} width={20} alt='check' className='h-[20px] w-[20px]' />
        ) : (
            <Image src={'/grey-check.svg'} height={20} width={20} alt='check' className='h-[20px] w-[20px]' />
        );
    };

    const lengthValid = password.length >= 8 && password.length <= 20;
    const letterValid = /[A-Za-z]/.test(password);
    const numberValid = /\d/.test(password);
    const specialCharValid = /[^A-Za-z0-9]/.test(password);
    const isStrong = lengthValid && letterValid && numberValid && specialCharValid;

    const btnActive = isLogin 
        ? !!(username || email) && !!password 
        : !!email && !!firstname && !!lastname && !!phone && !!dateOfBirth && isStrong;
    

    return (
        <div className='flex items-center h-full xs:pb-0'>
            <div className='w-full'>
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

                <h1 className='typo-heading_lb text-primary mb-2 xs:mb-4  xs:text-center'>
                    {isLogin ? 'Sign In' : 'Create an Account'}
                </h1>
                <div className='flex items-center gap-1 mb-[38px] xs:justify-center'>
                    <p className='text-text_one typo-body_lr'>
                        {isLogin ? `Don't have an account?` : 'Already have an account?'}
                    </p>
                    <p
                        onClick={() => setIsLogin(!isLogin)}
                        className='text-primary typo-body_ls underline cursor-pointer'
                    >
                        {isLogin ? 'Create one' : 'Sign In'}
                    </p>
                </div>

                <form
                    className='typo-body_mr text-text_one flex flex-col gap-[26px]'
                    onSubmit={(e) => {
                        e.preventDefault();
                        if (btnActive) {
                            handleAuth();
                        }
                    }}
                >
                    {formInputs.map((item, i) => {
                        if (item.name === 'password') {
                            return (
                                <div key={i}>
                                    <InputBox
                                        value={handleValue(item)}
                                        setValue={handleInput}
                                        key={i}
                                        label={item.label}
                                        name={item.name}
                                        placeholder={item.placeholder}
                                        type={item.type}
                                    />
                                    {!isLogin && (
                                        <div className='space-y-2 text-text-tertiary typo-label_xsr mt-7'>
                                            <div className='flex items-center gap-2'>
                                                {getIcon(lengthValid)}
                                                <span>8 characters (20 max)</span>
                                            </div>
                                            <div className='flex items-center gap-2'>
                                                {getIcon(letterValid && numberValid && specialCharValid)}
                                                <span>1 letter, 1 number, 1 special character (# ? ! @)</span>
                                            </div>

                                            <div className='flex items-center gap-2'>
                                                {getIcon(lengthValid && letterValid && numberValid && specialCharValid)}
                                                <span>Strong password</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        }
                        // Special handling for phone input
                        if (item.name === 'phone') {
                            return (
                                <PhoneInput
                                    key={i}
                                    label={item.label}
                                    name={item.name}
                                    value={phone}
                                    setValue={handleInput}
                                    placeholder="080 123 4567"
                                />
                            );
                        }
                        
                        return (
                            <InputBox
                                value={handleValue(item)}
                                setValue={handleInput}
                                key={i}
                                label={item.label}
                                name={item.name}
                                placeholder={item.placeholder}
                                type={item.type}
                            />
                        );
                    })}
                    {isLogin ? (
                        <h5
                            className='ml-auto underline text-primary typo-body_ls -mt-[18px] cursor-pointer'
                            onClick={() => pushParam('reset')}
                        >
                            Forgot Password?
                        </h5>
                    ) : (
                        <></>
                    )}
                    <div className='xs:mt-[24px]'>
                        <AuthButton
                            bg={btnActive}
                            title={isLogin ? 'Sign In' : 'Sign Up'}
                            onClick={() => {
                                if (btnActive) {
                                    handleAuth();
                                }
                            }}
                            isLoading={isLoading}
                        />
                    </div>
                </form>

                <div className='flex items-center justify-between my-[18px]'>
                    <hr className='w-full border-border_gray' />
                    <span className='px-2 typo-body_mr text-text_four'>OR</span>
                    <hr className='w-full border-border_gray' />
                </div>

                <div className='flex flex-col gap-4'>
                    <AuthButton title='Continue with Google' icon='/google-icon.svg' border onClick={loginWithGoogle} />
                    <AuthButton title='Continue with Facebook' icon='/facebook-icon.svg' border link='/home' />
                </div>
            </div>
        </div>
    );
};

export default Form;
