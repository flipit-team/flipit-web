'use client';
import { useState } from 'react';

interface VerificationStepsProps {
    currentStep: number;
    totalSteps: number;
}

const VerificationSteps = ({ currentStep, totalSteps }: VerificationStepsProps) => {
    return (
        <div className='mb-6'>
            <p className='text-sm text-gray-600 mb-4'>
                Step {currentStep} of {totalSteps}
            </p>
            <div className='flex gap-2'>
                {Array.from({ length: totalSteps }, (_, index) => (
                    <div
                        key={index}
                        className={`h-2 flex-1 rounded-full ${
                            index < currentStep 
                                ? 'bg-primary' 
                                : 'bg-gray-200'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default VerificationSteps;