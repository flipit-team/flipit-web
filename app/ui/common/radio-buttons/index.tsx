'use client';
import React, {useState} from 'react';

interface Props {
    title: string;
    titleOne: string;
    titleTwo: string;
    nameOne: string;
    nameTwo: string;
}

const RadioButtons = (props: Props) => {
    const {title, titleOne, titleTwo, nameOne, nameTwo} = props;
    const [selected, setSelected] = useState(nameOne);

    return (
        <div>
            <p className='typo-body_medium_regular mb-[18px]'>{title}</p>
            <div className='flex space-x-6'>
                {/* Radio Button 1 */}
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
                    <span className='typo-body_medium_regular'>{titleOne}</span>
                </label>

                {/* Radio Button 2 */}
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
                    <span className='typo-body_medium_regular'>{titleTwo}</span>
                </label>
            </div>
        </div>
    );
};

export default RadioButtons;
