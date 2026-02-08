'use client';
import { useState } from 'react';
import VerificationSteps from './VerificationSteps';
import ProfileVerificationStep from './ProfileVerificationStep';
import PhoneVerificationStep from './PhoneVerificationStep';
import EmailVerificationStep from './EmailVerificationStep';

const VerificationContent = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const totalSteps = 3;

    const handleNextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePreviousStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleComplete = () => {
        // Handle completion
        // You might want to redirect or show success message
    };

    const getStepTitle = () => {
        switch (currentStep) {
            case 1:
                return 'Verify Your Profile';
            case 2:
                return 'Verify Your Phone Number';
            case 3:
                return 'Verify Your Email';
            default:
                return 'Verification';
        }
    };

    const getStepSubtitle = () => {
        switch (currentStep) {
            case 1:
                return 'Secure your account and gain trust in the community';
            case 2:
                return 'Complete your verification by confirming your phone number';
            case 3:
                return 'Verify your email address to complete the verification process';
            default:
                return '';
        }
    };

    return (
        <div className='max-w-2xl'>
            {/* Steps Indicator */}
            <VerificationSteps currentStep={currentStep} totalSteps={totalSteps} />

            {/* Step Title */}
            <h1 className='typo-heading-xl-bold text-primary mb-2'>
                {getStepTitle()}
            </h1>

            {/* Step Subtitle */}
            <p className='typo-body-lg-regular text-text_one mb-8'>
                {getStepSubtitle()}
            </p>

            {/* Step Content */}
            <div>
                {currentStep === 1 && (
                    <ProfileVerificationStep onNext={handleNextStep} />
                )}
                {currentStep === 2 && (
                    <PhoneVerificationStep
                        onComplete={handleNextStep}
                        onBack={handlePreviousStep}
                    />
                )}
                {currentStep === 3 && (
                    <EmailVerificationStep
                        onComplete={handleComplete}
                        onBack={handlePreviousStep}
                    />
                )}
            </div>
        </div>
    );
};

export default VerificationContent;
