'use client';
import React, {createContext, ReactNode, useContext, useState} from 'react';

interface ApiResponse {}

interface AppContextProps {
    showPopup: boolean;
    userId: string;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUserId: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [userId, setUserId] = useState('');

    return (
        <AppContext.Provider
            value={{
                userId,
                showPopup,
                setUserId,
                setShowPopup
            }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};
