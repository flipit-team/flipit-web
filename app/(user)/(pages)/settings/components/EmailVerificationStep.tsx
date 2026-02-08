'use client';
import { useState, useRef } from 'react';
import { RefreshCcw, Mail } from 'lucide-react';
import Button from '~/ui/common/button';
import UserService from '~/services/user.service';
import { useAppContext } from '~/contexts/AppContext';

interface EmailVerificationStepProps {
    onComplete: () => void;
    onBack: () => void;
}

const EmailVerificationStep = ({ onComplete, onBack }: EmailVerificationStepProps) => {
    const [code, setCode] = useState<string[]>(Array(6).fill(''));
    const [isVerifying, setIsVerifying] = useState(false);
    const [isSendingCode, setIsSendingCode] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [codeSent, setCodeSent] = useState(false);
    const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
    const { user, profile } = useAppContext();

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

        const lastFilledIndex = Math.min(newCode.length - 1, 5);
        inputsRef.current[lastFilledIndex]?.focus();
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !code[index] && index > 0) {
            inputsRef.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async () => {
        const fullCode = code.join('');
        if (fullCode.length !== 6 || !user?.userId) return;

        setIsVerifying(true);
        setError(null);

        try {
            const result = await UserService.verifyEmail(parseInt(user.userId), fullCode);

            if (result.data) {
                onComplete();
            } else if (result.error) {
                setError(result.error.message || 'Verification failed. Please try again.');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleSendCode = async () => {
        if (!user?.userId) {
            setError('User not found');
            return;
        }

        setIsSendingCode(true);
        setError(null);

        try {
            // TODO: Add send verification code API endpoint when available
            // For now, just simulate sending
            await new Promise(resolve => setTimeout(resolve, 1000));
            setCodeSent(true);
            setCode(Array(6).fill(''));
        } catch (err) {
            setError('Failed to send verification code');
        } finally {
            setIsSendingCode(false);
        }
    };

    const isCodeComplete = code.every(digit => digit !== '');

    return (
        <div className='space-y-6'>
            <div className='text-center mb-8'>
                {!codeSent ? (
                    <>
                        <div className='w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4'>
                            <Mail className='w-8 h-8 text-primary' />
                        </div>
                        <p className='text-gray-600 mb-6'>
                            Click the button below to send a verification code to your email address{' '}
                            <span className='font-semibold text-text_one'>{profile?.email}</span>
                        </p>
                        <Button
                            variant='primary'
                            size='lg'
                            onClick={handleSendCode}
                            disabled={isSendingCode}
                            className='w-full'
                        >
                            {isSendingCode ? 'Sending...' : 'Send Verification Code'}
                        </Button>
                    </>
                ) : (
                    <>
                        <p className='text-gray-600 mb-6'>
                            Please enter the OTP sent to your email address to verify your account
                        </p>

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
                                    disabled={isVerifying}
                                    className={`
                                        w-14 h-14 text-center typo-heading-md-semibold border-2 rounded-lg
                                        focus:ring-2 focus:ring-primary focus:border-primary outline-none
                                        transition-colors duration-200
                                        ${digit ? 'border-primary bg-primary/5' : 'border-gray-300'}
                                        ${isVerifying ? 'opacity-50 cursor-not-allowed' : ''}
                                    `}
                                />
                            ))}
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className='mb-4 p-3 bg-surface-error border border-error rounded-lg text-error text-sm'>
                                {error}
                            </div>
                        )}

                        {/* Action Buttons */}
                        <div className='space-y-4'>
                            <Button
                                variant='primary'
                                size='lg'
                                onClick={handleSubmit}
                                disabled={!isCodeComplete || isVerifying}
                                className='w-full'
                            >
                                {isVerifying ? 'Verifying...' : 'Verify Email'}
                            </Button>

                            <div className='text-center'>
                                <button
                                    onClick={handleSendCode}
                                    disabled={isSendingCode}
                                    className='flex items-center justify-center gap-2 text-gray-600 hover:text-primary transition-colors text-sm mx-auto disabled:opacity-50'
                                >
                                    <RefreshCcw size={16} />
                                    {isSendingCode ? 'Sending...' : 'Resend Code'}
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {codeSent && (
                <div className='text-center'>
                    <button
                        onClick={onBack}
                        className='text-primary hover:text-primary/80 transition-colors text-sm'
                    >
                        Back to Phone Verification
                    </button>
                </div>
            )}
        </div>
    );
};

export default EmailVerificationStep;
