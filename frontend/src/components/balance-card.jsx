'use client';

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx';
import { DepositDialog } from './deposit-dialog.jsx';
import { WithdrawDialog } from './withdraw-dialog.jsx';
import React, { useCallback, useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";

const WALLET_SERVICE_URL = "http://localhost:8080/wallet-service/wallets";
const TRANSACTION_SERVICE_URL = "http://localhost:8080/transaction-service/api/transactions";

// should be handled by backend this is for testing only
const SYSTEM_WALLET_ID = "00000000-0000-0000-0000-000000000001";


export function BalanceCard() {
    const [balance, setBalance] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();
    const [amount, setAmount] = useState('');

    const user = React.useMemo(() => JSON.parse(localStorage.getItem('userData')), []);
    const token = localStorage.getItem('authToken');

    const fetchBalance = useCallback(async () => {
        if (!user?.id || !token) return;

        try {
            const response = await fetch(`${WALLET_SERVICE_URL}/balance/${user.id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
            });
            if (!response.ok) {
                throw new Error("Failed to fetch balance.");
            }
            const data = await response.json();
            setBalance(data);
        } catch (error) {
            console.error("Balance fetch error:", error);
            toast({
                title: 'Error',
                description: 'Could not retrieve your current balance.',
                variant: 'destructive',
            });
        }
    }, [user, token, toast]);

    useEffect(() => {
        fetchBalance();
    }, [fetchBalance]);

    const handleTransaction = async (type) => {
        if (!amount || isNaN(amount) || amount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid positive amount.',
                variant: 'destructive',
            });
            return;
        }
        if (!user?.walletId) {
            toast({
                title: 'Error',
                description: 'User wallet information is missing.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);

        const transactionPayload = {
            type: type,
            amount: parseFloat(amount),
            toWalletId: type === 'DEPOSIT' ? user.walletId : SYSTEM_WALLET_ID,
            fromWalletId: type === 'WITHDRAWAL' ? user.walletId : SYSTEM_WALLET_ID,
            category: type,
            description: `Funds ${type.toLowerCase()}ed via web application`,
        };

        try {
            const response = await fetch(TRANSACTION_SERVICE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(transactionPayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || `${type} failed. Please try again.`);
            }

            toast({
                title: `${type.charAt(0) + type.slice(1).toLowerCase()} Successful`,
                description: `Your transaction of ${formattedAmount(amount)} has been processed.`,
                variant: 'success',
            });

            setAmount('');
            await fetchBalance();

        } catch (error) {
            toast({
                title: `${type.charAt(0) + type.slice(1).toLowerCase()} Failed`,
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const formattedAmount = (num) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(num);

    return (
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardDescription>Available Balance</CardDescription>
                <CardTitle className="text-4xl font-headline">{formattedAmount(balance)}</CardTitle>
            </CardHeader>
            <CardContent>
                {/* mini charts could go here */}
            </CardContent>
            <CardFooter className="gap-2">
                <DepositDialog
                    amount={amount}
                    setAmount={setAmount}
                    handleDeposit={() => handleTransaction('DEPOSIT')}
                    isSubmitting={isSubmitting}
                />
                <WithdrawDialog
                    amount={amount}
                    setAmount={setAmount}
                    handleWithdraw={() => handleTransaction('WITHDRAWAL')}
                    isSubmitting={isSubmitting}
                />
            </CardFooter>
        </Card>
    );
}
