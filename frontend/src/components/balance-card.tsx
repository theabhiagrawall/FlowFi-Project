'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getAuthenticatedUser } from '@/lib/data';
import { DepositDialog } from './deposit-dialog';
import { WithdrawDialog } from './withdraw-dialog';

export function BalanceCard() {
  const user = getAuthenticatedUser();
  const formattedBalance = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(user.balance);

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
