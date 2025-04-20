'use client';

import {useEffect, useState} from 'react';
import {useAppContext} from '~/contexts/AppContext';

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const {setUserId} = useAppContext();

    useEffect(() => {
        fetch('/api/auth/me')
            .then((res) => res.json())
            .then((data) => {
                console.log(data, 333);
                setUserId(data.userId);
                setIsAuthenticated(data.isAuthenticated);
            })
            .catch(() => {
                setIsAuthenticated(false);
            });
    }, []);

    return isAuthenticated;
}

export default useAuth;
