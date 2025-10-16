'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { NIGERIAN_LOCATIONS } from '~/data/nigerianLocations';

interface CategorySidebarProps {
    categories: Array<{ id?: number; name: string; description: string | null; subcategories?: string[]; }>;
    filters: {
        category: string;
        subCategory: string;
        stateCode: string;
        lgaCode: string;
        priceMin: string;
        priceMax: string;
        verifiedSellers: boolean;
        discount: boolean;
        sort: string;
        search?: string;
    };
    onFilterChange: (filters: any) => void;
    categoryName: string;
}

interface CustomDropdownProps {
    value: string;
    onChange: (value: string) => void;
    options: Array<{ value: string; label: string }>;
    placeholder: string;
    className?: string;
}

const CustomDropdown: React.FC<CustomDropdownProps> = ({
    value,
    onChange,
    options,
    placeholder,
    className = ''
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedOption = options.find(opt => opt.value === value);

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className='w-full h-[37px] px-3 border border-border_gray rounded-md text-left bg-white hover:border-gray-400 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-colors flex items-center justify-between typo-body_sr'
            >
                <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <Image
                    src='/arrow-down-gray.svg'
                    height={16}
                    width={16}
                    alt='dropdown'
                    className={`h-4 w-4 transform transition-transform ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {isOpen && (
                <>
                    <div className='fixed inset-0 z-40' onClick={() => setIsOpen(false)} />
                    <div className='absolute z-50 w-full mt-1 bg-white border border-border_gray rounded-md shadow-lg max-h-48 overflow-auto'>
                        <button
                            type="button"
                            onClick={() => {
                                onChange('');
                                setIsOpen(false);
                            }}
                            className={`w-full px-3 py-2 text-left hover:bg-gray-50 typo-body_sr transition-colors ${
                                !value ? 'text-primary bg-primary/5' : 'text-gray-500'
                            }`}
                        >
                            {placeholder}
                        </button>
                        {options.map((option) => (
                            <button
                                key={option.value}
                                type="button"
                                onClick={() => {
                                    onChange(option.value);
                                    setIsOpen(false);
                                }}
                                className={`w-full px-3 py-2 text-left hover:bg-gray-50 typo-body_sr transition-colors ${
                                    value === option.value ? 'text-primary bg-primary/5' : 'text-gray-900'
                                }`}
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

const CategorySidebar: React.FC<CategorySidebarProps> = ({
    categories,
    filters,
    onFilterChange,
    categoryName
}) => {
    // Local state to hold filter changes until Apply is clicked
    const [localFilters, setLocalFilters] = useState(filters);
    const [selectedState, setSelectedState] = useState('');
    const [selectedLGA, setSelectedLGA] = useState('');

    // Update local state when filters prop changes
    useEffect(() => {
        setLocalFilters(filters);
        setSelectedState(filters.stateCode || '');
        setSelectedLGA(filters.lgaCode || '');
    }, [filters]);

    // Reset subcategory when category changes
    useEffect(() => {
        const selectedCategoryObj = categories.find(cat => cat.name === localFilters.category);
        const availableSubcategories = selectedCategoryObj?.subcategories || [];

        if (localFilters.subCategory && !availableSubcategories.includes(localFilters.subCategory)) {
            handleLocalFilterUpdate('subCategory', '');
        }
    }, [localFilters.category, categories]);

    const handleLocalFilterUpdate = (key: string, value: any) => {
        setLocalFilters(prev => ({ ...prev, [key]: value }));
    };

    const handleLocationChange = (stateCode: string, lgaCode?: string) => {
        setSelectedState(stateCode);
        setSelectedLGA(lgaCode || '');
        setLocalFilters(prev => ({
            ...prev,
            stateCode: stateCode,
            lgaCode: lgaCode || ''
        }));
    };

    const resetFilters = () => {
        const resetFilters = {
            category: filters.category,
            subCategory: '',
            stateCode: '',
            lgaCode: '',
            priceMin: '',
            priceMax: '',
            verifiedSellers: false,
            discount: false,
            sort: 'recent',
            search: filters.search || ''
        };
        setLocalFilters(resetFilters);
        setSelectedState('');
        setSelectedLGA('');
        onFilterChange(resetFilters);
    };

    const applyFilters = () => {
        onFilterChange(localFilters);
    };

    // Convert categories to dropdown format
    const categoryOptions = categories.map(cat => ({
        value: cat.name,
        label: cat.name
    }));

    // Get subcategories based on selected category
    const selectedCategoryObj = categories.find(cat => cat.name === localFilters.category);
    const subCategoryOptions = selectedCategoryObj?.subcategories?.map((sub: string) => ({
        value: sub,
        label: sub
    })) || [];

    // Real Nigerian states from centralized location data
    const stateOptions = NIGERIAN_LOCATIONS.states.map(state => ({
        value: state.code,
        label: state.name
    }));

    // Get LGAs for selected state
    const selectedStateObj = NIGERIAN_LOCATIONS.states.find(state => state.code === selectedState);
    const lgaOptions = selectedStateObj ? selectedStateObj.lgas.map(lga => ({
        value: lga.code,
        label: lga.name
    })) : [];

    return (
        <div className='w-full flex flex-col pt-7 shadow-lg xs:hidden'>
            {/* Header - Same as home page Categories */}
            <div className='h-[58px] flex items-center justify-center gap-2 bg-surface-primary'>
                <Image
                    className='h-5 w-5 cursor-pointer'
                    src={'/shop.svg'}
                    alt='shop'
                    height={20}
                    width={20}
                />
                <p className='typo-body_mm text-primary'>{categoryName}</p>
            </div>

            {/* Category Filter */}
            <div className='px-[20px] py-[18px] border-b border-gray-100'>
                <h4 className='typo-body_lm font-semibold text-gray-900 mb-3'>Category</h4>
                <div className='space-y-3'>
                    <CustomDropdown
                        value={localFilters.category}
                        onChange={(value) => handleLocalFilterUpdate('category', value)}
                        options={categoryOptions}
                        placeholder="Select Category"
                    />
                    {localFilters.category && subCategoryOptions.length > 0 && (
                        <CustomDropdown
                            value={localFilters.subCategory}
                            onChange={(value) => handleLocalFilterUpdate('subCategory', value)}
                            options={subCategoryOptions}
                            placeholder="Select Subcategory (Optional)"
                        />
                    )}
                </div>
            </div>

            {/* Location Filter */}
            <div className='px-[20px] py-[18px] border-b border-gray-100'>
                <h4 className='typo-body_lm font-semibold text-gray-900 mb-3'>Location</h4>
                <div className='space-y-3'>
                    <CustomDropdown
                        value={selectedState}
                        onChange={(value) => {
                            handleLocationChange(value);
                        }}
                        options={stateOptions}
                        placeholder="Select State"
                    />
                    {selectedState && (
                        <CustomDropdown
                            value={selectedLGA}
                            onChange={(value) => handleLocationChange(selectedState, value)}
                            options={lgaOptions}
                            placeholder="Select LGA (Optional)"
                        />
                    )}
                </div>
            </div>

            {/* Price Range Filter */}
            <div className='px-[20px] py-[18px] border-b border-gray-100'>
                <h4 className='typo-body_lm font-semibold text-gray-900 mb-3'>Price Range</h4>
                <div className='flex gap-1'>
                    <input
                        type='number'
                        placeholder='0'
                        value={localFilters.priceMin}
                        onChange={(e) => handleLocalFilterUpdate('priceMin', e.target.value)}
                        min="0"
                        step="1000"
                        className='w-[90px] h-[37px] px-2 border border-border_gray rounded-md typo-body_sr focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs'
                    />
                    <span className='flex items-center px-1 text-gray-400 typo-body_sr'>-</span>
                    <input
                        type='number'
                        placeholder='999999'
                        value={localFilters.priceMax}
                        onChange={(e) => handleLocalFilterUpdate('priceMax', e.target.value)}
                        min="0"
                        step="1000"
                        className='w-[90px] h-[37px] px-2 border border-border_gray rounded-md typo-body_sr focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-xs'
                    />
                </div>
                <div className='text-xs text-gray-500 mt-1'>Amount in Naira (₦)</div>
            </div>

            {/* Verified Sellers Filter */}
            <div className='px-[20px] py-[18px] border-b border-gray-100'>
                <h4 className='typo-body_lm font-semibold text-gray-900 mb-3'>Verified Sellers</h4>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={localFilters.verifiedSellers}
                        onChange={(e) => handleLocalFilterUpdate('verifiedSellers', e.target.checked)}
                        className='w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0 checked:bg-primary checked:border-primary hover:border-primary accent-primary'
                        style={{ accentColor: 'var(--color-primary, #00A455)' }}
                    />
                    <span className='typo-body_sr text-gray-700'>Show only verified sellers</span>
                </label>
            </div>

            {/* Discount Filter */}
            <div className='px-[20px] py-[18px] border-b border-gray-100'>
                <h4 className='typo-body_lm font-semibold text-gray-900 mb-3'>Discount</h4>
                <label className='flex items-center gap-3 cursor-pointer'>
                    <input
                        type='checkbox'
                        checked={localFilters.discount}
                        onChange={(e) => handleLocalFilterUpdate('discount', e.target.checked)}
                        className='w-4 h-4 border-gray-300 rounded focus:ring-2 focus:ring-primary focus:ring-offset-0 checked:bg-primary checked:border-primary hover:border-primary accent-primary'
                        style={{ accentColor: 'var(--color-primary, #00A455)' }}
                    />
                    <span className='typo-body_sr text-gray-700'>Show only discounted items</span>
                </label>
            </div>

            {/* Action Buttons - Reduced top margin */}
            <div className='px-[20px] py-[18px]'>
                <div className='flex gap-3'>
                    <button
                        onClick={resetFilters}
                        className='flex-1 h-[37px] px-3 typo-body_sr text-gray-700 bg-white border border-border_gray rounded-md hover:bg-gray-50 transition-colors'
                    >
                        Reset
                    </button>
                    <button
                        onClick={applyFilters}
                        className='flex-1 h-[37px] px-3 typo-body_sr text-white bg-primary rounded-md hover:bg-primary-dark transition-colors'
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategorySidebar;