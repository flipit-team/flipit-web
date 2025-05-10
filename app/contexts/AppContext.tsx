'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Notification} from '~/utils/interface';

interface AppContextProps {
    showPopup: boolean;
    userId: number | null;
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    notifications: Notification | null;
    modalMessage: string;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
    setModalMessage: React.Dispatch<React.SetStateAction<string>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [defaultCategories, setDefaultCategories] = useState<{name: string; description: string | null}[]>([]);
    const [notifications, setNotifications] = useState<Notification | null>(null);
    const [modalMessage, setModalMessage] = useState('');

    useEffect(() => {
        const handleGetNotifications = async () => {
            const res = await fetch('/api/notifications/get-notifications', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const data = await res.json();
            console.log(data, 88);

            setNotifications(data);
            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
        };

        if (userId) handleGetNotifications();
    }, [userId]);

    return (
        <AppContext.Provider
            value={{
                userId,
                showPopup,
                defaultCategories,
                notifications,
                modalMessage,
                setModalMessage,
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
