'use client';

import { BalanceCard } from '@/components/balance-card.jsx';
import FavoriteContacts from '@/components/favorite-contacts.jsx';
import RecentTransactions from '@/components/recent-transactions.jsx';
import UserSearch from '@/components/user-search.jsx';
import {useEffect, useState} from "react";

export default function DashboardPage() {
    const [balance, setBalance] =useState(0);
    // userID for testing only fetch user id from user Object
    const userID = "624af6c9-1c32-4581-ac80-7266e31567b4";
    const fetchBalances = async () => {
        const balances = await fetch(`http://127.0.0.1:8080/wallet-service/wallets/balance/${userID}`);
        const data  = await balances.json();
        setBalance(data);
    }
    useEffect(()=>{
        fetchBalances();
    },[balance])
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold font-headline">Dashboard</h1>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <BalanceCard balance={balance} />
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
