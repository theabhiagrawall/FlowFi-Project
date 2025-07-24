'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { transactions } from '@/lib/data';
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Transaction } from '@/lib/types';
import { format } from 'date-fns';

const TransactionIcon = ({ type }: { type: Transaction['type'] }) => {
  switch (type) {
    case 'deposit':
      return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
    case 'withdrawal':
      return <ArrowUpRight className="h-4 w-4 text-red-500" />;
    case 'transfer':
      return <ArrowRightLeft className="h-4 w-4 text-blue-500" />;
    default:
      return null;
  }
};

export default function RecentTransactions() {
  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);

  const getTransactionParty = (transaction: Transaction) => {
    if (transaction.type === 'deposit') return "Deposit";
    if (transaction.type === 'withdrawal') return "Withdrawal";
    if (transaction.to) return `To: ${transaction.to.name}`;
    return "Transfer";
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transactions</CardTitle>
        <CardDescription>A list of your recent transactions.</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Transaction</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="hidden sm:table-cell text-right">Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <span className="p-2 bg-muted rounded-full">
                        <TransactionIcon type={transaction.type} />
                    </span>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-sm text-muted-foreground hidden md:block">
                        {getTransactionParty(transaction)}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell
                  className={cn(
                    'text-right font-semibold',
                    transaction.type === 'deposit' ? 'text-green-500' : 'text-foreground'
                  )}
                >
                  {transaction.type === 'deposit' ? '+' : '-'}{formatCurrency(transaction.amount)}
                </TableCell>
                <TableCell className="hidden sm:table-cell text-right text-muted-foreground">{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
