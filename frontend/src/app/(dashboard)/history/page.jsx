    'use client';

    import * as React from 'react';
    import {
        Table,
        TableBody,
        TableCell,
        TableHead,
        TableHeader,
        TableRow,
        TableCaption,
    } from "@/components/ui/table.jsx";
    import {
        Card,
        CardContent,
        CardDescription,
        CardHeader,
        CardTitle,
    } from "@/components/ui/card.jsx";
    import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
    import { cn } from "@/lib/utils.js";
    import { format } from "date-fns";
    import { TransactionFilters } from '@/components/TransactionFilters.jsx';
    import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
    import { Terminal, Loader2 } from 'lucide-react';


    const TransactionFlowIcon = ({ type, fromWalletId, currentWalletId }) => {
        const isOutgoing = type === 'WITHDRAWAL' || (type === 'TRANSFER' && fromWalletId === currentWalletId);
        const Icon = isOutgoing ? ArrowUpRight : ArrowDownLeft;
        const color = isOutgoing ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10';

        return (
            <span className={cn("p-2 rounded-full", color)}>
          <Icon className="h-4 w-4" />
        </span>
        );
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

            const fetchTransactions = async () => {
                setLoading(true);
                setError(null);

                // Build the URL with query parameters from our filters state
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
                    const data = await response.json();
                    console.log(data);
                    setTransactions(Array.isArray(data) ? data : []);
                } catch (err) {
                    setError(err.message);
                    setTransactions([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchTransactions();
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
                const isOutgoing = tx.type === 'WITHDRAWAL' || (tx.type === 'TRANSFER' && tx.fromWalletId === currentUser.walletId);
                const amountColor = isOutgoing ? 'text-red-500' : 'text-green-500';
                const amountPrefix = isOutgoing ? '-' : '+';

                return (
                    <TableRow key={tx.id}>
                        <TableCell>
                            <div className="flex items-center gap-3">
                                <TransactionFlowIcon type={tx.type} fromWalletId={tx.fromWalletId} currentWalletId={currentUser.walletId} />
                                <div>
                                    <p className="font-medium">{tx.description || tx.category}</p>
                                    <p className="text-sm text-muted-foreground hidden md:block">
                                        {/* Placeholder for showing 'To/From' - needs API to provide user names
                                        will figure it out later*/}
                                        ID: ...{tx.id.slice(-6)}
                                    </p>
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="capitalize">{tx.type.toLowerCase()}</TableCell>
                        <TableCell>{format(new Date(tx.createdAt), 'MMM d, yyyy')}</TableCell>
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
                                    <TableHead>Transaction</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Date</TableHead>
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