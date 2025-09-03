'use client';
import { useSearchParams } from 'next/navigation';
import VerificationContent from './VerificationContent';
import PersonalDetailsContent from './PersonalDetailsContent';
import ChangePasswordContent from './ChangePasswordContent';
import ManageNotificationsContent from './ManageNotificationsContent';
import ChangeLanguageContent from './ChangeLanguageContent';
import DeleteAccountContent from './DeleteAccountContent';

const SettingsContent = () => {
    const searchParams = useSearchParams();
    const activeSection = searchParams.get('section') || 'verification';

    const renderContent = () => {
        switch (activeSection) {
            case 'personal-details':
                return <PersonalDetailsContent />;
            case 'change-password':
                return <ChangePasswordContent />;
            case 'manage-notifications':
                return <ManageNotificationsContent />;
            case 'change-language':
                return <ChangeLanguageContent />;
            case 'delete-account':
                return <DeleteAccountContent />;
            case 'verification':
            default:
                return (
                    <div>
                        <h2 className='typo-heading-md-medium md:typo-heading-md-medium text-gray-900 mb-4'>Verification</h2>
                        <div className='h-px bg-border_gray mb-6 md:mb-8 w-full'></div>
                        <VerificationContent />
                    </div>
                );
        }
    };

    return (
        <div className='flex-1 bg-white rounded-lg shadow p-4 md:p-6'>
            <div className='max-w-4xl'>
                {renderContent()}
            </div>
        </div>
    );
};

export default SettingsContent;