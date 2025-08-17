'use client';

import React from 'react';

interface AuthLoggerProps {
    authStatus?: {
        isAuthenticated: boolean;
        user: any | null;
    };
}

const AuthLogger: React.FC<AuthLoggerProps> = ({ authStatus }) => {
    React.useEffect(() => {
        if (authStatus) {
            console.log('🔐 Client-side auth status:', authStatus.isAuthenticated ? 'LOGGED IN' : 'NOT LOGGED IN');
            if (authStatus.user) {
                console.log('👤 Client-side user:', authStatus.user.firstName || authStatus.user.username || authStatus.user.email);
            }
        }
    }, [authStatus]);

    // This component doesn't render anything, it's just for logging
    return null;
};

export default AuthLogger;