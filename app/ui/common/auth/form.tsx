'use client';
import React, {useEffect, useState} from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';
import useSWRMutation from 'swr/mutation';
import {loginFetcher, signupFetcher} from '~/utils/helpers';
import {useRouter} from 'next/navigation';

const Form = () => {
    const [isLogin, setIsLogin] = useState(false);
    const [api, setApi] = useState('');
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');

    const [password, setPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [err, setErr] = useState(false);
    const [token, setToken] = useState<null | string>(null);

    const router = useRouter();
    const {trigger, isMutating, error, data} = useSWRMutation(
        '/api/signup', // Your actual signup endpoint
        isLogin ? loginFetcher : signupFetcher
    );

    useEffect(() => {
        setEmail('');
        setPassword('');
        setPhone('');
    }, [isLogin]);

    useEffect(() => {
        // Runs only on client
        if (token) {
            sessionStorage.setItem('token', token);
        }
    }, [token]);

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
                  placeholder: 'Enter Full Name',
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
                  placeholder: 'Enter digits only',
                  type: 'number',
                  name: 'phone'
              }
          ];

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setErr(false);
        if (type === 'email') {
            setEmail(e.target.value);
        }
        if (type === 'password') {
            setPassword(e.target.value);
        }
        if (type === 'fullname') {
            setName(e.target.value);
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
        if (input.name === 'fullname') {
            return name;
        }
        if (input.name === 'phone') {
            return phone;
        }
    };
    const handleAuth = async () => {
        console.log(email, password, name, phone);
        setErr(false);

        const formData = isLogin
            ? {
                  username: name,
                  password: password
              }
            : {
                  title: 'mr',
                  firstName: name,
                  middleName: name,
                  lastName: name,
                  email: email,
                  phoneNumber: phone,
                  password: password,
                  roleIds: [0],
                  verified: false,
                  deactivated: false
              };
        try {
            const response = await trigger(formData);
            console.log('Success:', response);
            if (isLogin) {
                setToken(response.jwt);
                router.push('/');
            } else {
                setIsLogin(true);
            }
        } catch (e) {
            console.error('Error:', e);
            setErr(true);
        }
    };
    return (
        <div className='flex items-center h-full xs:pb-0'>
            <div className='w-full'>
                {error && (
                    <div className='mb-4 text-red-600 typo-body_large_regular'>
                        Something went wring, please try again later
                    </div>
                )}

                <h1 className='typo-heading_large_bold text-primary mb-2 xs:mb-4  xs:text-center'>
                    {isLogin ? 'Sign In' : 'Create an Account'}
                </h1>
                <div className='flex items-center gap-1 mb-[38px] xs:justify-center'>
                    <p className='text-text_one typo-body_large_regular'>
                        {isLogin ? `Don't have an account?` : 'Already have an account?'}
                    </p>
                    <p
                        onClick={() => setIsLogin(!isLogin)}
                        className='text-primary typo-body_large_semibold underline cursor-pointer'
                    >
                        {isLogin ? 'Create one' : 'Sign In'}
                    </p>
                </div>

                <form className='typo-body_medium_regular text-text_one flex flex-col gap-[26px]'>
                    {formInputs.map((item, i) => {
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
                        <h5 className='ml-auto underline text-primary typo-body_large_semibold -mt-[18px]'>
                            Forgot Password?
                        </h5>
                    ) : (
                        <></>
                    )}
                    <div className='xs:mt-[24px]'>
                        <AuthButton
                            bg
                            title={isLogin ? 'Sign In' : 'Sign Up'}
                            onClick={() => handleAuth()}
                            isLoading={isMutating}
                        />
                    </div>
                </form>

                <div className='flex items-center justify-between my-[18px]'>
                    <hr className='w-full border-border_gray' />
                    <span className='px-2 typo-body_medium_regular text-text_four'>OR</span>
                    <hr className='w-full border-border_gray' />
                </div>

                <div className='flex flex-col gap-4'>
                    <AuthButton title='Continue with Google' icon='/google-icon.svg' border link='/home' />
                    <AuthButton title='Continue with Facebook' icon='/facebook-icon.svg' border link='/home' />
                </div>
            </div>
        </div>
    );
};

export default Form;
