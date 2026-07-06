'use client';
import PageHeader from '../components/PageHeader';
import { GearIcon } from '~/ui/icons';

export default function AdminSettings() {
    return (
        <div>
            <PageHeader
                title='Settings'
                description='Configure system settings and manage administrative preferences'
            />

            <div className='px-4 sm:px-6 lg:px-8'>
                <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-8'>
                    <div className='text-center'>
                        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <GearIcon className='w-8 h-8 text-gray-400' />
                        </div>
                        <h3 className='typo-heading_ss text-text_one mb-2'>Settings Coming Soon</h3>
                        <p className='typo-body_mr text-text_four max-w-md mx-auto'>
                            The settings page is currently under development. This will include system configuration,
                            user management, notification preferences, and other administrative settings.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
