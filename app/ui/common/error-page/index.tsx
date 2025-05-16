import Image from 'next/image';
import React from 'react';

const Index = () => {
    return (
        <div className='flex flex-col m-auto h-full justify-center'>
            <div
                className='flex lg:flex-row md:flex-row xs:flex-col justify-center items-center lg:mt-[100px]
            lg:mb-[100px] xs:mt-[24px] xs:mb-[32px] md:mt-[40px] md:mb-[40px] lg:gap-[58px] md:gap-[25px] xs:gap-[32px]'
            >
                <Image
                    src='/500.svg'
                    alt='500'
                    height={314}
                    width={350}
                    className='xs:h-[201px] xs:w-[264px] lg:h-[314px] lg:w-[350px] md:w-[247px] md:h-[221px]'
                />
                <div className=''>
                    <p className='typo-heading_lb xs:typo-heading_mb xs:text-center'>Server Error</p>
                    <p className='lg:typo-body_lr md:typo-body_mr xs:typo-body_sr text-[#B6B9C8] pt-2 xs:text-center pb-2'>
                        Something went technically wrong.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Index;
