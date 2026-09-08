import Link from 'next/link';

export default function AuthError() {
    return (
        <div className='flex flex-col items-center justify-center h-screen gap-4'>
            <h1 className='typo-heading-xl-bold'>Google Sign-In Failed</h1>
            <p className='typo-body-md text-gray-500'>Something went wrong during Google authentication. Please try again.</p>
            <Link href='/login' className='text-primary underline typo-body-md-semibold'>
                Back to Login
            </Link>
        </div>
    );
}
