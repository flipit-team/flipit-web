'use client';
import React, {useEffect, useState} from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';
import {useRouter, useSearchParams} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import Image from 'next/image';

const Form = () => {
    const {setUser, user} = useAppContext();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [password, setPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPhone('');
    }, [isLogin]);

    const loginWithGoogle = () => {
        window.location.href = '/api/auth/google-login';
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
                  label: 'Email address',
                  placeholder: 'Enter email address',
                  type: 'email',
                  name: 'email'
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
                  label: 'Full name',
                  placeholder: 'Enter firstname and lastname',
                  type: 'text',
                  name: 'fullname'
              },
              {
                  label: 'Email address',
                  placeholder: 'Enter email address',
                  type: 'email',
                  name: 'email'
              },
              {
                  label: 'Password',
                  placeholder: 'Enter password',
                  type: 'password',
                  name: 'password'
              },
              {
                  label: 'Phone number',
                  placeholder: '08012345678',
                  type: 'number',
                  name: 'phone'
              }
          ];

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setErrorMessage('');
        if (type === 'email') {
            setEmail(e.target.value);
        }
        if (type === 'password') {
            setPassword(e.target.value.toString());
        }
        if (type === 'firstname') {
            setFirstname(e.target.value);
        }
        if (type === 'lastname') {
            setLastname(e.target.value);
        }
        if (type === 'phone') {
            setPhone(e.target.value);
        }
    };

    const handleValue = (input: {label: string; placeholder: string; type: string; name: string}) => {
        if (input.name === 'email') {
            return email;
        }
        if (input.name === 'password') {
            return password;
        }
        if (input.name === 'firstname') {
            return firstname;
        }
        if (input.name === 'lastname') {
            return lastname;
        }
        if (input.name === 'phone') {
            return phone;
        }
    };
    const handleAuth = async () => {
        setIsLoading(true);
        setErrorMessage('');

        const formData = isLogin
            ? {
                  username: email,
                  password: password
              }
            : {
                  firstName: firstname,
                  lastName: lastname,
                  email: email,
                  phoneNumber: `+234${phone}`,
                  password: password
              };

        try {
            const res = await fetch(isLogin ? '/api/auth/login' : '/api/auth/register', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.apierror?.message ?? 'Login failed');
            }
            console.log(data);

            setIsLoading(false);
            setUser({
                token: data?.message?.token ?? '',
                userId: data?.message?.user?.id,
                userName: data?.message?.user?.firstName ?? ''
            });
            if (isLogin) {
                window.location.href = '/home';
            } else {
                window.location.href = '/home?modal=check-inbox';
            }
            router.refresh();
        } catch (err: any) {
            // display err.message in your UI
            setErrorMessage(err.message);
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

    const btnActive = isLogin ? !!email && !!password : !!email && isStrong && !!firstname && !!lastname && !!phone;

    return (
        <div className='flex items-center h-full xs:pb-0'>
            <div className='w-full'>
                {errorMessage && <div className='mb-4 text-red-600 typo-body_lr capitalize'>{errorMessage}</div>}

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

                <form className='typo-body_mr text-text_one flex flex-col gap-[26px]'>
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
                            onClick={() => handleAuth()}
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
