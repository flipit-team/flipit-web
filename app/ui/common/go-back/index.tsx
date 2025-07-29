'use client';
import {ChevronLeft} from 'lucide-react';
import {useRouter} from 'next/navigation';

const GoBack = () => {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            className='flex items-center gap-2 text-primary mb-8 transition-colors duration-200'
        >
            <ChevronLeft className='w-5 h-5' />
            <span className='text-sm font-medium'>Go back</span>
        </button>
    );
};

export default GoBack;
