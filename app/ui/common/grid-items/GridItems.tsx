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
    console.log(props.items);
    return (
        <div className='grid grid-cols-3 xs:grid-cols-2 gap-6 xs:gap-4'>
            {props.items ? (
                props.items.map((item, i) => {
                    const url = item.imageUrls[0] || '/camera.png';

                    return (
                        <Link
                            href={`/${props.forEdit ? 'edit-item' : 'home'}/${item.id}`}
                            key={i}
                            className='h-[400px] w-full xs:h-[260px] border border-border_gray rounded-md'
                        >
                            <div className='relative h-[302px] w-full'>
                                <Image
                                    className='h-[302px] w-full xs:h-[128px] cursor-pointer'
                                    src={url}
                                    alt='search'
                                    height={302}
                                    width={349}
                                />
                                <div className='absolute bottom-3 right-3'>
                                    <Image
                                        className='h-[46px] w-[43px] cursor-pointer'
                                        src={'/save-item.svg'}
                                        alt='search'
                                        height={46}
                                        width={43}
                                    />
                                </div>
                                <div className='w-[76px] h-[26px] typo-body_sr text-white bg-primary absolute bottom-5 left-3 flex items-center justify-center rounded'>
                                    Promoted
                                </div>
                                <div className='h-[26px] px-[6px] typo-body_sr text-primary bg-white absolute top-4 left-3 flex items-center justify-center gap-1 rounded'>
                                    <Image
                                        className='h-4 w-4'
                                        src={'/verified.svg'}
                                        alt='search'
                                        height={16}
                                        width={16}
                                    />
                                    <div>Verified ID</div>
                                </div>
                            </div>

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
