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
import { format } from "date-fns";
import { TransactionFilters } from '@/components/TransactionFilters.jsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { Terminal, Loader2 } from 'lucide-react';
import { Badge } from "@/components/ui/badge.jsx";


const TransactionFlowIcon = ({ type }) => {
    // Use a specific icon and color for each transaction type
    if (type === 'TRANSFER') {
        return (
            <span className="p-2 rounded-full bg-blue-500/10">
                <ArrowRightLeft className="h-4 w-4 text-blue-500" />
            </span>
        );
    }
    if (type === 'DEPOSIT') {
        return (
            <span className="p-2 rounded-full bg-green-500/10">
                <ArrowDownLeft className="h-4 w-4 text-green-500" />
            </span>
        );
    }
    if (type === 'WITHDRAWAL') {
        return (
            <span className="p-2 rounded-full bg-red-500/10">
                <ArrowUpRight className="h-4 w-4 text-red-500" />
            </span>
        );
    }
    return null; // Fallback for unknown types
};

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


export default function HistoryPage() {
    const [currentUser, setCurrentUser] = React.useState(null);
    const [transactions, setTransactions] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);
    const [filters, setFilters] = React.useState({
        type: null,
        dateRange: { from: undefined, to: undefined },
    });
    // --- NEW: State to store names of transaction parties ---
    const [partyNames, setPartyNames] = React.useState({});

    React.useEffect(() => {
        try {
            const userDataString = localStorage.getItem('userData');
            if (userDataString) {
                setCurrentUser(JSON.parse(userDataString));
            } else {
                throw new Error("You are not logged in.");
            }
        } catch (err) {
            setError("Could not load user data. Please log in again.");
            setLoading(false);
        }
    }, []);

    React.useEffect(() => {
        if (!currentUser?.walletId) {
            return;
        }

        const fetchAndEnrichTransactions = async () => {
            setLoading(true);
            setError(null);

            const params = new URLSearchParams();
            if (filters.type) params.append('type', filters.type);
            if (filters.dateRange.from) params.append('startDate', format(filters.dateRange.from, 'yyyy-MM-dd'));
            if (filters.dateRange.to) params.append('endDate', format(filters.dateRange.to, 'yyyy-MM-dd'));

            const queryString = params.toString();
            const url = `http://localhost:8080/transaction-service/api/transactions/wallet/${currentUser.walletId}${queryString ? `?${queryString}` : ''}`;

            try {
                const token = localStorage.getItem('authToken');
                const response = await fetch(url, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch transactions.');
                }
                let data = await response.json();

                if (Array.isArray(data)) {
                    data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    setTransactions(data);

                    // --- NEW: Logic to fetch names for transfer parties ---
                    const walletIdsToFetch = new Set();
                    data.forEach(tx => {
                        if (tx.type === 'TRANSFER') {
                            const isOutgoing = tx.fromWalletId?.toLowerCase() === currentUser.walletId?.toLowerCase();
                            const otherWalletId = isOutgoing ? tx.toWalletId : tx.fromWalletId;
                            if (otherWalletId) {
                                walletIdsToFetch.add(otherWalletId);
                            }
                        }
                    });

                    const namePromises = Array.from(walletIdsToFetch).map(async (walletId) => {
                        try {
                            const walletRes = await fetch(`http://localhost:8080/wallet-service/wallets/${walletId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                            if (!walletRes.ok) return [walletId, 'Unknown User'];
                            const walletData = await walletRes.json();

                            const userRes = await fetch(`http://localhost:8080/user-service/users/${walletData.userId}`, { headers: { 'Authorization': `Bearer ${token}` } });
                            if (!userRes.ok) return [walletId, 'Unknown User'];
                            const userData = await userRes.json();

                            return [walletId, userData.name];
                        } catch {
                            return [walletId, 'Unknown User'];
                        }
                    });

                    const names = Object.fromEntries(await Promise.all(namePromises));
                    setPartyNames(prev => ({ ...prev, ...names }));
                }
            } catch (err) {
                setError(err.message);
                setTransactions([]);
            } finally {
                setLoading(false);
            }
        };

        fetchAndEnrichTransactions();
    }, [currentUser, filters]);

    const formatCurrency = (amount) =>
        new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);

    const renderTableContent = () => {
        if (loading) {
            return (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        <div className="flex justify-center items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                            <p className="text-muted-foreground">Loading transactions...</p>
                        </div>
                    </TableCell>
                </TableRow>
            );
        }

        if (error) {
            return (
                <TableRow>
                    <TableCell colSpan={4}>
                        <Alert variant="destructive">
                            <Terminal className="h-4 w-4" />
                            <AlertTitle>Error!</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    </TableCell>
                </TableRow>
            );
        }

        if (!currentUser) {
            return (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        Authenticating user...
                    </TableCell>
                </TableRow>
            );
        }

        if (transactions.length === 0) {
            return (
                <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                        No transactions found for the selected filters.
                    </TableCell>
                </TableRow>
            );
        }

        return transactions.map((tx) => {
            const isOutgoing = tx.type === 'WITHDRAWAL' ||
                (tx.type === 'TRANSFER' && tx.fromWalletId?.toLowerCase() === currentUser.walletId?.toLowerCase());

            const amountColor = isOutgoing ? 'text-red-500' : 'text-green-500';
            const amountPrefix = isOutgoing ? '-' : '+';

            // --- UPDATED: Logic to display fetched names ---
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
                            <TransactionFlowIcon type={tx.type} />
                            <div className="flex-grow">
                                <p className="font-medium">{tx.description || 'N/A'}</p>
                                <div className="flex items-center gap-2 flex-wrap mt-1">
                                    <span className="text-xs text-muted-foreground">{transactionPartyInfo}</span>
                                    <span className="text-xs text-muted-foreground">•</span>
                                    <Badge variant="outline" className={cn("px-2 py-0.5 text-xs font-medium capitalize border", getStatusColor(tx.status))}>
                                        {tx.status.toLowerCase()}
                                    </Badge>
                                </div>
                            </div>
                        </div>
                    </TableCell>
                    <TableCell className="capitalize">{tx.category?.toLowerCase()}</TableCell>
                    <TableCell className="text-sm">
                        <div>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</div>
                        <div className="text-xs text-muted-foreground">{format(new Date(tx.createdAt), 'h:mm a')}</div>
                    </TableCell>
                    <TableCell className={cn("text-right font-semibold", amountColor)}>
                        {amountPrefix}{formatCurrency(tx.amount)}
                    </TableCell>
                </TableRow>
            );
        });
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Transaction History</h1>
            <Card>
                <CardHeader>
                    <CardTitle>All Transactions</CardTitle>
                    <CardDescription>A complete record of your account activity. Use the filters below to refine your search.</CardDescription>
                    <div className="pt-4">
                        <TransactionFilters filters={filters} setFilters={setFilters} disabled={loading || !!error} />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[45%]">Transaction Details</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Date & Time</TableHead>
                                <TableHead className="text-right">Amount</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {renderTableContent()}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
