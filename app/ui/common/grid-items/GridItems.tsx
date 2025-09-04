import React from 'react';
import {Item} from '~/utils/interface';
import NoData from '../no-data/NoData';
import ItemCard from '../item-card/ItemCard';

interface Props {
    items: Item[];
    forEdit?: boolean;
    forLiveAuction?: boolean;
}

const GridItems = (props: Props) => {
    const {items, forEdit, forLiveAuction} = props;
    return (
        <div className='grid grid-cols-3 xs:grid-cols-2 gap-6 xs:gap-4'>
            {items && Array.isArray(items) && items.length > 0 ? (
                items.map((item, i) => (
                    <ItemCard
                        key={i}
                        item={item}
                        forEdit={forEdit}
                        forLiveAuction={forLiveAuction}
                        showSaveButton={forLiveAuction ? false : true}
                        showPromotedBadge={forLiveAuction ? false : true}
                        showVerifiedBadge={forLiveAuction ? false : true}
                        showAuctionBadge={forLiveAuction ? true : false}
                    />
                ))
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default GridItems;
