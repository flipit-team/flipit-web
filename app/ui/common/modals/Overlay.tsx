'use client';
import {useEffect, useState} from 'react';
import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import CheckInbox from './CheckInbox';
import Success from './Success';
import Error from './Error';
import {useAppContext} from '~/contexts/AppContext';
import Image from 'next/image';
import SendMessage from '~/ui/homepage/send-message';
import CallbackRequest from '~/ui/homepage/callback-request';

enum MODAL {
    LOGIN = 'login',
    FORGOT_PASSWORD = 'forgot-password',
    NEW_PASSWORD = 'new-password',
    CHECK_INBOX = 'check-inbox',
    SUCCESS = 'success',
    ERROR = 'error',
    EXPIREDLINK = 'expired-link',
    VERIFIED = 'verified',
    SEND_MESSAGE = 'send-message',
    CALLBACK_REQUEST = 'callback-request'
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
        router.replace(queryString ? `${pathname}?${queryString}` : pathname);
        setIsOpen(false);
        router.refresh();
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
            case MODAL.SEND_MESSAGE:
                return <SendMessage onClose={removeParam} title='Send message to seller' onSubmit={removeParam} />;
            case MODAL.CALLBACK_REQUEST:
                return <CallbackRequest onClose={removeParam} title='Request for Callback' onSubmit={removeParam} />;
            default:
                break;
        }
    };

    if (!isOpen) return;

    const showCancel = () => {
        if (modalType === MODAL.SEND_MESSAGE || modalType === MODAL.CALLBACK_REQUEST) {
            return true;
        }
        return false;
    };

    return (
        <div className=''>
            <div className={`fixed inset-0 bg-black bg-opacity-50 h-screen flex justify-center items-center z-[1001]`}>
                <div
                    className={`relative bg-white rounded-2xl w-[558px] h-max xs:w-full ${
                        showCancel() ? 'py-0 px-0' : 'py-[48px] px-[56px]'
                    } xs:px-8 xs:py-8 mx-6 text-text-primary`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div onClick={removeParam} className={`${showCancel() ? 'hidden' : ''}`}>
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
