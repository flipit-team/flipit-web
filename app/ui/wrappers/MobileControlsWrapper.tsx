'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MobileCategoriesModal from '../homepage/MobileCategoriesModal';
import SortDropdown from '../common/sort-dropdown/SortDropdown';

interface Props {
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    onSortChange?: (sortValue: string) => void;
    currentSort?: string;
}

const MobileControlsWrapper: React.FC<Props> = ({ defaultCategories, onSortChange, currentSort = 'recent' }) => {
    const [showMobileCategoriesModal, setShowMobileCategoriesModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const searchParams = useSearchParams();

    const sortOptions = [
        {value: 'recent', label: 'Recent'},
        {value: 'popular', label: 'Popular'},
        {value: 'a-z', label: 'A-Z (ascending)'},
        {value: 'z-a', label: 'Z-A (descending)'},
        {value: 'low-high', label: 'Price: Low to High'},
        {value: 'high-low', label: 'Price: High to Low'}
    ];

    // Update selected category when URL params change
    useEffect(() => {
        const categoryParam = searchParams.get('categories');
        setSelectedCategory(categoryParam);
    }, [searchParams]);

    const handleSortSelect = (option: {value: string; label: string}) => {
        onSortChange?.(option.value);
    };

    const toggleMobileCategoriesModal = () => {
        setShowMobileCategoriesModal(!showMobileCategoriesModal);
    };

    // Get display text for the category button
    const getCategoryDisplayText = () => {
        if (selectedCategory) {
            // Find the category in defaultCategories to get proper formatting
            const category = defaultCategories.find(cat => cat.name === selectedCategory);
            return category ? category.name : selectedCategory;
        }
        return 'Categories';
    };

    return (
        <>
            <div className='hidden mt-5 mb-5 xs:flex items-center justify-between'>
                <div
                    onClick={toggleMobileCategoriesModal}
                    className={`flex items-center justify-center typo-body_ls w-max px-[10px] rounded-lg h-[36px] cursor-pointer transition-colors ${
                        selectedCategory
                            ? 'bg-primary text-white hover:bg-primary/90'
                            : 'bg-surface-primary-16 text-text_one hover:bg-surface-primary-32'
                    }`}
                >
                    <span className="truncate max-w-[120px]">{getCategoryDisplayText()}</span>
                    {selectedCategory && (
                        <span className="ml-2 text-xs opacity-75">✕</span>
                    )}
                </div>
                <div className='xs:flex hidden'>
                    <SortDropdown
                        options={sortOptions}
                        defaultSelection={sortOptions.find(opt => opt.value === currentSort)?.label || "Recent"}
                        onSelectionChange={handleSortSelect}
                    />
                </div>
            </div>

            {/* Mobile Categories Modal */}
            <MobileCategoriesModal
                isOpen={showMobileCategoriesModal}
                onClose={() => setShowMobileCategoriesModal(false)}
                categories={defaultCategories}
            />
        </>
    );
};

export default MobileControlsWrapper;