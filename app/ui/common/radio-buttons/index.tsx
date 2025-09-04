'use client';
import React, {useState} from 'react';

interface Props {
    title: string;
    titleOne?: string;
    titleTwo?: string;
    titleThree?: string;
    nameOne?: string;
    nameTwo?: string;
    nameThree?: string;
    col?: boolean;
    required?: boolean;
    setSelected: React.Dispatch<React.SetStateAction<string>>;
    selected: string;
}

const RadioButtons = (props: Props) => {
    const {title, titleOne, titleTwo, titleThree, nameThree, nameOne, nameTwo, col, required, selected, setSelected} = props;

    return (
        <div>
            <p className='typo-body_mr mb-[18px]'>{title}{required && <span className="text-error ml-1">*</span>}</p>
            <div className={`flex ${col ? 'flex-col space-y-4' : 'flex-row space-x-6'}`}>
                {/* Radio Button 1 */}
                {nameOne && (
                    <label className='flex items-center space-x-2 cursor-pointer'>
                        <input
                            type='radio'
                            name='toggle'
                            value={nameOne}
                            checked={selected === nameOne}
                            onChange={() => setSelected(nameOne)}
                            className='hidden'
                        />
                        <div
                            className={`w-6 h-6 flex items-center justify-center border-8 rounded-full transition ${
                                selected === nameOne ? 'border-primary' : 'border-gray-400'
                            }`}
                        >
                            {selected === nameOne && <div className='w-2 h-2 bg-white rounded-full'></div>}
                        </div>
                        <span className='typo-body_mr'>{titleOne}</span>
                    </label>
                )}

                {/* Radio Button 2 */}
                {nameTwo && (
                    <label className='flex items-center space-x-2 cursor-pointer'>
                        <input
                            type='radio'
                            name='toggle'
                            value={nameTwo}
                            checked={selected === nameTwo}
                            onChange={() => setSelected(nameTwo)}
                            className='hidden'
                        />
                        <div
                            className={`w-6 h-6 flex items-center justify-center border-8 rounded-full transition ${
                                selected === nameTwo ? 'border-primary' : 'border-gray-400'
                            }`}
                        >
                            {selected === nameTwo && <div className='w-2 h-2 bg-white rounded-full'></div>}
                        </div>
                        <span className='typo-body_mr'>{titleTwo}</span>
                    </label>
                )}
                {/* Radio Button 2 */}
                {nameThree && (
                    <label className='flex items-center space-x-2 cursor-pointer'>
                        <input
                            type='radio'
                            name='toggle'
                            value={nameThree}
                            checked={selected === nameThree}
                            onChange={() => setSelected(nameThree)}
                            className='hidden'
                        />
                        <div
                            className={`w-6 h-6 flex items-center justify-center border-8 rounded-full transition ${
                                selected === nameThree ? 'border-primary' : 'border-gray-400'
                            }`}
                        >
                            {selected === nameThree && <div className='w-2 h-2 bg-white rounded-full'></div>}
                        </div>
                        <span className='typo-body_mr'>{titleThree}</span>
                    </label>
                )}
            </div>
        </div>
    );
};

export default RadioButtons;
