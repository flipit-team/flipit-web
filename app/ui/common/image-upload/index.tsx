'use client';
import Image from 'next/image';
import React, {useEffect, useState} from 'react';

const ImageUpload = () => {
    const [images, setImages] = useState<string[]>([]);
    const [file, setFile] = useState<File | null>(null);
    const [previewUrls, setPreviewUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);
    const [response, setResponse] = useState<string | null>(null);

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
        setResponse(null);

        const formData = new FormData();
        formData.append('file', selectedFile);
        // // DEBUG
        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });
            console.log(res, 5444);

            // // Prevent parsing if there's no body or wrong content type
            // const contentType = res.headers.get('content-type');
            // let data;

            // if (contentType?.includes('application/json')) {
            //     data = await res.json();
            // } else {
            //     data = await res.text();
            // }

            // setResponse(typeof data === 'string' ? data : JSON.stringify(data, null, 2));
        } catch (error) {
            console.error('Upload failed', error);
            setResponse('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const newImages = Array.from(files).map((file) => URL.createObjectURL(file));
            setImages((prev) => [...prev, ...newImages]);
        }
    };
    return (
        <div className=''>
            <div className='flex flex-wrap gap-2 items-center'>
                {/* Upload Button */}
                <label className='cursor-pointer flex items-center justify-center w-[64px] h-[64px] border-2 border-dashed bg- border-gray-300 rounded-lg text-gray-500 hover:border-gray-400'>
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
