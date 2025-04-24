'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';

interface AppContextProps {
    showPopup: boolean;
    userId: number | null;
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [defaultCategories, setDefaultCategories] = useState<{name: string; description: string | null}[]>([]);

    useEffect(() => {
        const handleGetCategories = async () => {
            const res = await fetch('/api/items/get-categories', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            console.log(data, 88);

            setDefaultCategories(data);
            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
        };

        handleGetCategories();
    }, []);

    return (
        <AppContext.Provider
            value={{
                userId,
                showPopup,
                defaultCategories,
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
