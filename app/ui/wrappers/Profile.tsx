'use client';
import React, {useEffect, useState} from 'react';
import InputBox from '../common/input-box';
import Image from 'next/image';
import RegularButton from '../common/buttons/RegularButton';
import {useAppContext} from '~/contexts/AppContext';
import {ErrorResponse} from '~/utils/interface';
import {handleApiError} from '~/utils/helpers';

const Profile = () => {
    const [email, setEmail] = useState('');
    const [firstname, setFirstname] = useState('');
    const [lastname, setLastname] = useState('');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [phone, setPhone] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const {userId} = useAppContext();

    const formInputs = [
        {
            label: 'First name',
            placeholder: '',
            type: 'text',
            name: 'firstname',
            disabled: true
        },
        {
            label: 'Last name',
            placeholder: '',
            type: 'text',
            name: 'lastname',
            disabled: true
        },
        {
            label: 'Email address',
            placeholder: 'Enter email address',
            type: 'email',
            name: 'email',
            disabled: true
        },

        {
            label: 'Phone number',
            placeholder: '08012345678',
            type: 'text',
            name: 'phone',
            disabled: false
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
        if (type === 'confirm-password') {
            setConfirmPassword(e.target.value.toString());
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
        if (input.name === 'confirm-password') {
            return confirmPassword;
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

    const handleUpdate = async () => {
        setIsLoading(true);
        setErrorMessage('');

        const formData = {
            phoneNumber: `+234${phone}`
        };
        console.log(formData);

        try {
            const res = await fetch(`/api/profile/update-user?userId=${userId}`, {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.apierror?.message ?? 'Login failed');
            }

            console.log(data);
            setIsLoading(false);
        } catch (err: any) {
            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };

    const handleChangePassword = async () => {
        if (!password) {
            setErrorMessage('Please add password');
            return;
        }
        if (password !== confirmPassword) {
            setErrorMessage('Passwords do not match');
            return;
        }
        setIsLoading(true);
        setErrorMessage('');

        const formData = {
            newPassword: password,
            confirmPassword: confirmPassword
        };
        console.log(formData);

        try {
            const res = await fetch(`/api/profile/update-password`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData)
            });

            const data = await res.json();
            console.log(data);

            if (!res.ok) {
                const message = handleApiError(data);
                setErrorMessage(message);
            }
            setSuccessMessage('Password changed successfully');
            console.log(data);
            setIsLoading(false);
        } catch (err: any) {
            console.log(err.message);

            setErrorMessage(err.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`/api/profile/get-profile`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.apierror?.message || 'Failed to fetch items');
                }

                const data = await res.json();
                console.log(data, 77);
                setFirstname(data.firstName);
                setLastname(data.lastName);
                setEmail(data.email);
                setPhone(data.phoneNumber);
            } catch (err: any) {
                setErrorMessage(err.message || 'Something went wrong');
            } finally {
                setIsLoading(false);
            }
        };
        fetchItems();
    }, []);

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
                                    disabled={item.disabled}
                                />
                            );
                        })}
                        <div className='w-[167px]'>
                            <RegularButton text='Save Changes' action={handleUpdate} />
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
            <div className='flex justify-center w-[984px] xs:w-full mt-6 shadow-[0px_4px_10px_rgba(0,0,0,0.2)] xs:shadow-transparent rounded-lg p-6 flex-col'>
                <div className='typo-heading_small_medium pb-4 mb-6 border-b border-border_gray xs:border-none'>
                    Change Password
                </div>

                {errorMessage && (
                    <div className='typo-body_medium_medium text-red-400 text-center mb-6'>{errorMessage}</div>
                )}
                {successMessage && (
                    <div className='typo-body_medium_medium text-green-400 text-center mb-6'>{successMessage}</div>
                )}

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
                        value={handleValue({
                            label: 'confirm-password',
                            name: 'confirm-password',
                            placeholder: '',
                            type: ''
                        })}
                        setValue={handleInput}
                        label={'Confirm Password'}
                        name={'confirm-password'}
                        placeholder={'password'}
                        type={'password'}
                    />
                </form>
                <div className='w-[194px] mt-6'>
                    <RegularButton text='Change Password' action={handleChangePassword} isLoading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default Profile;
