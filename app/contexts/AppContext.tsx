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
    deleteConfirmCallback: (() => void) | null;
    debugMode: boolean;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<
        React.SetStateAction<{token: string; userId: string | undefined; userName: string | undefined} | null>
    >;
    setModalMessage: React.Dispatch<React.SetStateAction<string>>;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
    setDeleteConfirmCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
    toggleDebugMode: () => void;
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
    const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);
    const [debugMode, setDebugMode] = useState<boolean>(false);

    // Initialize debug mode from localStorage
    useEffect(() => {
        const savedDebugMode = localStorage.getItem('debugMode');
        if (savedDebugMode !== null) {
            setDebugMode(JSON.parse(savedDebugMode));
        }
    }, []);

    const toggleDebugMode = () => {
        const newDebugMode = !debugMode;
        setDebugMode(newDebugMode);
        localStorage.setItem('debugMode', JSON.stringify(newDebugMode));

        // Refresh the page to apply debug mode changes
        window.location.reload();
    };

    return (
        <AppContext.Provider
            value={{
                user,
                showPopup,
                defaultCategories,
                notifications,
                modalMessage,
                profile,
                deleteConfirmCallback,
                debugMode,
                setModalMessage,
                setUser,
                setShowPopup,
                setProfile,
                setDefaultCategories,
                setDeleteConfirmCallback,
                toggleDebugMode
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
