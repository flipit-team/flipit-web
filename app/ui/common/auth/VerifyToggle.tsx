import Image from 'next/image';
import React from 'react';
interface Props {
    isVerify: boolean;
    setIsVerify: React.Dispatch<React.SetStateAction<boolean>>;
}
const VerifyToggle = (props: Props) => {
    const {isVerify, setIsVerify} = props;
    return (
        <div className='xs:hidden'>
            <Image src={'/back-dark.svg'} height={24} width={24} alt='back' className='h-6 w-6 my-[40px]' />
            <div className='flex items-center gap-[14px] typo-body_sm mb-[44px]'>
                <div
                    onClick={() => setIsVerify(true)}
                    className={`w-[220px] border-b-4 pb-1 ${isVerify ? 'text-primary border-primary' : 'text-text_four border-border-light'}`}
                >
                    1.Verify your Profile
                </div>
                <div
                    onClick={() => setIsVerify(false)}
                    className={`w-[220px] border-b-4 pb-1 ${!isVerify ? 'text-primary  border-primary' : 'text-text_four border-border-light'}`}
                >
                    2.Confirm your Phone number
                </div>
            </div>
        </div>
    );
};

export default VerifyToggle;
