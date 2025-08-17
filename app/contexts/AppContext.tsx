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

interface AppProviderProps {
    children: ReactNode;
    initialUser?: {token: string; userId: string | undefined; userName: string | undefined} | null;
}

export const AppProvider = ({children, initialUser}: AppProviderProps) => {
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [user, setUser] = useState<{token: string; userId: string | undefined; userName: string | undefined} | null>(
        initialUser || null
    );
    const [isInitialized, setIsInitialized] = useState<boolean>(false);
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

    // Client-side auth validation on mount
    useEffect(() => {
        const validateAuth = async () => {
            if (typeof window === 'undefined') return; // Server-side skip
            
            try {
                const response = await fetch('/api/auth/validate', { 
                    credentials: 'include',
                    cache: 'no-store' 
                });
                
                if (response.ok) {
                    const userData = await response.json();
                    if (userData.isAuthenticated && userData.user) {
                        const validatedUser = {
                            token: 'managed-by-cookies',
                            userId: userData.user.id?.toString(),
                            userName: userData.user.firstName || userData.user.username || userData.user.email || ''
                        };
                        console.log('🔄 Client-side auth validation successful:', validatedUser);
                        setUser(validatedUser);
                    } else {
                        console.log('🔄 Client-side auth validation failed: user not authenticated');
                        setUser(null);
                    }
                } else {
                    console.log('🔄 Client-side auth validation failed: response not ok');
                    setUser(null);
                }
            } catch (error) {
                console.log('🔄 Client-side auth validation error:', error);
                // Keep existing user state on error (might be network issue)
            } finally {
                setIsInitialized(true);
            }
        };

        // Only validate if we don't have initial user or if user state seems inconsistent
        if (!isInitialized) {
            validateAuth();
        }
    }, [isInitialized]);

    // Log user state changes for debugging
    useEffect(() => {
        console.log('🏪 AppContext user state changed:', user ? 'USER SET' : 'NO USER', user);
    }, [user]);

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
