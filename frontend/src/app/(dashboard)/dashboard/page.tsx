'use client';

import { BalanceCard } from '@/components/balance-card';
import FavoriteContacts from '@/components/favorite-contacts';
import RecentTransactions from '@/components/recent-transactions';
import UserSearch from '@/components/user-search';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard />
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
    </div>
  );
}
