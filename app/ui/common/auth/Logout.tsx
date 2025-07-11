// components/LogoutButton.tsx
'use client';

import Cookies from 'js-cookie';
import {LogOutIcon} from 'lucide-react';
import {useRouter} from 'next/navigation';
interface Props {
    setShowFlyout: React.Dispatch<React.SetStateAction<boolean>>;
}
export default function LogoutButton(props: Props) {
    const router = useRouter();

    const handleLogout = async () => {
        // Optional: hit backend logout endpoint if using HttpOnly cookies
        await fetch('/api/auth/logout', {
            method: 'POST',
            credentials: 'include'
        });

        // Remove client-side cookies
        Cookies.remove('token', {path: '/'});
        Cookies.remove('userId', {path: '/'});
        props.setShowFlyout(false);
        window.location.href = '/home';
        router.refresh();
    };
    return (
        <button onClick={handleLogout} className='text-red-500 hover:text-red-700 font-medium flex items-center gap-2'>
            <LogOutIcon height={16} width={16} />
            Logout
        </button>
    );
}
