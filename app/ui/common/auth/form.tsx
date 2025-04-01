'use client';
import React, {useState} from 'react';
import InputBox from '../input-box';
import AuthButton from '../buttons/AuthButton';

const Form = () => {
    const [isLogin, setIsLogin] = useState(false);

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
    return (
        <div className='flex items-center h-full xs:pb-0'>
            <div className='w-full'>
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
                        <AuthButton bg title={isLogin ? 'Sign In' : 'Sign Up'} />
                    </div>
                </form>

                <div className='flex items-center justify-between my-[18px]'>
                    <hr className='w-full border-border_gray' />
                    <span className='px-2 typo-body_medium_regular text-text_four'>OR</span>
                    <hr className='w-full border-border_gray' />
                </div>

                <div className='flex flex-col gap-4'>
                    <AuthButton title='Continue with Google' icon='/google-icon.svg' border />
                    <AuthButton title='Continue with Facebook' icon='/facebook-icon.svg' border />
                </div>
            </div>
        </div>
    );
};

export default Form;
