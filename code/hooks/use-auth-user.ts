import { useState, useEffect } from 'react';

export interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    image?: string;
}

export function useAuthUser() {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/auth/me');
            if (res.ok) {
                const data = await res.json();
                setUser(data.user);
            } else {
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();

        const handleAuthChange = () => {
            fetchUser();
        };

        window.addEventListener('auth-change', handleAuthChange);
        return () => window.removeEventListener('auth-change', handleAuthChange);
    }, []);

    const logout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            window.dispatchEvent(new Event('auth-change'));
            window.location.href = '/';
        } catch (error) {
            console.error('Failed to logout:', error);
        }
    };

    return { user, loading, logout, refetch: fetchUser };
}
