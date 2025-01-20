import React from 'react';
import {redirect} from 'next/navigation';

const Home = async () => {
    try {
        <div></div>;
    } catch {
        redirect('/error-page');
    }
};

export default Home;
