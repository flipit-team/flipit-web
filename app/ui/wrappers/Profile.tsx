'use client';
import React, {useState} from 'react';
import InputBox from '../common/input-box';
import Image from 'next/image';
import RegularButton from '../common/buttons/RegularButton';

const Profile = () => {
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [password, setPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const formInputs = [
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
    return (
        <div className='flex items-center justify-center flex-col'>
            <div className='flex flex-col justify-center w-[984px] xs:w-full mt-[92px] xs:mt-6 shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent rounded-lg p-6'>
                <div className='typo-heading_small_medium pb-4 mb-6 border-b border-border_gray xs:hidden'>
                    My Profile
                </div>
                <div className='flex items-center gap-6 xs:flex-col'>
                    <form className='typo-body_medium_regular text-text_one flex flex-col gap-[26px] w-[512px] xs:w-full xs:order-2'>
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
                        <div className='w-[167px]'>
                            <RegularButton text='Save Changes' action={() => {}} />
                        </div>
                    </form>
                    <div className='flex flex-col flex-1 items-center justify-center xs:order-1'>
                        <Image
                            src={'/camera.png'}
                            height={224}
                            width={224}
                            alt='profile picture'
                            className='h-[224px] w-[224px] rounded-full'
                        />
                        <div className='flex items-center justify-center h-[45px] w-[159px] border border-primary text-primary rounded-lg typo-body_medium_semibold mt-5'>
                            Choose Image
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex justify-center w-[984px] xs:w-full mt-[92px] xs:mt-6 shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent rounded-lg p-6 flex-col'>
                <div className='typo-heading_small_medium pb-4 mb-6 border-b border-border_gray xs:border-none'>
                    Change Password
                </div>

                <form className='typo-body_medium_regular text-text_one flex gap-[26px] xs:flex-col'>
                    <InputBox
                        value={handleValue({label: 'password', name: 'password', placeholder: '', type: ''})}
                        setValue={handleInput}
                        label={'New Password'}
                        name={'password'}
                        placeholder={'password'}
                        type={'password'}
                    />
                    <InputBox
                        value={handleValue({label: 'password', name: 'password', placeholder: '', type: ''})}
                        setValue={handleInput}
                        label={'Confirm Password'}
                        name={'password'}
                        placeholder={'password'}
                        type={'password'}
                    />
                </form>
                <div className='w-[194px] mt-6'>
                    <RegularButton text='Change Password' action={() => {}} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
