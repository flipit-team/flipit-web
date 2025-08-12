'use client';
import {useState} from 'react';
import {Camera} from 'lucide-react';
import Image from 'next/image';
import InputBox from '~/ui/common/input-box';
import Button from '~/ui/common/button';
import RegularButton from '~/ui/common/buttons/RegularButton';

const PersonalDetailsContent = () => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, fieldType: string) => {
        const value = e.target.value;
        switch (fieldType) {
            case 'firstname':
                setFirstName(value);
                break;
            case 'lastname':
                setLastName(value);
                break;
            case 'email':
                setEmail(value);
                break;
            case 'phonenumber':
                setPhoneNumber(value);
                break;
        }
    };

    const handleSaveChanges = () => {
        // Handle save logic here
        console.log('Saving changes:', {
            firstName,
            lastName,
            email,
            phoneNumber,
            profileImage
        });
    };

    return (
        <div>
            <h2 className='text-lg md:text-xl font-medium text-gray-900 mb-4'>Personal Details</h2>
            <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>

            <div className='flex flex-col lg:flex-row gap-8 lg:gap-16'>
                {/* Left side - Form */}
                <div className='flex-1 space-y-6'>
                    <InputBox
                        label='First name'
                        name='firstname'
                        placeholder='Enter first name'
                        type='text'
                        value={firstName}
                        setValue={(e) => handleInputChange(e, 'firstname')}
                    />

                    <InputBox
                        label='Last Name'
                        name='lastname'
                        placeholder='Enter last name'
                        type='text'
                        value={lastName}
                        setValue={(e) => handleInputChange(e, 'lastname')}
                    />

                    <InputBox
                        label='Email'
                        name='email'
                        placeholder='Enter email address'
                        type='email'
                        value={email}
                        setValue={(e) => handleInputChange(e, 'email')}
                    />

                    <InputBox
                        label='Phone Number'
                        name='phonenumber'
                        placeholder='Enter phone number'
                        type='tel'
                        value={phoneNumber}
                        setValue={(e) => handleInputChange(e, 'phonenumber')}
                    />
                    <div className='w-[167px]'>
                        <RegularButton text='Save Changes' />
                    </div>
                </div>

                {/* Right side - Profile Image */}
                <div className='flex flex-col items-center lg:items-start'>
                    <div className='relative w-[180px] h-[180px] lg:w-[224px] lg:h-[224px] bg-[#f4f4f9] rounded-full flex items-center justify-center overflow-hidden mb-4'>
                        {profileImage ? (
                            <Image src={profileImage} alt='Profile' fill className='object-cover' />
                        ) : (
                            <Camera className='w-12 h-12 text-gray-400' />
                        )}
                    </div>

                    <label htmlFor='profile-image-upload' className='cursor-pointer'>
                        <div className='bg-transparent border border-primary text-primary hover:bg-primary hover:text-white transition-colors duration-200 h-[31px] px-[40px] py-[16px] text-[14px] flex items-center justify-center rounded-[8px] font-semibold'>
                            Select Image
                        </div>
                        <input
                            id='profile-image-upload'
                            type='file'
                            accept='image/*'
                            onChange={handleImageUpload}
                            className='hidden'
                        />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default PersonalDetailsContent;
