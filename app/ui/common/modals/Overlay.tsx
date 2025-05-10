'use client';
import {useEffect, useState} from 'react';
import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import CheckInbox from './CheckInbox';
import Success from './Success';
import Error from './Error';
import {useAppContext} from '~/contexts/AppContext';
import Image from 'next/image';

enum MODAL {
    LOGIN = 'login',
    FORGOT_PASSWORD = 'forgot-password',
    NEW_PASSWORD = 'new-password',
    CHECK_INBOX = 'check-inbox',
    SUCCESS = 'success',
    ERROR = 'error',
    EXPIREDLINK = 'expired-link',
    VERIFIED = 'verified'
}

const Overlay = () => {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const modalType = searchParams.get('modal');
    const {modalMessage} = useAppContext();

    const removeParam = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.delete('modal');

        const queryString = params.toString();
        router.push(queryString ? `${pathname}?${queryString}` : pathname);
        setIsOpen(false);
    };

    useEffect(() => {
        if (modalType) {
            setIsOpen(true);
        } else {
            setIsOpen(false);
        }
    }, [modalType]);

    const getModal = () => {
        switch (modalType) {
            case MODAL.CHECK_INBOX:
                return <CheckInbox onClose={removeParam} message={'We have sent you a verification link'} />;
            case MODAL.SUCCESS:
                return <Success onClose={removeParam} message={modalMessage} />;
            case MODAL.VERIFIED:
                return <Success onClose={removeParam} message={'Your account has been verified.'} />;
            case MODAL.EXPIREDLINK:
                return <Error onClose={removeParam} message={'Link has expired'} />;
            case MODAL.ERROR:
                return <Error onClose={removeParam} message={modalMessage} />;
            default:
                break;
        }
    };

    if (!isOpen) return;

    return (
        <div className=''>
            <div className={`fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-[1001]`}>
                <div
                    className={`relative bg-white rounded-2xl w-[558px] h-max xs:w-full py-[48px] px-[56px] xs:px-8 xs:py-8 mx-6 text-text-primary`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div onClick={removeParam}>
                        <Image
                            src={'/cancel-grey.svg'}
                            height={30}
                            width={30}
                            alt='cancel'
                            className='h-[30px] w-[30px] cursor-pointer'
                        />
                    </div>
                    {getModal()}
                </div>
            </div>
        </div>
    );
};

export default Overlay;
