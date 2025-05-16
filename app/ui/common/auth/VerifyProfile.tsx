'use client';
import {Camera, File, RefreshCcw, Upload} from 'lucide-react';
import Image from 'next/image';
import React, {useRef, useState} from 'react';
import InputBox from '../input-box';
import RadioButtons from '../radio-buttons';
import VerifyToggle from './VerifyToggle';
import AuthButton from '../buttons/AuthButton';
import {usePathname, useSearchParams} from 'next/navigation';

const VerifyProfile = ({forVerify}: {forVerify: boolean}) => {
    const [isVerify, setIsVerify] = useState(forVerify);
    const [image, setImage] = useState<string | null>(null);
    const [imageTwo, setImageTwo] = useState<string | null>(null);
    const [fileInfo, setFileInfo] = useState<{name: string; size: string} | null>(null);
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [selected, setSelected] = useState('');
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const pushParam = (text: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('auth', text);
        return `${pathname}?${params.toString()}`;
    };

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^[0-9]+$/.test(pasteData)) return;

        const newCode = pasteData.split('');
        setCode(newCode.concat(Array(6 - newCode.length).fill('')));
        newCode.forEach((digit, i) => inputsRef.current[i]?.focus());
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>, forProfile: boolean) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                if (forProfile) {
                    setImage(reader.result as string);
                } else {
                    setImageTwo(reader.result as string);
                    setFileInfo({
                        name: file.name,
                        size: (file.size / 1024 / 1024).toFixed(2) + ' MB' // Convert bytes to MB
                    });
                }
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        <div className='h-full flex flex-col justify-center xs:justify-normal xs:pt-14'>
            <VerifyToggle isVerify={isVerify} setIsVerify={setIsVerify} />

            <h1 className='typo-heading_lb xs:typo-heading_mb xs:text-center text-primary mb-2'>
                {isVerify ? 'Verify Your Profile' : 'Verify Your Phone number'}
            </h1>
            <p className='typo-body_lr xs:typo-body_mr xs:text-center text-text_one'>
                {isVerify
                    ? 'Secure your account and gain trust in the community'
                    : 'Please enter the OTP sent to the phone number you provided to verify your phone number'}
            </p>
            {isVerify ? (
                <>
                    <div className='flex items-center gap-4 py-10'>
                        <label className='relative w-[92px] h-[92px] bg-[#f4f4f9] rounded-full flex items-center justify-center cursor-pointer overflow-hidden'>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => handleImageUpload(e, true)}
                                className='hidden'
                            />
                            {image ? (
                                <>
                                    <img src={image} alt='Preview' className='w-full h-full object-cover' />
                                    <div className='absolute inset-0 flex items-center justify-center bg-black/30'>
                                        <Camera className='w-6 h-w-6 text-white opacity-80' />
                                    </div>
                                </>
                            ) : (
                                <Camera className='w-6 h-w-6 text-gray-500' />
                            )}
                        </label>
                        <div>
                            <p className='typo-body_ls'>Upload your photo</p>
                            <p className='typo-body_mr text-text_four'>
                                This photo will be used for your public profile
                            </p>
                        </div>
                    </div>
                    <div className='mb-6'>
                        <InputBox label='BVN' name='bvn' placeholder='1234567890' type='number' />
                    </div>
                    <RadioButtons
                        selected={selected}
                        setSelected={setSelected}
                        nameOne='passport'
                        nameTwo='id'
                        nameThree='license'
                        title='Select your government issued document type'
                        titleOne='International passport'
                        titleTwo='National ID'
                        titleThree="Driver's License"
                        col
                    />
                    <div className='my-6'>
                        <p className='mb-2'>Upload Government issued document</p>
                        <label className='flex items-center justify-center rounded-md bg-[#f4f4f9] h-[64px] border border-dashed border-primary'>
                            <input
                                type='file'
                                accept='image/*'
                                onChange={(e) => handleImageUpload(e, false)}
                                className='hidden'
                            />
                            <Upload className='text-primary' />
                            <p className='typo-body_lr ml-2'>Click to upload file</p>
                        </label>
                        {fileInfo && (
                            <div className='h-[68px] flex items-center border border-border_gray px-4 mt-6 rounded-md'>
                                <File className='text-primary h-9 w-9' />
                                <div className='ml-2'>
                                    <p className='typo-body_ss'>{fileInfo?.name}</p>
                                    <p className='typo-body_sr text-[#6d6d6d]'>{fileInfo.size}</p>
                                </div>
                                <Image
                                    src={'/cancel-circle.svg'}
                                    height={24}
                                    width={24}
                                    className='h-6 w-6 ml-auto'
                                    alt='cancel'
                                    onClick={() => {
                                        setFileInfo(null);
                                        setImageTwo(null);
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <div className='flex pt-6'>
                    <div className='flex w-full justify-between mb-6'>
                        {code.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => {
                                    if (el) inputsRef.current[index] = el;
                                }}
                                type='text'
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onPaste={handlePaste}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                maxLength={1}
                                className='w-12 h-12 text-center text-lg border rounded-md focus:ring-2 focus:ring-blue-500'
                            />
                        ))}
                    </div>
                </div>
            )}
            <AuthButton
                title={isVerify ? 'Continue' : 'Verify your account'}
                bg
                link={pushParam(isVerify ? 'verify' : 'code')}
            />
            <div className='flex items-center gap-2 mt-6 justify-center typo-body_mr'>
                <RefreshCcw size={16} /> Resend Code
            </div>
        </div>
    );
};

export default VerifyProfile;
