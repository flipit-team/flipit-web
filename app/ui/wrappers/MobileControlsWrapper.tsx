'use client';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import MobileCategoriesModal from '../homepage/MobileCategoriesModal';

// Scroll-aware category pills with edge fade
function CategoryPills({ categories, selectedCategory, onSelect }: {
    categories: { name: string; description: string | null }[];
    selectedCategory: string | null;
    onSelect: (name: string) => void;
}) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [showLeftFade, setShowLeftFade] = useState(false);
    const [showRightFade, setShowRightFade] = useState(false);

    const checkScroll = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setShowLeftFade(el.scrollLeft > 4);
        setShowRightFade(el.scrollLeft < el.scrollWidth - el.clientWidth - 4);
    }, []);

    useEffect(() => {
        checkScroll();
        const el = scrollRef.current;
        if (el) el.addEventListener('scroll', checkScroll, { passive: true });
        return () => { if (el) el.removeEventListener('scroll', checkScroll); };
    }, [checkScroll, categories]);

    // Scroll active pill into center
    useEffect(() => {
        if (!selectedCategory || !scrollRef.current) return;
        const container = scrollRef.current;
        const activeBtn = container.querySelector('[data-active="true"]') as HTMLElement;
        if (activeBtn) {
            const scrollLeft = activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.offsetWidth / 2;
            container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
        }
    }, [selectedCategory]);

    return (
        <div className='relative -mx-4'>
            {showLeftFade && (
                <div className='absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#FFFFF0] to-transparent z-10 pointer-events-none' />
            )}
            {showRightFade && (
                <div className='absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#FFFFF0] to-transparent z-10 pointer-events-none' />
            )}
            <div ref={scrollRef} className='flex gap-2 overflow-x-auto no-scrollbar px-4'>
                {categories.map((cat) => (
                    <button
                        key={cat.name}
                        data-active={selectedCategory === cat.name ? 'true' : undefined}
                        onClick={() => onSelect(cat.name)}
                        className={`flex-shrink-0 px-4 py-2 rounded-full font-poppins typo-body-sm-medium transition-colors ${
                            selectedCategory === cat.name
                                ? 'bg-[#025F73] text-white'
                                : 'bg-gray-100 text-text_one'
                        }`}
                    >
                        {cat.name.replace('Electronics & ', '')}
                    </button>
                ))}
            </div>
        </div>
    );
}

interface Props {
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    onSortChange?: (sortValue: string) => void;
    currentSort?: string;
}

const MobileControlsWrapper: React.FC<Props> = ({ defaultCategories }) => {
    const [showMobileCategoriesModal, setShowMobileCategoriesModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Update selected category when URL params change
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        setSelectedCategory(categoryParam);
    }, [searchParams]);

    const toggleMobileCategoriesModal = () => {
        setShowMobileCategoriesModal(!showMobileCategoriesModal);
    };

    return (
        <>
            {/* Mobile Category Section */}
            <div className='hidden xs:block mt-5 mb-4'>
                {/* Category heading + See All */}
                <div className='flex items-center justify-between mb-3'>
                    <h2 className='font-poppins typo-body-lg-bold text-text_one'>Category</h2>
                    <button
                        onClick={toggleMobileCategoriesModal}
                        className='font-poppins typo-body-sm-medium text-primary'
                    >
                        See All
                    </button>
                </div>

                {/* Horizontal scrollable category pills with edge fade */}
                <CategoryPills
                    categories={defaultCategories.slice(0, 8)}
                    selectedCategory={selectedCategory}
                    onSelect={(catName) => {
                        const params = new URLSearchParams(searchParams.toString());
                        if (selectedCategory === catName) {
                            params.delete('category');
                            setSelectedCategory(null);
                        } else {
                            params.set('category', catName);
                            setSelectedCategory(catName);
                        }
                        const qs = params.toString();
                        router.replace(`${pathname}${qs ? '?' + qs : ''}`, { scroll: false });
                    }}
                />
            </div>

            {/* Mobile Categories Modal (opened by "See All") */}
            <MobileCategoriesModal
                isOpen={showMobileCategoriesModal}
                onClose={() => setShowMobileCategoriesModal(false)}
                categories={defaultCategories}
            />
        </>
    );
};

export default MobileControlsWrapper;