'use client';
import {Loader} from 'lucide-react';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';
import {useToast} from '~/contexts/ToastContext';

interface Props {
    setUrls: React.Dispatch<React.SetStateAction<string[]>>;
    uploading?: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
    initialUrls?: string[];
}
const ImageUpload = (props: Props) => {
    const {uploading, setUploading, setUrls, initialUrls = []} = props;
    const [file, setFile] = useState<File | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>(initialUrls);
    const {showError} = useToast();

    useEffect(() => {
        if (!file) return;

        handleUpload(file);
    }, [file]);

    const handleUpload = async (selectedFile: File) => {
        setUploading(true);

        const formData = new FormData();
        formData.append('file', selectedFile);

        // Create preview URL
        const previewUrl = URL.createObjectURL(selectedFile);

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({error: 'Upload failed'}));

                // Extract the message from nested structure
                let errorMessage = 'Upload failed';

                if (errorData.error && typeof errorData.error === 'string') {
                    try {
                        // Parse nested JSON error
                        const nestedError = JSON.parse(errorData.error.replace('Upload failed: ', ''));
                        errorMessage = nestedError.apierror?.message || 'Upload failed';
                    } catch {
                        errorMessage = 'Upload failed';
                    }
                }

                // Revoke preview URL on error
                URL.revokeObjectURL(previewUrl);
                throw new Error(errorMessage);
            }

            // Prevent parsing if there's no body or wrong content type
            const contentType = res.headers.get('content-type');
            let data;

            if (contentType?.includes('application/json')) {
                data = await res.json();
            } else {
                data = await res.text();
            }

            if (data && data.key) {
                // Only add preview if upload succeeded
                setPreviewUrls((prev) => [...prev, previewUrl]);
                setUrls((prev) => [...prev, data.key]);
            } else {
                // Revoke preview URL on error
                URL.revokeObjectURL(previewUrl);
                showError('Upload failed - no file key returned');
            }
        } catch (error) {
            // Preview URL already revoked in error handling above
            showError(error instanceof Error ? error.message : 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleRemoveImage = (index: number) => {
        setPreviewUrls((prev) => prev.filter((_, i) => i !== index));
        setUrls((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <div className=''>
            <div className='flex flex-wrap gap-2 items-center'>
                {/* Upload Button */}

                <label className='cursor-pointer flex items-center justify-center w-[64px] h-[64px] border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-gray-400'>
                    {uploading ? (
                        <Loader />
                    ) : (
                        <>
                            <input
                                type='file'
                                accept='image/*'
                                className='hidden'
                                onChange={(e) => {
                                    const selected = e.target.files?.[0];
                                    if (selected) {
                                        setFile(selected);
                                    }
                                    // Reset the input so the same file can be selected again
                                    e.target.value = '';
                                }}
                            />
                            +
                        </>
                    )}
                </label>

                {/* Display Images */}
                {previewUrls.map((src, index) => (
                    <div
                        key={index}
                        className='relative w-[64px] h-[64px] overflow-hidden rounded-lg border border-gray-300'
                    >
                        <Image
                            src={src}
                            alt='Uploaded preview'
                            height={64}
                            width={64}
                            className='w-full h-full object-cover'
                            sizes='64px'
                            placeholder='blur'
                            blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kic6LbJ7djdjvj28J7vD94nSRnr/Z/9k='
                            loading='lazy'
                        />
                        <button
                            type='button'
                            onClick={() => handleRemoveImage(index)}
                            className='absolute top-[1px] right-[1px] bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 shadow-md'
                            aria-label='Remove image'
                        >
                            <svg className='w-3 h-3' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M6 18L18 6M6 6l12 12'
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
