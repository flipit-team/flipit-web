'use client';
import React, {Suspense, useEffect, useState} from 'react';
import InputBox from '../common/input-box';
import RadioButtons from '../common/radio-buttons';
import ImageUpload from '../common/image-upload';
import RegularButton from '../common/buttons/RegularButton';
import NormalSelectBox from '../common/normal-select-box';
import {useRouter} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';

interface FormProps {
    formType: 'listing' | 'auction';
}

const Form: React.FC<FormProps> = ({formType}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [title, setTitle] = useState('');
    const [categories, setCategories] = useState('');
    const [price, setPrice] = useState(0);
    const [condition, setCondition] = useState('');
    const [cash, setCash] = useState('');
    const [description, setDescription] = useState('');
    const [startingBid, setStartingBid] = useState(0);
    const [bidIncrement, setBidIncrement] = useState(0);
    const [auctionDuration, setAuctionDuration] = useState('');

    const auctionDurationOptions = [
        {name: '1', description: '1 day'},
        {name: '3', description: '3 days'},
        {name: '7', description: '7 days'},
        {name: '14', description: '14 days'}
    ];
    const [reservePrice, setReservePrice] = useState(0);
    const [location, setLocation] = useState('');
    const {user, defaultCategories} = useAppContext();
    const [urls, setUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setError('');
        if (type === 'title') {
            setTitle(e.target.value);
        }
        if (type === 'price') {
            setPrice(Number(e.target.value));
        }
        if (type === 'description') {
            setDescription(e.target.value);
        }
        if (type === 'starting-bid') {
            setStartingBid(Number(e.target.value));
        }
        if (type === 'bid-increment') {
            setBidIncrement(Number(e.target.value));
        }
        if (type === 'reserve-price') {
            setReservePrice(Number(e.target.value));
        }
        if (type === 'location') {
            setLocation(e.target.value);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        const basePayload = {
            title: title,
            description: description,
            imageKeys: urls,
            flipForImgUrls: ['https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg'],
            sellerId: user?.userId ?? 1,
            itemCategories: categories.split(','),
            condition: condition === 'brand-new' ? 'NEW' : 'FAIRLY_USED',
            location: location
        };

        const payload =
            formType === 'auction'
                ? {
                      ...basePayload,
                      startingBid: startingBid,
                      bidIncrement: bidIncrement,
                      auctionDuration: parseInt(auctionDuration),
                      reservePrice: reservePrice > 0 ? reservePrice : undefined
                  }
                : {
                      ...basePayload,
                      acceptCash: cash === 'yes' ? true : false,
                      cashAmount: price
                  };

        console.log(payload);

        try {
            const endpoint = formType === 'auction' ? '/api/auctions/create' : '/api/items/create';
            const res = await fetch(endpoint, {
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
            <h1 className='typo-heading_ms mx-auto xs:hidden'>
                {formType === 'auction' ? 'Post an Auction' : 'Post a listed Item'}
            </h1>

            <InputBox label='Title' name='title' placeholder='Enter item title' type='text' setValue={handleInput} />
            <InputBox
                label='Description'
                name='description'
                placeholder='Enter item description'
                type='text'
                setValue={handleInput}
            />

            <NormalSelectBox
                selectedOption={categories}
                setSelectedOption={setCategories}
                options={defaultCategories}
            />

            <div className='typo-body_mr'>
                <p>Add photo</p>
                <p className='mb-3 text-text_four'>Upload at least 3 photos</p>
                <ImageUpload setUrls={setUrls} setUploading={setUploading} uploading={uploading} />
            </div>

            {formType === 'auction' ? (
                <>
                    <InputBox
                        label='Starting Bid'
                        name='starting-bid'
                        placeholder='Set starting bid'
                        type='number'
                        setValue={handleInput}
                    />
                    <InputBox
                        label='Bid Increment'
                        name='bid-increment'
                        placeholder='Set bid increment'
                        type='number'
                        setValue={handleInput}
                    />

                    <div>
                        <NormalSelectBox
                            title='Auction Duration'
                            selectedOption={auctionDuration}
                            setSelectedOption={setAuctionDuration}
                            options={auctionDurationOptions}
                        />
                    </div>

                    <InputBox
                        label='Reserve Price (Optional)'
                        name='reserve-price'
                        placeholder='Set reserve price'
                        type='number'
                        setValue={handleInput}
                    />
                </>
            ) : (
                <>
                    <InputBox
                        label='Price'
                        name='price'
                        placeholder='Set item price'
                        type='number'
                        setValue={handleInput}
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
                </>
            )}

            <InputBox
                label='Location'
                name='location'
                placeholder='Set item location'
                type='text'
                setValue={handleInput}
            />

            <RadioButtons
                nameOne='brand-new'
                nameTwo='fairly-used'
                title='Condition of item'
                titleOne='Brand new'
                titleTwo='Fairly used'
                selected={condition}
                setSelected={setCondition}
            />

            <div className='flex gap-4'>
                <Suspense fallback={<div>Loading...</div>}>
                    <RegularButton
                        isLight
                        text='Cancel'
                        action={() => router.back()}
                        isLoading={false}
                        disabled={false}
                    />
                    <RegularButton
                        text={formType === 'auction' ? 'Post Auction' : 'Post Item'}
                        action={handleSubmit}
                        isLoading={loading}
                        disabled={uploading}
                    />
                </Suspense>
            </div>
        </form>
    );
};

export default Form;
