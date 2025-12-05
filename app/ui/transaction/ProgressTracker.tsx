'use client';
import React from 'react';

interface Step {
    label: string;
    sublabel?: string;
    icon?: React.ReactNode;
}

interface Props {
    steps: Step[];
    currentStep: number;
    status?: 'active' | 'completed' | 'cancelled';
}

const ProgressTracker: React.FC<Props> = ({steps, currentStep, status = 'active'}) => {
    const getStepStatus = (index: number) => {
        if (status === 'cancelled') {
            return index <= currentStep ? 'cancelled' : 'pending';
        }
        if (status === 'completed' && index === steps.length - 1) {
            return 'completed';
        }
        if (index < currentStep) return 'completed';
        if (index === currentStep) return 'current';
        return 'pending';
    };

    return (
        <div className='w-full py-6'>
            {/* Desktop Progress Bar */}
            <div className='hidden md:block'>
                <div className='flex items-center justify-between relative'>
                    {/* Progress Line */}
                    <div className='absolute top-5 left-0 right-0 h-[2px] bg-gray-200 -z-10'></div>
                    <div
                        className='absolute top-5 left-0 h-[2px] bg-primary -z-10 transition-all duration-500'
                        style={{
                            width: `${((currentStep) / (steps.length - 1)) * 100}%`
                        }}
                    ></div>

                    {/* Steps */}
                    {steps.map((step, index) => {
                        const stepStatus = getStepStatus(index);
                        const isCompleted = stepStatus === 'completed';
                        const isCurrent = stepStatus === 'current';
                        const isCancelled = stepStatus === 'cancelled';

                        return (
                            <div key={index} className='flex flex-col items-center relative' style={{flex: 1}}>
                                {/* Circle */}
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center relative z-10 transition-all duration-300 ${
                                        isCompleted
                                            ? 'bg-primary text-white shadow-md'
                                            : isCurrent
                                              ? 'bg-white border-4 border-primary shadow-lg scale-110'
                                              : isCancelled
                                                ? 'bg-surface-error border-2 border-error/30'
                                                : 'bg-white border-2 border-gray-300'
                                    }`}
                                >
                                    {isCompleted ? (
                                        <svg className='w-5 h-5' fill='currentColor' viewBox='0 0 20 20'>
                                            <path
                                                fillRule='evenodd'
                                                d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                clipRule='evenodd'
                                            />
                                        </svg>
                                    ) : isCurrent ? (
                                        <div className='w-3 h-3 rounded-full bg-primary animate-pulse'></div>
                                    ) : (
                                        <span className='text-sm text-gray-400 font-medium'>{index + 1}</span>
                                    )}
                                </div>

                                {/* Label */}
                                <div className='mt-3 text-center max-w-[120px]'>
                                    <p
                                        className={`typo-body_sr font-medium ${
                                            isCompleted || isCurrent
                                                ? 'text-text_one'
                                                : isCancelled
                                                  ? 'text-error'
                                                  : 'text-text_four'
                                        }`}
                                    >
                                        {step.label}
                                    </p>
                                    {step.sublabel && (
                                        <p className='typo-body_xs text-text_four mt-1'>{step.sublabel}</p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Mobile Progress Bar */}
            <div className='block md:hidden space-y-3'>
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isCompleted = stepStatus === 'completed';
                    const isCurrent = stepStatus === 'current';
                    const isCancelled = stepStatus === 'cancelled';

                    return (
                        <div key={index} className='flex items-center gap-3'>
                            {/* Circle */}
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                    isCompleted
                                        ? 'bg-primary text-white'
                                        : isCurrent
                                          ? 'bg-white border-3 border-primary'
                                          : isCancelled
                                            ? 'bg-surface-error border-2 border-error/30'
                                            : 'bg-gray-100 border-2 border-gray-300'
                                }`}
                            >
                                {isCompleted ? (
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                        <path
                                            fillRule='evenodd'
                                            d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                            clipRule='evenodd'
                                        />
                                    </svg>
                                ) : isCurrent ? (
                                    <div className='w-2 h-2 rounded-full bg-primary animate-pulse'></div>
                                ) : (
                                    <span className='text-xs text-gray-400'>{index + 1}</span>
                                )}
                            </div>

                            {/* Label */}
                            <div className='flex-1'>
                                <p
                                    className={`typo-body_mr font-medium ${
                                        isCompleted || isCurrent
                                            ? 'text-text_one'
                                            : isCancelled
                                              ? 'text-error'
                                              : 'text-text_four'
                                    }`}
                                >
                                    {step.label}
                                </p>
                                {step.sublabel && (
                                    <p className='typo-body_sr text-text_four'>{step.sublabel}</p>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressTracker;
