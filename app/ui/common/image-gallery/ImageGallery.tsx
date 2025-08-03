'use client';
import Image from 'next/image';
import React, { ReactNode } from 'react';

interface ImageGalleryProps {
    mainImage: {
        src: string;
        alt: string;
        width?: number;
        height?: number;
    };
    thumbnails: Array<{
        src: string;
        alt: string;
        width?: number;
        height?: number;
    }>;
    thumbnailPosition?: 'top' | 'right' | 'left' | 'bottom';
    overlayElements?: ReactNode;
    className?: string;
    mainImageClassName?: string;
    thumbnailsClassName?: string;
    thumbnailClassName?: string;
}

const ImageGallery = ({
    mainImage,
    thumbnails,
    thumbnailPosition = 'bottom',
    overlayElements,
    className = '',
    mainImageClassName = '',
    thumbnailsClassName = '',
    thumbnailClassName = ''
}: ImageGalleryProps) => {
    const getLayoutClasses = () => {
        switch (thumbnailPosition) {
            case 'top':
                return 'flex flex-col-reverse';
            case 'right':
                return 'flex flex-row';
            case 'left':
                return 'flex flex-row-reverse';
            case 'bottom':
            default:
                return 'flex flex-col';
        }
    };

    const getThumbnailContainerClasses = () => {
        switch (thumbnailPosition) {
            case 'top':
            case 'bottom':
                return 'grid grid-cols-3 gap-6';
            case 'right':
            case 'left':
                return 'flex flex-col gap-6';
        }
    };

    const getMainImageContainerClasses = () => {
        switch (thumbnailPosition) {
            case 'top':
            case 'bottom':
                return 'mb-6';
            case 'right':
                return 'mr-6';
            case 'left':
                return 'ml-6';
        }
    };

    return (
        <div className={`${className}`}>
            <div className={getLayoutClasses()}>
                <div className={`relative ${getMainImageContainerClasses()}`}>
                    <Image
                        src={mainImage.src}
                        height={mainImage.height || 443}
                        width={mainImage.width || 712}
                        alt={mainImage.alt}
                        className={`xs:w-full xs:h-[222px] ${mainImageClassName}`}
                        style={{ 
                            height: `${mainImage.height || 443}px`, 
                            width: `${mainImage.width || 712}px` 
                        }}
                    />
                    {overlayElements}
                </div>
                
                <div className={`${getThumbnailContainerClasses()} ${thumbnailsClassName}`}>
                    {thumbnails.map((thumbnail, index) => (
                        <Image
                            key={index}
                            src={thumbnail.src}
                            height={thumbnail.height || 150}
                            width={thumbnail.width || 222}
                            alt={thumbnail.alt}
                            className={`xs:h-[76px] xs:w-[112px] ${thumbnailClassName}`}
                            style={{ 
                                height: `${thumbnail.height || 150}px`, 
                                width: `${thumbnail.width || 222}px` 
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ImageGallery;