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
        <div className='border border-border-DEFAULT rounded-xl p-6 xs:p-4'>
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

            {/* Mobile: vertical stepper layout */}
            <div className='hidden xs:flex flex-col'>
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isCurrent = stepStatus === 'current';
                    const isCompleted = stepStatus === 'completed';
                    const isLast = index === steps.length - 1;

                    return (
                        <div key={index} className='flex items-start gap-3'>
                            {/* Circle + connecting line column */}
                            <div className='flex flex-col items-center'>
                                <div
                                    className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[13px] font-semibold flex-shrink-0 ${
                                        isCurrent
                                            ? 'bg-primary text-white'
                                            : isCompleted
                                              ? 'bg-primary text-white'
                                              : 'border-2 border-border-muted-alt text-text-muted-alt'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <CheckmarkIcon className='w-3.5 h-3.5' />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                {/* Vertical connecting line */}
                                {!isLast && (
                                    <div className={`w-[2px] h-6 my-1 ${
                                        isCompleted ? 'bg-primary' : 'bg-border-muted-alt'
                                    }`} />
                                )}
                            </div>

                            {/* Label */}
                            <p className={`pt-1.5 typo-body-sm-regular ${
                                isCurrent || isCompleted ? 'text-text_one font-semibold' : 'text-text-muted-alt'
                            }`}>
                                {step.label}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressTracker;
