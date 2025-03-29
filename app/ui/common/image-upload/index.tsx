'use client';
import Image from 'next/image';
import React, {useState} from 'react';

const ImageUpload = () => {
    const [images, setImages] = useState<string[]>([]);

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
                    <input type='file' accept='image/*' multiple className='hidden' onChange={handleImageUpload} />+
                </label>
                {/* Display Images */}
                {images.map((src, index) => (
                    <div key={index} className='w-[64px] h-[64px] overflow-hidden rounded-lg border border-gray-300'>
                        <Image src={src} alt='Uploaded preview' className='w-full h-full object-cover' />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ImageUpload;
