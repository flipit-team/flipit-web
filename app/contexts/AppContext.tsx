'use client';
import React, {createContext, ReactNode, useContext, useState} from 'react';

interface ApiResponse {}

interface AppContextProps {
    showPopup: boolean;

    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);

    return (
        <AppContext.Provider
            value={{
                showPopup,
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
