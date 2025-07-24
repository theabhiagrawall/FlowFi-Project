
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { transactions, getAuthenticatedUser } from "@/lib/data";
import { ArrowDownLeft, ArrowUpRight, ArrowRightLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/lib/types";
import { format } from "date-fns";

const TransactionIcon = ({ type, fromId, currentUserId }: { type: Transaction['type'], fromId?: string, currentUserId: string }) => {
  if (type === 'deposit') {
    return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
  }
  if (type === 'withdrawal') {
    return <ArrowUpRight className="h-4 w-4 text-red-500" />;
  }
  if (type === 'transfer') {
    return fromId === currentUserId ? <ArrowUpRight className="h-4 w-4 text-red-500" /> : <ArrowDownLeft className="h-4 w-4 text-green-500" />;
  }
  return <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />;
};


export default function HistoryPage() {
    const currentUser = getAuthenticatedUser();

    const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);

    const getTransactionParty = (transaction: Transaction) => {
        if (transaction.type === 'deposit') return "Deposit";
        if (transaction.type === 'withdrawal') return "Withdrawal";
        
        const isSender = transaction.from?.id === currentUser.id;
        if (isSender && transaction.to) return `To: ${transaction.to.name}`;
        if (!isSender && transaction.from) return `From: ${transaction.from.name}`;
        
        return "Transfer";
    }

    const getAmountColor = (transaction: Transaction) => {
        if (transaction.type === 'deposit') return 'text-green-500';
        if (transaction.type === 'withdrawal') return 'text-red-500';
        if (transaction.type === 'transfer') {
            return transaction.from?.id === currentUser.id ? 'text-red-500' : 'text-green-500';
        }
        return 'text-foreground';
    }

    const getAmountPrefix = (transaction: Transaction) => {
        if (transaction.type === 'deposit') return '+';
        if (transaction.type === 'withdrawal') return '-';
        if (transaction.type === 'transfer') {
            return transaction.from?.id === currentUser.id ? '-' : '+';
        }
        return '';
    }

  return (
    <div className="space-y-6">
        <h1 className="text-3xl font-bold font-headline">Transaction History</h1>
        <Card>
            <CardHeader>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>
                A complete record of your account activity.
                </CardDescription>
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
                        {transactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                            <TableCell>
                                <div className="flex items-center gap-3">
                                    <span className="p-2 bg-muted rounded-full">
                                        <TransactionIcon type={transaction.type} fromId={transaction.from?.id} currentUserId={currentUser.id} />
                                    </span>
                                    <div>
                                        <p className="font-medium">{transaction.description}</p>
                                        <p className="text-sm text-muted-foreground hidden md:block">
                                            {getTransactionParty(transaction)}
                                        </p>
                                    </div>
                                </div>
                            </TableCell>
                            <TableCell className="capitalize">{transaction.type}</TableCell>
                            <TableCell>{format(new Date(transaction.date), 'MMM d, yyyy')}</TableCell>
                            <TableCell className={cn("text-right font-semibold", getAmountColor(transaction))}>
                                {getAmountPrefix(transaction)}{formatCurrency(transaction.amount)}
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    </div>
  );
}
