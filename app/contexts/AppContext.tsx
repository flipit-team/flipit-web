'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Notification, Profile} from '~/utils/interface';

interface AppContextProps {
    showPopup: boolean;
    userId: number | null;
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    notifications: Notification | null;
    modalMessage: string;
    profile: Profile | null;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUserId: React.Dispatch<React.SetStateAction<number | null>>;
    setModalMessage: React.Dispatch<React.SetStateAction<string>>;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [userId, setUserId] = useState<number | null>(null);
    const [defaultCategories, setDefaultCategories] = useState<{name: string; description: string | null}[]>([]);
    const [notifications, setNotifications] = useState<Notification | null>(null);
    const [modalMessage, setModalMessage] = useState('');
    const [profile, setProfile] = useState<Profile | null>(null);

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

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const res = await fetch(`/api/profile/get-profile`, {
                    cache: 'no-store'
                });

                if (!res.ok) {
                    const errData = await res.json();
                    throw new Error(errData.apierror?.message || 'Failed to fetch items');
                }

                const data = await res.json();
                setProfile(data);
                console.log(data, 77);
            } catch (err: any) {
                console.log(err.message || 'Something went wrong');
            }
        };
        fetchItems();
    }, []);

    return (
        <AppContext.Provider
            value={{
                userId,
                showPopup,
                defaultCategories,
                notifications,
                modalMessage,
                profile,
                setModalMessage,
                setUserId,
                setShowPopup,
                setProfile
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
