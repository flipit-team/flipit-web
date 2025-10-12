'use client';
import {redirect} from 'next/navigation';
import React, {useEffect, useState} from 'react';
import Form from '~/ui/post-an-item/Form';
import {ItemsService} from '~/services/items.service';
import {ItemDTO} from '~/types/api';
import Loading from '~/ui/common/loading/Loading';
import ErrorDisplay from '~/ui/common/error-display/ErrorDisplay';
import {useParams} from 'next/navigation';
import {useToast} from '~/contexts/ToastContext';

const EditItemPage = () => {
    const params = useParams();
    const {showError} = useToast();
    const [item, setItem] = useState<ItemDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    const itemId = parseInt(params.slug as string);

    useEffect(() => {
        const fetchItem = async () => {
            if (!itemId || isNaN(itemId)) {
                setError('Invalid item ID');
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                const result = await ItemsService.getItemById(itemId);
                
                if (result.data) {
                    setItem(result.data);
                } else {
                    const errorMessage = 'Failed to fetch item details';
                    setError(errorMessage);
                    showError(result.error || errorMessage);
                }
            } catch (error) {
                const errorMessage = 'An error occurred while fetching item details';
                setError(errorMessage);
                showError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [itemId, showError]);


    if (loading) {
        return (
            <div className='w-full h-full'>
                <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg px-[30px]'>
                    <div className='flex items-center justify-center h-64'>
                        <Loading size='lg' text='Loading item details...' />
                    </div>
                </div>
            </div>
        );
    }

    if (error || !item) {
        return (
            <div className='w-full h-full'>
                <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg px-[30px]'>
                    <h1 className='typo-heading_ms xs:hidden mb-4'>Edit Item</h1>
                    <ErrorDisplay 
                        error={error || 'Item not found'} 
                        className='max-w-md'
                    />
                </div>
            </div>
        );
    }

    try {
        return (
            <div className='w-full h-full'>
                <div className='flex flex-col items-center mt-[35px] xs:mt-0 py-6 mx-auto h-max w-[648px] xs:w-full lg:shadow-lg px-[30px]'>
                    <Form
                        formType="listing"
                        existingItem={item}
                        isEditing={true}
                    />
                </div>
            </div>
        );
    } catch {
        redirect('/error-page');
    }
};

export default EditItemPage;
