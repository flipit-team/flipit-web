'use client';
import {Loader} from 'lucide-react';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';

interface Props {
    setUrls: React.Dispatch<React.SetStateAction<string[]>>;
    uploading?: boolean;
    setUploading: React.Dispatch<React.SetStateAction<boolean>>;
}
const ImageUpload = (props: Props) => {
    const {uploading, setUploading, setUrls} = props;
    const [file, setFile] = useState<File | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);

    useEffect(() => {
        if (!file) return;

        const url = URL.createObjectURL(file);
        setPreviewUrls((prev) => {
            return [...prev, url];
        });

        handleUpload(file);

        return () => URL.revokeObjectURL(url);
    }, [file]);

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
            setUrls((prev) => {
                const newData = [...prev, data.key];
                return newData;
            });
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
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
                                multiple
                                className='hidden'
                                onChange={(e) => {
                                    const selected = e.target.files?.[0];
                                    if (selected) {
                                        setFile(selected);
                                    }
                                }}
                            />
                            +
                        </>
                    )}
                </label>

                {/* Display Images */}
                {previewUrls.map((src, index) => (
                    <div key={index} className='w-[64px] h-[64px] overflow-hidden rounded-lg border border-gray-300'>
                        <Image
                            src={src}
                            alt='Uploaded preview'
                            height={64}
                            width={64}
                            className='w-full h-full object-cover'
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
