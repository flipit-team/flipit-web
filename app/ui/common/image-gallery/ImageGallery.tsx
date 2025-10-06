'use client';
import Image from 'next/image';
import React, { ReactNode, useState } from 'react';

interface ImageGalleryProps {
    images: string[];
    overlayElements?: ReactNode;
    className?: string;
    mainImageClassName?: string;
    thumbnailsClassName?: string;
    thumbnailClassName?: string;
}

const ImageGallery = ({
    images,
    overlayElements,
    className = '',
    mainImageClassName = '',
    thumbnailsClassName = '',
    thumbnailClassName = ''
}: ImageGalleryProps) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showFullscreen, setShowFullscreen] = useState(false);
    const [thumbnailStartIndex, setThumbnailStartIndex] = useState(0);
    
    // Fallback to placeholder if no images
    const imageList = images.length > 0 ? images : ['https://images.pexels.com/photos/1303084/pexels-photo-1303084.jpeg'];
    const currentImage = imageList[currentImageIndex];
    
    // Number of thumbnails to show at once
    const thumbnailsToShow = 3;
    const visibleThumbnails = imageList.slice(thumbnailStartIndex, thumbnailStartIndex + thumbnailsToShow);
    
    const goToPrevious = React.useCallback(() => {
        setCurrentImageIndex(prev => prev === 0 ? imageList.length - 1 : prev - 1);
    }, [imageList.length]);
    
    const goToNext = React.useCallback(() => {
        setCurrentImageIndex(prev => prev === imageList.length - 1 ? 0 : prev + 1);
    }, [imageList.length]);
    
    const goToPreviousThumbnails = React.useCallback(() => {
        setThumbnailStartIndex(prev => Math.max(0, prev - 1));
    }, []);
    
    const goToNextThumbnails = React.useCallback(() => {
        setThumbnailStartIndex(prev => 
            Math.min(imageList.length - thumbnailsToShow, prev + 1)
        );
    }, [imageList.length, thumbnailsToShow]);
    
    const selectImage = React.useCallback((index: number) => {
        const actualIndex = thumbnailStartIndex + index;
        setCurrentImageIndex(actualIndex);
    }, [thumbnailStartIndex]);
    
    const openFullscreen = React.useCallback(() => {
        setShowFullscreen(true);
    }, []);
    
    const closeFullscreen = React.useCallback(() => {
        setShowFullscreen(false);
    }, []);
    
    return (
        <>
            <div className={`${className}`}>
                <div className="flex flex-col">
                    {/* Main Image */}
                    <div className="relative mb-6">
                        <Image
                            src={currentImage}
                            height={443}
                            width={712}
                            alt="Main product image"
                            className={`cursor-pointer object-cover ${mainImageClassName}`}
                            style={{
                                width: '712px !important',
                                height: '443px !important',
                                maxWidth: 'none !important',
                                minWidth: '712px !important'
                            }}
                            onClick={openFullscreen}
                            priority
                            quality={75}
                        />
                        {overlayElements}
                    </div>
                    
                    {/* Thumbnail Navigation */}
                    {imageList.length > 1 && (
                        <div className={`relative ${thumbnailsClassName}`}>
                            <div className="flex items-center gap-2 w-full">
                                {/* Left Arrow */}
                                {thumbnailStartIndex > 0 && (
                                    <button
                                        onClick={goToPreviousThumbnails}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                        aria-label="Previous thumbnails"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                        </svg>
                                    </button>
                                )}
                                
                                {/* Thumbnails Container */}
                                <div className="flex-1 overflow-hidden">
                                    <div className="grid grid-cols-3 gap-6">
                                        {visibleThumbnails.map((image, index) => {
                                            const actualIndex = thumbnailStartIndex + index;
                                            const isActive = actualIndex === currentImageIndex;
                                            const handleImageClick = () => selectImage(index);
                                            return (
                                                <div key={actualIndex} className="w-full h-[150px] xs:h-[76px]">
                                                    <Image
                                                        src={image}
                                                        height={150}
                                                        width={222}
                                                        alt={`Thumbnail ${actualIndex + 1}`}
                                                        className={`w-full h-full object-cover cursor-pointer transition-all duration-200 ${
                                                            isActive ? 'ring-2 ring-primary opacity-100' : 'opacity-70 hover:opacity-100'
                                                        } ${thumbnailClassName}`}
                                                        onClick={handleImageClick}
                                                        sizes="222px"
                                                        loading="lazy"
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>
                                
                                {/* Right Arrow */}
                                {thumbnailStartIndex + thumbnailsToShow < imageList.length && (
                                    <button
                                        onClick={goToNextThumbnails}
                                        className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                                        aria-label="Next thumbnails"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Fullscreen Modal */}
            {showFullscreen && (
                <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
                    <div className="relative max-w-screen-lg max-h-screen p-4">
                        {/* Close Button */}
                        <button
                            onClick={closeFullscreen}
                            className="absolute top-4 right-4 z-60 w-10 h-10 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                            aria-label="Close fullscreen"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                        
                        {/* Navigation Arrows */}
                        {imageList.length > 1 && (
                            <>
                                <button
                                    onClick={goToPrevious}
                                    className="absolute left-4 top-1/2 transform -translate-y-1/2 z-60 w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                                    aria-label="Previous image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>
                                
                                <button
                                    onClick={goToNext}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 z-60 w-12 h-12 flex items-center justify-center bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full text-white transition-colors"
                                    aria-label="Next image"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </>
                        )}
                        
                        {/* Main Image */}
                        <Image
                            src={currentImage}
                            width={1200}
                            height={800}
                            alt={`Fullscreen image ${currentImageIndex + 1}`}
                            className="max-w-full max-h-full object-contain"
                            sizes="100vw"
                            placeholder="blur"
                            blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Kic6LbJ7djdjvj28J7vD94nSRnr/Z/9k="
                        />
                        
                        {/* Image Counter */}
                        {imageList.length > 1 && (
                            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-sm">
                                {currentImageIndex + 1} / {imageList.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};

export default ImageGallery;