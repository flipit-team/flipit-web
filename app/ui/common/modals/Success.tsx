import Image from 'next/image';
import RegularButton from '../buttons/RegularButton';

type SuccessProps = {
    onClose: () => void;
    message: string | null;
};

const Success = ({onClose, message}: SuccessProps) => {
    return (
        <div className=''>
            <Image
                src={'/success-icon.svg'}
                height={117}
                width={117}
                alt='logo'
                className='h-[117px] w-[117px] mx-auto'
            />
            <h3 className='typo-heading_ms text-center mb-4'>Success</h3>
            <p className='typo-heading_xsr text-text-secondary text-center mb-9'>{message}</p>

            <div className='w-[297px] mx-auto mt-9'>
                <RegularButton text={'Done'} action={onClose} />
            </div>
        </div>
    );
};

export default Success;
