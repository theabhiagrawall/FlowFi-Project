'use client';

import { BalanceCard } from '@/components/balance-card.jsx';
import FavoriteContacts from '@/components/favorite-contacts.jsx';
import RecentTransactions from '@/components/recent-transactions.jsx';
import UserSearch from '@/components/user-search.jsx';
import { useAuth } from '@/context/auth-context.js';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { Button } from '@/components/ui/button.jsx';
import { ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
    const { user } = useAuth();

    const isFullyVerified = user?.kycVerified && user?.emailVerified && user?.status === 'active';

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Dashboard</h1>



            {isFullyVerified ? (

                <>
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        <BalanceCard/>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">Send Money</h2>
                        <UserSearch />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">Quick Transfer</h2>
                        <FavoriteContacts />
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight mb-4 font-headline">Recent Activity</h2>
                        <RecentTransactions />
                    </div>
                </>
            ) : (
                <Alert
                    variant="destructive"
                    className="bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-800 dark:text-red-300 text-center p-6"
                >
                    <ShieldAlert className="h-6 w-6 mx-auto mb-2 text-red-500" />
                    <AlertTitle className="font-headline text-xl mb-1">
                        Verification Required
                    </AlertTitle>
                    <AlertDescription className="mb-4">
                        To send money and view your transaction history, please complete your verification process.
                    </AlertDescription>
                    <Button variant="destructive" className="bg-red-600 hover:bg-red-700" asChild>
                        <Link href="/settings">Go to Verification</Link>
                    </Button>
                </Alert>
            )}
        </div>
    );
}