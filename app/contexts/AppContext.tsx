'use client';
import React, {createContext, ReactNode, useContext, useEffect, useState, useCallback, useMemo} from 'react';
import {Profile} from '~/utils/interface';
import {UserService} from '~/services/user.service';

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
    modalMessage: string;
    profile: Profile | null;
    deleteConfirmCallback: (() => void) | null;
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
    const [modalMessage, setModalMessage] = useState('');
    const [profile, setProfile] = useState<Profile | null>(null);
    const [deleteConfirmCallback, setDeleteConfirmCallback] = useState<(() => void) | null>(null);

    // Fetch profile when user is available
    useEffect(() => {
        if (user && !profile) {
            UserService.getProfile().then(result => {
                if (result.data) {
                    const data = result.data as any;
                    setProfile(data.user || data);
                }
            }).catch(() => {});
        }
    }, [user, profile]);

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
                    } else {
                        setUser(null);
                    }
                }
                // For non-200 (500, network errors), keep existing state
            } catch (error) {
                // On network error, keep existing user state
                console.error('Auth validation error:', error);
            } finally {
                setIsInitialized(true);
            }
        };

        // Only validate once when component mounts
        if (!isInitialized) {
            validateAuth();
        }
    }, [isInitialized, initialUser]);

    const value = useMemo(() => ({
        user,
        showPopup,
        defaultCategories,
        modalMessage,
        profile,
        deleteConfirmCallback,
        setModalMessage,
        setUser,
        setShowPopup,
        setProfile,
        setDefaultCategories,
        setDeleteConfirmCallback
    }), [user, showPopup, defaultCategories, modalMessage, profile, deleteConfirmCallback]);

    return (
        <AppContext.Provider value={value}>
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
