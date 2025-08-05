'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.jsx';
import { getAuthenticatedUser } from '@/lib/data.js';
import { DepositDialog } from './deposit-dialog.jsx';
import { WithdrawDialog } from './withdraw-dialog.jsx';
import React, {useEffect, useState} from "react";
import {useToast} from "@/hooks/use-toast";

export function BalanceCard(props) {
    const [balance, setBalance] =useState(0);
    const { toast } = useToast();
    const [amount, setAmount] = React.useState('');


    // userID for testing only fetch user id from user Object
    const user = JSON.parse(localStorage.getItem('userData'));
    const userID = user.id;
    const token = localStorage.getItem('authToken');
    const walletId = user.walletId;

    const fetchBalances = async () => {
        const balances = await fetch(`http://127.0.0.1:8080/wallet-service/wallets/balance/${userID}`,{
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
        });
        const data  = await balances.json();
        setBalance(data);
    }


    const handleDeposit = async () => {
        if (!amount || isNaN(amount) || amount <= 0) {
            toast({
                title: 'Invalid Amount',
                description: 'Please enter a valid amount to deposit.',
                variant: 'destructive',
            });
            return;
        }

        try {
            const response = await fetch('http://127.0.0.1:8080/wallet-service/wallets/credit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    walletId,
                    amount: parseFloat(amount),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Deposit failed');
            }

            toast({
                title: 'Deposit Successful',
                description: 'Your funds have been added to your account.',
            });

            // Optionally reset amount field
            setAmount('');
            setBalance(data.balance);
        } catch (error) {
            toast({
                title: 'Deposit Failed',
                description: error.message || 'An error occurred while depositing.',
                variant: 'destructive',
            });
        }
    };
    const handleWithdraw = async () => {
        toast({
            title: "Withdrawal Successful",
            description: "Funds have been withdrawn from your account.",
            variant: 'default',
        });

        try {
            const response = await fetch('http://127.0.0.1:8080/wallet-service/wallets/debit', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    walletId,
                    amount: parseFloat(amount),
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'withdraw failed');
            }

            toast({
                title: 'withdraw Successful',
                description: 'Your funds have been moved back to your account.',
            });

            // Optionally reset amount field
            setAmount('');
            setBalance(data.balance);
        } catch (error) {
            toast({
                title: 'Deposit Failed',
                description: error.message || 'An error occurred while depositing.',
                variant: 'destructive',
            });
        }
    };



    useEffect( ()=>{
         fetchBalances();
    },[])
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(balance);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardDescription>Available Balance</CardDescription>
        <CardTitle className="text-4xl font-headline">{formattedBalance}</CardTitle>
      </CardHeader>
      <CardContent>
      {/*  mini charts */}
      </CardContent>
      <CardFooter className="gap-2">
        <DepositDialog amount={amount} handleDeposit={handleDeposit}  setAmount={setAmount} />
          <WithdrawDialog
              amount={amount}
              setAmount={setAmount}
              handleWithdraw={handleWithdraw}
          />
      </CardFooter>
    </Card>
  );
}
