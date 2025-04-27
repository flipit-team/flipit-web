'use client';
import React, {Suspense, useEffect, useState} from 'react';
import InputBox from '../common/input-box';
import SelectBox from '../common/select-box';
import RadioButtons from '../common/radio-buttons';
import ImageUpload from '../common/image-upload';
import RegularButton from '../common/buttons/RegularButton';
import NormalSelectBox from '../common/normal-select-box';
import {useRouter} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';

const Form = () => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('');
    const [cash, setCash] = useState('');
    const {userId, defaultCategories} = useAppContext();
    const [urls, setUrls] = useState<string[]>([]);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setError('');
        if (type === 'title') {
            setTitle(e.target.value);
        }
        if (type === 'price') {
            setPrice(Number(e.target.value));
        }
    };

    const handleSubmit = async () => {
        // setLoading(true);
        setError(null);
        setSuccess(false);

        const payload = {
            title: title,
            description: 'This is a sample item description.',
            imageUrls: urls,
            flipForImgUrls: ['https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg'],
            acceptCash: cash === 'yes' ? true : false,
            cashAmount: price,
            sellerId: userId ?? 1,
            itemCategories: categories.split(','),
            condition: condition === 'brand-new' ? 'NEW' : 'USED_FAIR'
        };
        console.log(payload);

        try {
            const res = await fetch('/api/items/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }

            setSuccess(true);
            router.replace('/home');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form className='w-full flex flex-col gap-6'>
            <InputBox label='Name' name='title' placeholder='Enter item name' type='text' setValue={handleInput} />
            <NormalSelectBox
                selectedOption={categories}
                setSelectedOption={setCategories}
                options={defaultCategories}
            />
            <InputBox label='Price' name='price' placeholder='Set item price' type='text' setValue={handleInput} />
            <RadioButtons
                nameOne='brand-new'
                nameTwo='fairly-used'
                title='Condition of item'
                titleOne='Brand new'
                titleTwo='Fairly used'
                selected={condition}
                setSelected={setCondition}
            />
            <RadioButtons
                nameOne='yes'
                nameTwo='no'
                title='Do you accept cash?'
                titleOne='Yes'
                titleTwo='No'
                selected={cash}
                setSelected={setCash}
            />
            <div className='typo-body_medium_regular'>
                <p>Add photo</p>
                <p className='mb-3'>Upload at least 3 photos</p>
                <ImageUpload setUrls={setUrls} />
            </div>
            <Suspense fallback={<div>Loading...</div>}>
                <RegularButton text='Post Item' action={handleSubmit} isLoading={loading} />
            </Suspense>
        </form>
    );
};

export default Form;
