'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    categories: {
        name: string;
        description: string | null;
    }[];
}

const MobileCategoriesModal: React.FC<Props> = ({ isOpen, onClose, categories }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentCategory = searchParams.get('categories');

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            // Small delay to ensure the modal is rendered before animating
            setTimeout(() => setIsAnimating(true), 10);
        } else {
            setIsAnimating(false);
            // Keep modal rendered during animation, remove after
            setTimeout(() => setIsVisible(false), 300);
        }
    }, [isOpen]);

    const selectCategory = (categoryName: string) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('categories', categoryName);
        router.push(`${pathname}?${params.toString()}`);
        onClose();
    };

    const clearFilter = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('categories');
        router.push(`${pathname}?${params.toString()}`);
        onClose();
    };

    if (!isVisible) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black z-40 transition-opacity duration-300 ease-out ${
                    isAnimating ? 'bg-opacity-50' : 'bg-opacity-0'
                }`}
                onClick={onClose}
            />

            {/* Modal */}
            <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[70vh] overflow-hidden transform transition-transform duration-300 ease-out ${
                isAnimating ? 'translate-y-0' : 'translate-y-full'
            }`}>
                <div className="p-4 border-b">
                    <div className="flex items-center justify-between">
                        <h2 className="typo-heading_sr">Categories</h2>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full"
                        >
                            ✕
                        </button>
                    </div>
                </div>

                <div
                    className="overflow-y-auto max-h-[60vh] [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                >
                    <div
                        onClick={clearFilter}
                        className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50 ${
                            !currentCategory ? 'bg-primary/10' : ''
                        }`}
                    >
                        <span className={`typo-body_mr ${!currentCategory ? 'text-primary font-semibold' : 'text-primary'}`}>
                            All Categories
                        </span>
                        {!currentCategory && <span className="text-primary">✓</span>}
                    </div>

                    {categories.map((category, index) => {
                        const isSelected = currentCategory === category.name;
                        return (
                            <div
                                key={index}
                                onClick={() => selectCategory(category.name)}
                                className={`flex items-center justify-between p-4 border-b cursor-pointer hover:bg-gray-50 ${
                                    isSelected ? 'bg-primary/10' : ''
                                }`}
                            >
                                <span className={`typo-body_mr capitalize ${
                                    isSelected ? 'text-primary font-semibold' : 'text-gray-700'
                                }`}>
                                    {category.name}
                                </span>
                                {isSelected && <span className="text-primary">✓</span>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default MobileCategoriesModal;