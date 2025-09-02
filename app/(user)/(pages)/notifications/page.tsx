import {redirect} from 'next/navigation';
import React from 'react';
import Notifications from '~/ui/wrappers/Notifications';

const page = () => {
    try {
        return <Notifications />;
    } catch {
        redirect('/error-page');
    }
};

export default page;
