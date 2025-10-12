'use client';
import React from 'react';
import Image from 'next/image';
import { Item } from '~/utils/interface';
import GridItems from '../common/grid-items/GridItems';
import { timeAgo, formatToNaira } from '~/utils/helpers';
import StarRating from '../common/star-rating/StarRating';

interface Props {
    items: Item[];
    userInfo?: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        profileImageUrl?: string;
        avgRating: number;
        reviewCount: number;
        status: string;
        phoneNumberVerified: boolean;
        dateVerified: string | null;
        dateCreated: string;
    };
}

const UserProfile = (props: Props) => {
    const { items, userInfo } = props;
    
    // Extract user info from first item if not provided separately
    const user = userInfo || (items.length > 0 ? items[0].seller : null);
    
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <h2 className="typo-heading_ms text-text_one mb-4">User not found</h2>
                    <p className="typo-body_mr text-text_four">This user profile could not be loaded.</p>
                </div>
            </div>
        );
    }

    const joinDate = new Date((user as any).dateCreated || new Date());
    const joinYear = joinDate.getFullYear();

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            {/* User Profile Header */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex items-start gap-6 xs:flex-col">
                    {/* Profile Image */}
                    <div className="flex-shrink-0">
                        <Image
                            src={(user as any).profileImageUrl || (user as any).avatar || '/placeholder-avatar.svg'}
                            height={120}
                            width={120}
                            alt={`${user.firstName} ${user.lastName}`}
                            className="h-[120px] w-[120px] rounded-full object-cover border-2 border-border_gray"
                        />
                    </div>
                    
                    {/* User Info */}
                    <div className="flex-1">
                        <h1 className="typo-heading_sm text-text_one mb-2">
                            {user.firstName} {user.lastName}
                        </h1>
                        
                        {/* Verification Status */}
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`h-[26px] px-3 flex items-center justify-center rounded typo-body_sr ${
                                user.phoneNumberVerified 
                                    ? 'bg-surface-primary-16 text-primary' 
                                    : 'bg-gray-100 text-text_four'
                            }`}>
                                {user.phoneNumberVerified ? 'Verified profile' : 'Unverified profile'}
                            </div>
                            <div className="h-[26px] px-3 bg-gray-100 text-text_four flex items-center justify-center rounded typo-body_sr">
                                {user.status}
                            </div>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-3">
                            <StarRating 
                                rating={(user as any).avgRating || (user as any).avg_rating || 0}
                                size={20}
                            />
                            <span className="typo-body_mr text-text_four">
                                {((user as any).avgRating || (user as any).avg_rating || 0).toFixed(1)} ({(user as any).reviewCount || 0} reviews)
                            </span>
                        </div>
                        
                        {/* Member Info */}
                        <div className="space-y-1">
                            <p className="typo-body_sr text-text_four">
                                Joined Flipit in {joinYear}
                            </p>
                            <p className="typo-body_sr text-text_four">
                                Responds within minutes
                            </p>
                        </div>
                    </div>
                    
                    {/* Stats */}
                    <div className="text-right xs:text-left xs:w-full">
                        <div className="typo-heading_ms text-primary mb-1">
                            {items.length}
                        </div>
                        <div className="typo-body_mr text-text_four">
                            {items.length === 1 ? 'Item listed' : 'Items listed'}
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Items Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="typo-heading_sm text-text_one">
                        {user.firstName}&apos;s Items ({items.length})
                    </h2>
                    
                    {/* Sort/Filter options could go here */}
                    <div className="flex items-center gap-2">
                        <span className="typo-body_sr text-text_four">Sort by:</span>
                        <select className="typo-body_sr text-text_one border border-border_gray rounded px-2 py-1">
                            <option value="newest">Newest first</option>
                            <option value="oldest">Oldest first</option>
                            <option value="price-low">Price: Low to High</option>
                            <option value="price-high">Price: High to Low</option>
                        </select>
                    </div>
                </div>
                
                {/* Items Grid */}
                {items.length > 0 ? (
                    <GridItems items={items} />
                ) : (
                    <div className="text-center py-12">
                        <Image
                            src="/empty-state.svg"
                            height={100}
                            width={100}
                            alt="No items"
                            className="mx-auto mb-4 opacity-50"
                        />
                        <h3 className="typo-heading_sm text-text_four mb-2">No items listed</h3>
                        <p className="typo-body_mr text-text_four">
                            {user.firstName} hasn&apos;t listed any items yet.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserProfile;