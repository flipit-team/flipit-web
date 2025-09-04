'use client';
import React, {Suspense, useState, useEffect} from 'react';
import InputBox from '../common/input-box';
import RadioButtons from '../common/radio-buttons';
import ImageUpload from '../common/image-upload';
import RegularButton from '../common/buttons/RegularButton';
import NormalSelectBox from '../common/normal-select-box';
import AuctionDurationSelector from '../common/auction-duration-selector/AuctionDurationSelector';
import {useRouter} from 'next/navigation';
import {useAppContext} from '~/contexts/AppContext';
import { useCategories } from '~/hooks/useItems';
import { ItemsService } from '~/services/items.service';
import { AuctionsService } from '~/services/auctions.service';
import { CreateItemRequest, CreateAuctionRequest, ItemDTO, UpdateItemRequest } from '~/types/api';
import { formatErrorForDisplay } from '~/utils/error-messages';
import ErrorDisplay from '../common/error-display/ErrorDisplay';

interface FormProps {
    formType: 'listing' | 'auction';
    existingItem?: ItemDTO;
    isEditing?: boolean;
}

const Form: React.FC<FormProps> = ({formType, existingItem, isEditing = false}) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [errorTitle, setErrorTitle] = useState<string>('');
    const [errorAction, setErrorAction] = useState<string>('');
    
    // Initialize state with existing item data if editing (only used for initial render)
    const getInitialValue = (field: string, defaultValue: any) => {
        if (isEditing && existingItem) {
            switch (field) {
                case 'title': return existingItem.title || '';
                case 'description': return existingItem.description || '';
                case 'price': return existingItem.cashAmount || 0;
                case 'condition': 
                    const conditionMapping: { [key: string]: string } = {
                        'NEW': 'brand-new',
                        'FAIRLY_USED': 'fairly-used',
                        'USED': 'fairly-used'
                    };
                    return conditionMapping[existingItem.condition || ''] || existingItem.condition || '';
                case 'location': return existingItem.location || '';
                case 'brand': return existingItem.brand || '';
                case 'cash': return existingItem.acceptCash ? 'yes' : 'no';
                case 'categories': 
                    return existingItem.itemCategories && existingItem.itemCategories.length > 0 
                        ? existingItem.itemCategories[0].name 
                        : '';
                default: return defaultValue;
            }
        }
        return defaultValue;
    };
    
    const [title, setTitle] = useState(() => getInitialValue('title', ''));
    const [categories, setCategories] = useState(() => getInitialValue('categories', ''));
    const [price, setPrice] = useState(() => getInitialValue('price', 0));
    const [condition, setCondition] = useState(() => getInitialValue('condition', ''));
    const [cash, setCash] = useState(() => getInitialValue('cash', ''));
    const [description, setDescription] = useState(() => getInitialValue('description', ''));
    const [location, setLocation] = useState(() => getInitialValue('location', ''));
    const [brand, setBrand] = useState(() => getInitialValue('brand', ''));
    const [urls, setUrls] = useState<string[]>(() => 
        isEditing && existingItem ? (existingItem.imageUrls || []) : []
    );
    
    // Update form state when existingItem changes (for async data loading)
    useEffect(() => {
        if (isEditing && existingItem) {
            setTitle(existingItem.title || '');
            setDescription(existingItem.description || '');
            setPrice(existingItem.cashAmount || 0);
            setLocation(existingItem.location || '');
            setBrand(existingItem.brand || '');
            setCash(existingItem.acceptCash ? 'yes' : 'no');
            
            // Handle condition mapping
            const conditionMapping: { [key: string]: string } = {
                'NEW': 'brand-new',
                'FAIRLY_USED': 'fairly-used',
                'USED': 'fairly-used'
            };
            const mappedCondition = conditionMapping[existingItem.condition || ''] || existingItem.condition || '';
            setCondition(mappedCondition);
            
            // Handle categories
            if (existingItem.itemCategories && existingItem.itemCategories.length > 0) {
                setCategories(existingItem.itemCategories[0].name);
            }
            
            // Handle URLs
            setUrls(existingItem.imageUrls || []);
        }
    }, [isEditing, existingItem]);
    
    const [startingBid, setStartingBid] = useState(0);
    const [bidIncrement, setBidIncrement] = useState(0);
    const [auctionStartDate, setAuctionStartDate] = useState('');
    const [auctionDurationHours, setAuctionDurationHours] = useState(24); // Default 24 hours (1 day)
    const [reservePrice, setReservePrice] = useState(0);
    const {defaultCategories} = useAppContext();
    const { categories: apiCategories } = useCategories();
    const [uploading, setUploading] = useState(false);

    // Use API categories if available, fallback to context categories, then empty array
    const availableCategories = apiCategories.length > 0 ? apiCategories : defaultCategories;



    const handleInput = (e: React.ChangeEvent<HTMLInputElement>, type: string) => {
        setError('');
        setErrorTitle('');
        setErrorAction('');
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
        if (type === 'auction-start-date') {
            setAuctionStartDate(e.target.value);
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

            if (isEditing && existingItem) {
                // Handle item update
                const updateData: UpdateItemRequest = {
                    title: title.trim(),
                    description: description.trim(),
                    imageKeys: urls.filter(url => url != null && url !== ''),
                    acceptCash: cash === 'yes',
                    cashAmount: cash === 'yes' ? price : 0,
                    location: location.trim(),
                    condition: condition === 'brand-new' ? 'NEW' : 'FAIRLY_USED',
                    brand: brand.trim() || 'Unknown',
                    itemCategories: categories ? [categories] : [],
                    published: true // Ensure item remains published after update
                };

                try {
                    const result = await ItemsService.updateItem(existingItem.id, updateData);
                    
                    if (result.error) {
                        const errorDetails = formatErrorForDisplay(result.error);
                        setErrorTitle(errorDetails.title);
                        setError(errorDetails.message);
                        setErrorAction(errorDetails.action || '');
                        return;
                    }
                    if (result.data) {
                        // Redirect to my-items page after successful update
                        window.location.href = '/my-items';
                    } else {
                        const errorDetails = formatErrorForDisplay('Item update response was empty');
                        setErrorTitle(errorDetails.title);
                        setError(errorDetails.message);
                        setErrorAction(errorDetails.action || '');
                    }
                } catch (err: any) {
                    const errorDetails = formatErrorForDisplay(err);
                    setErrorTitle(errorDetails.title);
                    setError(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                } finally {
                    setLoading(false);
                }
            } else {
                // Handle regular item creation
                const itemData: CreateItemRequest = {
                    title: title.trim(),
                    description: description.trim(),
                    imageKeys: urls.filter(url => url != null && url !== ''), // Filter out null/empty URLs
                    acceptCash: cash === 'yes',
                    cashAmount: cash === 'yes' ? price : 0,
                    location: location.trim(),
                    condition: condition === 'brand-new' ? 'NEW' : 'FAIRLY_USED',
                    brand: brand.trim() || 'Unknown', // Default brand if not provided
                    itemCategories: categories ? [categories] : [] // Single category for now
                };


                try {
                    const result = await ItemsService.createItem(itemData);
                
                
                if (result.error) {
                    const errorDetails = formatErrorForDisplay(result.error);
                    setErrorTitle(errorDetails.title);
                    setError(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                    return;
                }

                if (result.data) {
                    
                    // Force a complete page reload to ensure fresh data
                    window.location.href = '/home';
                } else {
                    const errorDetails = formatErrorForDisplay('Item creation response was empty');
                    setErrorTitle(errorDetails.title);
                    setError(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                }
            } catch (err: any) {
                const errorDetails = formatErrorForDisplay(err);
                setErrorTitle(errorDetails.title);
                setError(errorDetails.message);
                setErrorAction(errorDetails.action || '');
            } finally {
                setLoading(false);
            }
            }
        } else {
            // Auction creation validation
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
            if (startingBid <= 0) {
                setError('Please set a valid starting bid');
                setLoading(false);
                return;
            }
            if (bidIncrement <= 0) {
                setError('Please set a valid bid increment');
                setLoading(false);
                return;
            }
            if (!auctionStartDate) {
                setError('Please select auction start date');
                setLoading(false);
                return;
            }
            if (auctionDurationHours <= 0 || auctionDurationHours > 168) {
                setError('Auction duration must be between 1 hour and 7 days (168 hours)');
                setLoading(false);
                return;
            }

            // Validate start date is not in the past
            const selectedStartDate = new Date(auctionStartDate);
            const now = new Date();
            if (selectedStartDate <= now) {
                setError('Auction start date must be in the future');
                setLoading(false);
                return;
            }

            // Calculate end date based on start date + duration in hours
            const startDate = new Date(auctionStartDate);
            const endDate = new Date(startDate);
            endDate.setHours(startDate.getHours() + auctionDurationHours);

            const auctionData: CreateAuctionRequest = {
                title: title.trim(),
                description: description.trim(),
                imageKeys: urls.filter(url => url != null && url !== ''), // Filter out null/empty URLs
                location: location.trim(),
                condition: condition === 'brand-new' ? 'NEW' : 'FAIRLY_USED',
                brand: brand.trim() || 'Unknown',
                itemCategories: categories ? [categories] : [],
                startingBid: startingBid,
                bidIncrement: bidIncrement,
                reservePrice: reservePrice > 0 ? reservePrice : startingBid, // Use starting bid as minimum reserve price
                startDate: startDate.toISOString(),
                endDate: endDate.toISOString(),
                itemId: 0 // Will be created by the backend
            };


            try {
                console.log('Creating auction with data:', auctionData);
                const result = await AuctionsService.createAuction(auctionData);
                console.log('Auction creation result:', result);
                
                if (result.error) {
                    const errorDetails = formatErrorForDisplay(result.error);
                    setErrorTitle(errorDetails.title);
                    setError(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                    return;
                }

                if (result.data) {
                    
                    // Force a complete page reload to ensure fresh data
                    window.location.href = '/live-auction';
                } else {
                    const errorDetails = formatErrorForDisplay('Auction creation response was empty');
                    setErrorTitle(errorDetails.title);
                    setError(errorDetails.message);
                    setErrorAction(errorDetails.action || '');
                }
            } catch (err: any) {
                const errorDetails = formatErrorForDisplay(err);
                setErrorTitle(errorDetails.title);
                setError(errorDetails.message);
                setErrorAction(errorDetails.action || '');
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <form className='w-full flex flex-col gap-6'>
            <h1 className='typo-heading_ms mx-auto xs:hidden'>
                {formType === 'auction' ? 'Post an Auction' : 'Post a listed Item'}
            </h1>

            {error && (
                <ErrorDisplay 
                    error={{
                        title: errorTitle,
                        message: error,
                        action: errorAction
                    }}
                />
            )}

            <InputBox label='Title' name='title' placeholder='Enter item title' type='text' value={title} setValue={handleInput} />
            <InputBox
                label='Description'
                name='description'
                placeholder='Enter item description'
                type='text'
                value={description}
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
                value={brand}
                setValue={handleInput}
            />

            <div className='typo-body_mr'>
                <p>Add photo</p>
                <p className='mb-3 text-text_four'>Upload at least 3 photos</p>
                <ImageUpload setUrls={setUrls} setUploading={setUploading} uploading={uploading} initialUrls={urls} />
            </div>

            {formType === 'auction' ? (
                <>
                    <InputBox
                        label='Starting Bid'
                        name='starting-bid'
                        placeholder='Set starting bid'
                        type='number'
                        value={startingBid.toString()}
                        setValue={handleInput}
                    />
                    <InputBox
                        label='Bid Increment'
                        name='bid-increment'
                        placeholder='Set bid increment'
                        type='number'
                        value={bidIncrement.toString()}
                        setValue={handleInput}
                    />

                    <InputBox
                        label='Auction Start Date'
                        name='auction-start-date'
                        placeholder='Select auction start date'
                        type='datetime-local'
                        setValue={handleInput}
                        value={auctionStartDate}
                    />

                    <AuctionDurationSelector
                        label='Auction Duration'
                        value={auctionDurationHours}
                        onChange={setAuctionDurationHours}
                    />

                    <InputBox
                        label='Reserve Price (Optional)'
                        name='reserve-price'
                        placeholder='Set reserve price'
                        type='number'
                        value={reservePrice.toString()}
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
                        value={price.toString()}
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
                value={location}
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
                        text={isEditing ? 'Update Item' : (formType === 'auction' ? 'Post Auction' : 'Post Item')}
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
