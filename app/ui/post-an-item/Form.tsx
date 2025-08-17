'use client';
import React, {Suspense, useState} from 'react';
import InputBox from '../common/input-box';
import RadioButtons from '../common/radio-buttons';
import ImageUpload from '../common/image-upload';
import RegularButton from '../common/buttons/RegularButton';
import NormalSelectBox from '../common/normal-select-box';
import {useRouter} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import { useCategories } from '~/hooks/useItems';
import { ItemsService } from '~/services/items.service';
import { CreateItemRequest } from '~/types/api';

interface FormProps {
    formType: 'listing' | 'auction';
}

const Form: React.FC<FormProps> = ({formType}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
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
    const [brand, setBrand] = useState('');
    const {user, defaultCategories} = useAppContext();
    const { categories: apiCategories, loading: categoriesLoading } = useCategories();
    const [urls, setUrls] = useState<string[]>([]);
    const [uploading, setUploading] = useState(false);

    // Use API categories if available, fallback to context categories, then empty array
    const availableCategories = apiCategories.length > 0 ? apiCategories : defaultCategories;

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
        if (type === 'brand') {
            setBrand(e.target.value);
        }
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError(null);

        if (formType === 'listing') {
            // Validate required fields
            if (!title.trim()) {
                setError('Title is required');
                setLoading(false);
                return;
            }
            if (!description.trim()) {
                setError('Description is required');
                setLoading(false);
                return;
            }
            if (!location.trim()) {
                setError('Location is required');
                setLoading(false);
                return;
            }
            if (!condition) {
                setError('Please select item condition');
                setLoading(false);
                return;
            }
            if (!cash) {
                setError('Please specify if you accept cash');
                setLoading(false);
                return;
            }
            if (cash === 'yes' && price <= 0) {
                setError('Please set a valid price');
                setLoading(false);
                return;
            }

            // Handle regular item creation
            const itemData: CreateItemRequest = {
                title: title.trim(),
                description: description.trim(),
                imageKeys: urls,
                acceptCash: cash === 'yes',
                cashAmount: cash === 'yes' ? price : 0,
                location: location.trim(),
                condition: condition === 'brand-new' ? 'NEW' : 'FAIRLY_USED',
                brand: brand.trim() || 'Unknown', // Default brand if not provided
                itemCategories: categories ? [categories] : [] // Single category for now
            };

            console.log('🚀 Creating item with payload:', itemData);
            console.log('🔍 Validation passed - all required fields present');

            try {
                const result = await ItemsService.createItem(itemData);
                
                console.log('📦 ItemsService.createItem response:', result);
                
                if (result.error) {
                    console.error('❌ Item creation failed:', result.error);
                    setError(result.error.message || 'Failed to create item');
                    return;
                }

                if (result.data) {
                    console.log('✅ Item created successfully:', result.data);
                    console.log('📍 Item ID:', result.data.id);
                    console.log('📝 Item title:', result.data.title);
                    
                    // Force a complete page reload to ensure fresh data
                    window.location.href = '/home';
                } else {
                    console.error('⚠️ No data in success response:', result);
                    setError('Item creation response was empty');
                }
            } catch (err: any) {
                setError(err.message || 'Failed to create item');
            } finally {
                setLoading(false);
            }
        } else {
            // Auction creation - TODO: implement auction service
            setError('Auction creation not yet implemented');
            setLoading(false);
        }
    };

    return (
        <form className='w-full flex flex-col gap-6'>
            <h1 className='typo-heading_ms mx-auto xs:hidden'>
                {formType === 'auction' ? 'Post an Auction' : 'Post a listed Item'}
            </h1>

            {error && (
                <div className='p-4 bg-red-50 border border-red-200 rounded-lg text-red-800'>
                    {error}
                </div>
            )}

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
                options={availableCategories}
            />

            <InputBox
                label='Brand (Optional)'
                name='brand'
                placeholder='Enter item brand'
                type='text'
                setValue={handleInput}
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
