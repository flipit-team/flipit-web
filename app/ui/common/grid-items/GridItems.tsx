import Image from 'next/image';
import React from 'react';
import {formatToNaira} from '~/utils/helpers';
import UsedBadge from '../badges/UsedBadge';
import Link from 'next/link';
import {Item} from '~/utils/interface';
import NoData from '../no-data/NoData';

interface Props {
    items: Item[];
    forEdit?: boolean;
}

const GridItems = (props: Props) => {
    return (
        <div className='grid grid-cols-3 xs:grid-cols-2 gap-6 xs:gap-4'>
            {props.items ? (
                props.items.map((item, i) => {
                    const url = item.imageUrls[0] ?? `/camera.png`;

                    return (
                        <Link
                            href={`/${props.forEdit ? 'edit-item' : 'home'}/${item.id}`}
                            key={i}
                            className='h-[400px] w-full xs:h-[260px] border border-border_gray rounded-md'
                        >
                            {url ? (
                                <Image
                                    className='h-[302px] w-full xs:h-[128px] cursor-pointer'
                                    src={url}
                                    alt='search'
                                    height={302}
                                    width={349}
                                    unoptimized
                                />
                            ) : (
                                <Image
                                    className='h-[302px] w-full xs:h-[128px] cursor-pointer'
                                    src={`/camera.png`}
                                    alt='search'
                                    height={302}
                                    width={349}
                                />
                            )}
                            <div className='p-4 xs:p-3 h-[98px] xs:h-[132px]'>
                                <p className='typo-body_mr xs:typo-body_sr xs:mb-2 capitalize'>{item.title}</p>
                                <p className='typo-body_lm xs:typo-body_mm xs:mb-1'>{formatToNaira(item.cashAmount)}</p>
                                <div className='flex xs:flex-col justify-between items-center xs:items-start rounded'>
                                    <p className='typo-body_sr xs:text-[11px] xs:mb-1 capitalize'>
                                        {item.acceptCash ? 'cash' : 'item'} offers
                                    </p>
                                    <UsedBadge text={item.condition} />
                                </div>
                            </div>
                        </Link>
                    );
                })
            ) : (
                <NoData />
            )}
        </div>
    );
};

export default GridItems;
