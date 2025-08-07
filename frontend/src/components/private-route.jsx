'use client';

import { useAuth } from '@/context/auth-context.js';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader } from 'lucide-react';
import {toast} from "@/hooks/use-toast";

export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    const {user} = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            toast({
                title: 'Authentication failed',
                description: `Authentication failed!`,
                variant: 'destructive',
            });
            router.push('/login');
        }else{
            // user.role === "user"?router.push("/dashboard"):router.push("/admin");
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
