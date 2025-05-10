import Image from 'next/image';
import RegularButton from '../buttons/RegularButton';

type ErrorProps = {
    onClose: () => void;
    message?: string | null;
};

const Error = ({onClose, message}: ErrorProps) => {
    return (
        <div className=''>
            <Image
                src={'/error-icon.svg'}
                height={117}
                width={117}
                alt='logo'
                className='h-[117px] w-[117px] mx-auto'
            />
            <h3 className='typo-heading_ms text-center mb-4'>Error</h3>
            <p className='typo-heading_xsr text-text-secondary text-center mb-9'>
                {message ? message : 'Something went wrong'}
            </p>

            <div className='w-[297px] mx-auto mt-9'>
                <RegularButton text='Close' action={onClose} />
            </div>
        </div>
    );
};

export default Error;
