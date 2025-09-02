import {redirect} from 'next/navigation';
import React from 'react';
import MobileChat from '~/ui/wrappers/MobileChat';

const page = () => {
    try {
        return <MobileChat />;
    } catch {
        redirect('/error-page');
    }
};

export default page;
