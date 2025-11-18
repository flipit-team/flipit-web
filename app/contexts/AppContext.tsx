'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState, useCallback} from 'react';
import {Notification, Profile} from '~/utils/interface';
import NotificationsService from '~/services/notifications.service';

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
    refreshNotifications: () => Promise<void>;
    setShowPopup: React.Dispatch<React.SetStateAction<boolean>>;
    setUser: React.Dispatch<
        React.SetStateAction<{token: string; userId: string | undefined; userName: string | undefined} | null>
    >;
    setModalMessage: React.Dispatch<React.SetStateAction<string>>;
    setProfile: React.Dispatch<React.SetStateAction<Profile | null>>;
    setDeleteConfirmCallback: React.Dispatch<React.SetStateAction<(() => void) | null>>;
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

    // Fetch notifications with useCallback to avoid stale closures
    const refreshNotifications = useCallback(async () => {
        if (!user) return;

        try {
            const result = await NotificationsService.getNotifications({ page: 0, size: 50 });
            if (result.data) {
                setNotifications(result.data);
            }
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    }, [user]);

    // Fetch notifications when user is available
    useEffect(() => {
        if (user) {
            refreshNotifications();

            // Poll for new notifications every 30 seconds
            const interval = setInterval(refreshNotifications, 30000);

            return () => clearInterval(interval);
        }
    }, [user, refreshNotifications]);

    // Client-side auth validation on mount - ONLY run once and only if token exists
    useEffect(() => {
        const validateAuth = async () => {
            if (typeof window === 'undefined') return; // Server-side skip

            // If we already have a user from server-side rendering, trust it
            if (initialUser) {
                setIsInitialized(true);
                return;
            }

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
                        setUser(validatedUser);
                    }
                }
                // Don't clear user on validation failure - trust server-side
            } catch (error) {
                // Keep existing user state on error (might be network issue)
            } finally {
                setIsInitialized(true);
            }
        };

        // Only validate once when component mounts
        if (!isInitialized) {
            validateAuth();
        }
    }, [isInitialized, initialUser]);


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
                refreshNotifications,
                setModalMessage,
                setUser,
                setShowPopup,
                setProfile,
                setDefaultCategories,
                setDeleteConfirmCallback
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
