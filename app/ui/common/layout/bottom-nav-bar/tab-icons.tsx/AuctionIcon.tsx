interface Props {
    isActive: boolean;
}
export const AuctionIcon = ({isActive}: Props) => {
    return (
        <svg
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
        >
            <path
                d='M14.0039 20.0035V22.0035H2.00391V20.0035H14.0039ZM14.5889 0.689453L22.3669 8.46745L20.9529 9.88145L19.8919 9.52845L17.4169 12.0035L23.0739 17.6605L21.6599 19.0745L16.0029 13.4175L13.5989 15.8215L13.8819 16.9535L12.4669 18.3675L4.68891 10.5895L6.10291 9.17445L7.23491 9.45745L13.5279 3.16445L13.1749 2.10445L14.5889 0.689453ZM15.2959 4.22545L8.22491 11.2955L11.7599 14.8315L18.8309 7.76145L15.2959 4.22545Z'
                className={isActive ? 'fill-tab-bar-active' : 'fill-tab-bar-default'}
            />
        </svg>
    );
};
