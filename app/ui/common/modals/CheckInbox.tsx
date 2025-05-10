import Image from 'next/image';
import RegularButton from '../buttons/RegularButton';

type CheckInboxProps = {
    onClose: () => void;
    message: string | null;
};

const CheckInbox = ({onClose, message}: CheckInboxProps) => {
    return (
        <div className=''>
            <Image
                src={'/email-sent.svg'}
                height={72}
                width={105}
                alt='logo'
                className='h-[72px] w-[105px] mx-auto mb-8'
            />
            <h3 className='typo-heading_ms text-center mb-4'>Check Your Inbox</h3>
            <p className='typo-heading_xsr text-text-secondary text-center mb-9'>{message}</p>

            <div className='w-[297px] mx-auto mt-9'>
                <RegularButton text={'Done'} action={onClose} />
            </div>
        </div>
    );
};

export default CheckInbox;
