'use client';
import { Camera, File, Upload } from 'lucide-react';
import Image from 'next/image';
import { useState, useRef } from 'react';
import InputBox from '~/ui/common/input-box';
import RadioButtons from '~/ui/common/radio-buttons';
import Button from '~/ui/common/button';

interface ProfileVerificationStepProps {
    onNext: () => void;
}

const ProfileVerificationStep = ({ onNext }: ProfileVerificationStepProps) => {
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [documentImage, setDocumentImage] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{ name: string; size: string } | null>(null);
    const [selectedDocType, setSelectedDocType] = useState('');
    const [bvn, setBvn] = useState('');

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, isProfile: boolean) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (isProfile) {
                    setProfileImage(reader.result as string);
                } else {
                    setDocumentImage(reader.result as string);
                    setFileInfo({
                        name: file.name,
                        size: (file.size / 1024 / 1024).toFixed(2) + ' MB'
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = () => {
        // Validation logic here
        if (profileImage && bvn && selectedDocType && documentImage) {
            onNext();
        }
    };

    return (
        <div className='space-y-6'>
            {/* Profile Photo Upload */}
            <div className='flex items-center gap-4'>
                <label className='relative w-[92px] h-[92px] bg-[#f4f4f9] rounded-full flex items-center justify-center cursor-pointer overflow-hidden'>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, true)}
                        className='hidden'
                    />
                    {profileImage ? (
                        <>
                            <Image src={profileImage} alt='Profile Preview' fill className='object-cover' />
                            <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                                <Camera className='w-6 h-6 text-white opacity-80' />
                            </div>
                        </>
                    ) : (
                        <Camera className='w-6 h-6 text-gray-500' />
                    )}
                </label>
                <div>
                    <p className='font-semibold text-gray-900'>Upload your photo</p>
                    <p className='text-sm text-gray-500'>
                        This photo will be used for your public profile
                    </p>
                </div>
            </div>

            {/* BVN Input */}
            <div>
                <InputBox 
                    label='BVN' 
                    name='bvn' 
                    placeholder='1234567890' 
                    type='number'
                    value={bvn}
                    setValue={(e) => setBvn(e.target.value)}
                />
            </div>

            {/* Document Type Selection */}
            <div>
                <RadioButtons
                    selected={selectedDocType}
                    setSelected={setSelectedDocType}
                    nameOne='passport'
                    nameTwo='id'
                    nameThree='license'
                    title='Select your government issued document type'
                    titleOne='International passport'
                    titleTwo='National ID'
                    titleThree="Driver's License"
                    col
                />
            </div>

            {/* Document Upload */}
            <div>
                <p className='mb-2 font-medium text-gray-900'>Upload Government issued document</p>
                <label className='flex items-center justify-center rounded-md bg-[#f4f4f9] h-[64px] border border-dashed border-primary cursor-pointer hover:bg-gray-100 transition-colors'>
                    <input
                        type='file'
                        accept='image/*'
                        onChange={(e) => handleImageUpload(e, false)}
                        className='hidden'
                    />
                    <Upload className='text-primary mr-2' />
                    <p className='text-gray-700'>Click to upload file</p>
                </label>

                {fileInfo && (
                    <div className='h-[68px] flex items-center border border-border_gray px-4 mt-4 rounded-md bg-white'>
                        <File className='text-primary h-9 w-9' />
                        <div className='ml-3 flex-1'>
                            <p className='text-sm font-medium text-gray-900'>{fileInfo.name}</p>
                            <p className='text-xs text-gray-500'>{fileInfo.size}</p>
                        </div>
                        <button
                            onClick={() => {
                                setFileInfo(null);
                                setDocumentImage(null);
                            }}
                            className='text-gray-400 hover:text-red-500 transition-colors'
                        >
                            <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                            </svg>
                        </button>
                    </div>
                )}
            </div>

            {/* Continue Button */}
            <div className='pt-6'>
                <Button 
                    variant='primary' 
                    size='lg' 
                    onClick={handleSubmit}
                    className='w-full'
                >
                    Continue
                </Button>
            </div>
        </div>
    );
};

export default ProfileVerificationStep;