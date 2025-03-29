import React from 'react';
import RegularButton from '~/ui/common/buttons/RegularButton';
import ImageUpload from '~/ui/common/image-upload';
import InputBox from '~/ui/common/input-box';
import RadioButtons from '~/ui/common/radio-buttons';
import SelectBox from '~/ui/common/select-box';

const page = () => {
    return (
        <div className='w-full h-full'>
            <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-[0px_4px_10px_rgba(0,0,0,0.2)] px-[30px]'>
                <h1 className='typo-heading_medium_semibold xs:hidden'>Post an Item</h1>
                <form className='w-full flex flex-col gap-6'>
                    <InputBox label='Name' name='' placeholder='Enter item name' type='text' />
                    <SelectBox />
                    <InputBox label='Price' name='' placeholder='Set item price' type='text' />
                    <RadioButtons
                        nameOne='brand-new'
                        nameTwo='fairly-used'
                        title='Condition of item'
                        titleOne='Brand new'
                        titleTwo='Fairly used'
                    />
                    <RadioButtons nameOne='yes' nameTwo='no' title='Do you accept cash?' titleOne='Yes' titleTwo='No' />
                    <div className='typo-body_medium_regular'>
                        <p>Add photo</p>
                        <p className='mb-3'>Upload at least 3 photos</p>
                        <ImageUpload />
                    </div>
                    <RegularButton text='Post Item' />
                </form>
            </div>
        </div>
    );
};

export default page;
