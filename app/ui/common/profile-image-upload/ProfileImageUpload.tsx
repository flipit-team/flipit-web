import {Loader} from 'lucide-react';
import Image from 'next/image';
import React, {useEffect, useRef, useState} from 'react';
import {useToast} from '~/contexts/ToastContext';

const ProfileImageUpload = ({
    setImgUrl,
    currentAvatar
}: {
    setImgUrl: React.Dispatch<React.SetStateAction<string>>;
    currentAvatar?: string;
}) => {
    const [previewUrl, setPreviewUrl] = useState<string>('');
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const {showError} = useToast();

    useEffect(() => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreviewUrl(url);

        handleUpload(file);

        return () => URL.revokeObjectURL(url);
    }, [file]);

    useEffect(() => {
        if (currentAvatar) setPreviewUrl(currentAvatar);
    }, [currentAvatar]);

    const handleUpload = async (selectedFile: File) => {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            // Prevent parsing if there's no body or wrong content type
            const contentType = res.headers.get('content-type');
            let data;

            if (contentType?.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }
            setImgUrl(data.key);
        } catch (error) {
            showError(error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className='flex flex-col flex-1 items-center justify-center xs:order-1'>
            {previewUrl ? (
                <Image
                    src={previewUrl}
                    height={224}
                    width={224}
                    sizes="(max-width: 640px) 180px, 224px"
                    quality={80}
                    alt='profile picture'
                    className='h-[224px] w-[224px] rounded-full'
                />
            ) : (
                <div className='mb-4'>+</div>
            )}
            {uploading ? (
                <Loader />
            ) : (
                <>
                    <input
                        ref={inputRef}
                        type='file'
                        accept='image/*'
                        multiple
                        className='hidden'
                        onChange={(e) => {
                            const selected = e.target.files?.[0];
                            if (selected) {
                                setFile(selected);
                            }
                        }}
                    />
                    <div
                        onClick={() => inputRef.current?.click()}
                        className='flex items-center justify-center h-[45px] w-[159px] border border-primary text-primary rounded-lg typo-body_ms mt-5 cursor-pointer hover:text-primary-light hover:border-primary-light transition-colors'
                    >
                        Choose Image
                    </div>
                </>
            )}
        </div>
    );
};

export default ProfileImageUpload;
