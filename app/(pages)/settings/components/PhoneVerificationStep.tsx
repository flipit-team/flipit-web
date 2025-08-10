'use client';
import { useState, useRef } from 'react';
import { RefreshCcw } from 'lucide-react';
import Button from '~/ui/common/button';

interface PhoneVerificationStepProps {
    onComplete: () => void;
    onBack: () => void;
}

const PhoneVerificationStep = ({ onComplete, onBack }: PhoneVerificationStepProps) => {
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (!/^[0-9]?$/.test(value)) return;
        
        const newCode = [...code];
        newCode[index] = value;
        setCode(newCode);

        if (value && index < 5) {
            inputsRef.current[index + 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text').slice(0, 6);
        if (!/^[0-9]+$/.test(pasteData)) return;

        const newCode = pasteData.split('');
        const paddedCode = newCode.concat(Array(6 - newCode.length).fill(''));
        setCode(paddedCode);
        
        // Focus the last filled input or the first empty one
        const lastFilledIndex = Math.min(newCode.length - 1, 5);
        inputsRef.current[lastFilledIndex]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = () => {
        const fullCode = code.join('');
        if (fullCode.length === 6) {
            // Validate OTP here
            onComplete();
        }
    };

    const handleResendCode = () => {
        // Implement resend logic
        console.log('Resending code...');
    };

    const isCodeComplete = code.every(digit => digit !== '');

    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                <p className='text-gray-600 mb-6'>
                    Please enter the OTP sent to the phone number you provided to verify your phone number
                </p>
            </div>

            {/* OTP Input Fields */}
            <div className='flex justify-center gap-3 mb-8'>
                {code.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            if (el) inputsRef.current[index] = el;
                        }}
                        type='text'
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onPaste={handlePaste}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        maxLength={1}
                        className={`
                            w-14 h-14 text-center text-xl font-semibold border-2 rounded-lg 
                            focus:ring-2 focus:ring-primary focus:border-primary outline-none
                            transition-colors duration-200
                            ${digit ? 'border-primary bg-primary/5' : 'border-gray-300'}
                        `}
                    />
                ))}
            </div>

            {/* Action Buttons */}
            <div className='space-y-4'>
                <Button 
                    variant='primary' 
                    size='lg' 
                    onClick={handleSubmit}
                    disabled={!isCodeComplete}
                    className='w-full'
                >
                    Verify Account
                </Button>

                <div className='text-center'>
                    <button
                        onClick={handleResendCode}
                        className='flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm mx-auto'
                    >
                        <RefreshCcw size={16} />
                        Resend Code
                    </button>
                </div>

                <div className='text-center'>
                    <button
                        onClick={onBack}
                        className='text-primary hover:text-primary/80 transition-colors text-sm'
                    >
                        Back to Profile Verification
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PhoneVerificationStep;