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

export function BalanceCard(props) {
  const user = getAuthenticatedUser();
  const formattedBalance = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(props.balance);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardDescription>Available Balance</CardDescription>
        <CardTitle className="text-4xl font-headline">{formattedBalance}</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder for a mini-chart if needed */}
      </CardContent>
      <CardFooter className="gap-2">
        <DepositDialog />
        <WithdrawDialog />
      </CardFooter>
    </Card>
  );
}
