'use client';
import {useRouter} from 'next/navigation';

export default function MobileHeader() {
    const router = useRouter();
    return (
        <div className='hidden xs:flex items-center gap-3 mb-4'>
            <button onClick={() => router.back()} className='w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0'>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
            </button>
            <h1 className='font-poppins typo-heading-md-semibold text-text_one'>Performance</h1>
        </div>
    );
}
