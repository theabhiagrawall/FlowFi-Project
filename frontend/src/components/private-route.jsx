'use client';

import { useAuth } from '@/context/auth-context.js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';

export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthenticated, loading, router]);

    if (loading) {
        return (
            <div className="flex h-screen w-full items-center justify-center">
                <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Return null while redirecting
        return null;
    }

    return children;
}
