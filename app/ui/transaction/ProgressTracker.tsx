'use client';
import React from 'react';
import {CheckmarkIcon} from '../icons';

interface Step {
    label: string;
    sublabel?: string;
}

interface Props {
    steps: Step[];
    currentStep: number;
    status?: 'active' | 'completed' | 'cancelled';
}

const ProgressTracker: React.FC<Props> = ({steps, currentStep, status = 'active'}) => {
    const getStepStatus = (index: number) => {
        if (status === 'cancelled') return index <= currentStep ? 'cancelled' : 'pending';
        if (status === 'completed' && index === steps.length - 1) return 'completed';
        if (index < currentStep) return 'completed';
        if (index === currentStep) return 'current';
        return 'pending';
    };

    return (
        <div className='border border-border-DEFAULT rounded-xl p-6 xs:border-0 xs:p-0 xs:rounded-none'>
            {/* Desktop: horizontal layout */}
            <div className='flex items-start justify-between xs:hidden'>
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isCurrent = stepStatus === 'current';
                    const isCompleted = stepStatus === 'completed';

                    return (
                        <div key={index} className='flex flex-col items-center flex-1'>
                            {/* Numbered circle */}
                            <div
                                className={`w-[36px] h-[36px] rounded-full flex items-center justify-center typo-body-md-semibold ${
                                    isCurrent
                                        ? 'bg-primary text-white'
                                        : isCompleted
                                          ? 'bg-primary text-white'
                                          : 'border-2 border-border-muted-alt text-text-muted-alt'
                                }`}
                            >
                                {isCompleted ? (
                                    <CheckmarkIcon className='w-4 h-4' />
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Label */}
                            <p className={`mt-2 typo-body-xs-regular text-center ${
                                isCurrent || isCompleted ? 'text-text_one font-semibold' : 'text-text-muted-alt'
                            }`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>

            {/* Mobile: absolute progress bar layout */}
            <div className='hidden xs:block relative px-5 py-4'>
                {/* Base track — full height, light teal */}
                <div
                    className='absolute w-2 rounded-xl bg-surface-teal'
                    style={{left: '31px', top: '31px', bottom: '31px'}}
                />
                {/* Active track — from step 0 center through bottom of currentStep circle */}
                {currentStep > 0 && status !== 'cancelled' && (
                    <div
                        className='absolute w-2 bg-primary rounded-t-xl'
                        style={{
                            left: '31px',
                            top: '31px',
                            height: `${Math.min(currentStep, steps.length - 1) * 70 + 15}px`,
                        }}
                    />
                )}
                <div className='flex flex-col gap-10'>
                    {steps.map((step, index) => {
                        const stepStatus = getStepStatus(index);
                        const isCurrent = stepStatus === 'current';
                        const isCompleted = stepStatus === 'completed';

                        return (
                            <div key={index} className='flex items-center gap-3 relative z-10'>
                                <div
                                    className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[14px] font-bold flex-shrink-0 ${
                                        isCurrent || isCompleted
                                            ? 'bg-primary text-white'
                                            : 'bg-white border-2 border-primary text-text-muted-alt'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckmarkIcon className='w-3.5 h-3.5' />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <p className={`font-poppins text-[14px] font-medium capitalize ${
                                    isCurrent || isCompleted ? 'text-text_one' : 'text-text-muted-alt'
                                }`}>
                                    {step.label}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ProgressTracker;
