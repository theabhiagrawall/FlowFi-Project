'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils.js";
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge.jsx';
import { format } from 'date-fns';

// Icon component to show distinct icons for each transaction type
const TransactionIcon = ({ type }) => {
  switch (type) {
    case 'DEPOSIT':
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case 'WITHDRAWAL':
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case 'TRANSFER':
      return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

// Helper function to determine the color of the status badge
const getStatusColor = (status) => {
  switch (status) {
    case 'SUCCESS':
      return 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 border-green-300/50';
    case 'FAILED':
      return 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400 border-red-300/50';
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400 border-yellow-300/50';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/40 dark:text-gray-400 border-gray-300/50';
  }
};


export default function RecentTransactions() {
  const [currentUser, setCurrentUser] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  // New state to store names of transaction parties, mapping walletId to name
  const [partyNames, setPartyNames] = React.useState({});

  // Get current user from localStorage on component mount
  React.useEffect(() => {
    const userDataString = localStorage.getItem('userData');
    if (userDataString) {
      setCurrentUser(JSON.parse(userDataString));
    } else {
      setLoading(false);
    }
  }, []);

  // Fetch transactions and enrich with user names
  React.useEffect(() => {
    if (!currentUser?.walletId) {
      return;
    }

    const fetchAndEnrichTransactions = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('authToken');
        const transactionUrl = `http://localhost:8080/transaction-service/api/transactions/wallet/${currentUser.walletId}`;

        const response = await fetch(transactionUrl, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!response.ok) throw new Error('Failed to fetch transactions.');

        let data = await response.json();

        if (Array.isArray(data)) {
          data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const recentTxs = data.slice(0, 10);
          setTransactions(recentTxs);

          // --- NEW: Fetch names for transfer parties ---
          const walletIdsToFetch = new Set();
          recentTxs.forEach(tx => {
            if (tx.type === 'TRANSFER') {
              const isOutgoing = tx.fromWalletId?.toLowerCase() === currentUser.walletId?.toLowerCase();
              const otherWalletId = isOutgoing ? tx.toWalletId : tx.fromWalletId;
              if (otherWalletId) {
                walletIdsToFetch.add(otherWalletId);
              }
            }
          });

          // Fetch names for all unique wallet IDs
          const namePromises = Array.from(walletIdsToFetch).map(async (walletId) => {
            try {
              // Step 1: Get user ID from wallet ID
              const walletRes = await fetch(`http://localhost:8080/wallet-service/wallets/${walletId}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (!walletRes.ok) return [walletId, 'Unknown User'];
              const walletData = await walletRes.json();

              // Step 2: Get user name from user ID
              const userRes = await fetch(`http://localhost:8080/user-service/users/${walletData.userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
              if (!userRes.ok) return [walletId, 'Unknown User'];
              const userData = await userRes.json();

              return [walletId, userData.name];
            } catch {
              return [walletId, 'Unknown User'];
            }
          });

          const names = Object.fromEntries(await Promise.all(namePromises));
          setPartyNames(names);
        }
      } catch (err) {
        console.error("Error fetching recent transactions:", err);
        setTransactions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAndEnrichTransactions();
  }, [currentUser]);

  const formatCurrency = (amount) =>
      new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
      }).format(amount);

  return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Recent Transactions</CardTitle>
            <CardDescription>Your last 10 transactions.</CardDescription>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href="/history">View All</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </div>
          ) : transactions.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Transaction</TableHead>
                    <TableHead className="hidden sm:table-cell">Status</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((tx) => {
                    const isOutgoing = tx.type === 'WITHDRAWAL' ||
                        (tx.type === 'TRANSFER' && tx.fromWalletId?.toLowerCase() === currentUser.walletId?.toLowerCase());
                    const amountColor = isOutgoing ? 'text-red-500' : 'text-green-500';
                    const amountPrefix = isOutgoing ? '-' : '+';

                    let transactionPartyInfo = '';
                    if (tx.type === 'DEPOSIT') {
                      transactionPartyInfo = 'From: System';
                    } else if (tx.type === 'WITHDRAWAL') {
                      transactionPartyInfo = 'To: System';
                    } else if (tx.type === 'TRANSFER') {
                      const otherWalletId = isOutgoing ? tx.toWalletId : tx.fromWalletId;
                      const otherPartyName = partyNames[otherWalletId] || `...${otherWalletId.slice(-6)}`;
                      transactionPartyInfo = isOutgoing ? `To: ${otherPartyName}` : `From: ${otherPartyName}`;
                    }

                    return (
                        <TableRow key={tx.id}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                                                <span className="p-2 bg-muted rounded-full">
                                                    <TransactionIcon type={tx.type} />
                                                </span>
                              <div>
                                <p className="font-medium">{tx.description || 'N/A'}</p>
                                <p className="text-sm text-muted-foreground">
                                  {transactionPartyInfo}
                                </p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="hidden sm:table-cell">
                            <Badge variant="outline" className={cn("capitalize", getStatusColor(tx.status))}>
                              {tx.status.toLowerCase()}
                            </Badge>
                          </TableCell>
                          <TableCell className={cn("text-right font-semibold", amountColor)}>
                            {amountPrefix}{formatCurrency(tx.amount)}
                          </TableCell>
                        </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
          ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No transactions found.</p>
              </div>
          )}
        </CardContent>
      </Card>
  );
}
