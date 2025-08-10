'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState} from 'react';
import {Notification, Profile} from '~/utils/interface';

interface AppContextProps {
    showPopup: boolean;
    user: {token: string; userId: string | undefined; userName: string | undefined} | null;
    defaultCategories: {
        name: string;
        description: string | null;
    }[];
    setDefaultCategories: React.Dispatch<
        React.SetStateAction<
            {
                name: string;
                description: string | null;
            }[]
        >
    >;
    notifications: Notification | null;
    modalMessage: string;
    profile: Profile | null;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<
        React.SetStateAction<{token: string; userId: string | undefined; userName: string | undefined} | null>
    >;
    setModalMessage: React.Dispatch<React.SetStateAction<string>>;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
}

const AppContext = createContext<AppContextProps | undefined>(undefined);

export const AppProvider = ({children}: {children: ReactNode}) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [user, setUser] = useState<{token: string; userId: string | undefined; userName: string | undefined} | null>(
        null
    );
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

            setNotifications(data);
            if (!res.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
        };

        if (user?.userId) handleGetNotifications();
    }, [user]);

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
            } catch (err: any) {
                console.log(err.message || 'Something went wrong');
            }
        };
        fetchItems();
    }, []);

    // Initialize user state from auth endpoint
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                console.log('Auth check response:', data);
                if (data.isAuthenticated && data.user) {
                    console.log('Setting user:', data.user);
                    setUser(data.user);
                } else {
                    console.log('User not authenticated');
                }
            } catch (error) {
                // User not authenticated, keep user as null
                console.log('Error checking auth:', error);
            }
        };
        
        initializeAuth();
    }, []);

    return (
        <AppContext.Provider
            value={{
                user,
                showPopup,
                defaultCategories,
                notifications,
                modalMessage,
                profile,
                setModalMessage,
                setUser,
                setShowPopup,
                setProfile,
                setDefaultCategories
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
