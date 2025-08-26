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
            if (authStatus.user) {
            }
        }
    }, [authStatus]);

    // This component doesn't render anything, it's just for logging
    return null;
};

export default AuthLogger;