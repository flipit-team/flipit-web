'use client';
import React from 'react';

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
        <div className='border border-[#E8E8E8] rounded-xl p-6 xs:p-4'>
            <div className='flex items-start justify-between xs:gap-2'>
                {steps.map((step, index) => {
                    const stepStatus = getStepStatus(index);
                    const isCurrent = stepStatus === 'current';
                    const isCompleted = stepStatus === 'completed';

                    return (
                        <div key={index} className='flex flex-col items-center flex-1'>
                            {/* Numbered circle */}
                            <div
                                className={`w-[36px] h-[36px] xs:w-[28px] xs:h-[28px] rounded-full flex items-center justify-center font-poppins font-semibold text-[14px] xs:text-[12px] ${
                                    isCurrent
                                        ? 'bg-primary text-white'
                                        : isCompleted
                                          ? 'bg-primary text-white'
                                          : 'border-2 border-[#A49E9E] text-[#A49E9E]'
                                }`}
                            >
                                {isCompleted ? (
                                    <svg className='w-4 h-4' fill='currentColor' viewBox='0 0 20 20'>
                                        <path fillRule='evenodd' d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z' clipRule='evenodd' />
                                    </svg>
                                ) : (
                                    index + 1
                                )}
                            </div>

                            {/* Label */}
                            <p className={`mt-2 font-poppins text-[13px] xs:text-[11px] text-center ${
                                isCurrent || isCompleted ? 'text-text_one font-semibold' : 'text-[#A49E9E]'
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
