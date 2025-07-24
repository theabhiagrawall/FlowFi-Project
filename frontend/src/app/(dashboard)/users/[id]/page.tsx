
'use client';

import { useParams } from 'next/navigation';
import { users, transactions as allTransactions, getAuthenticatedUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

export default function UserTransactionPage() {
  const params = useParams();
  const { toast } = useToast();
  const { id: userId } = params;

  const currentUser = getAuthenticatedUser();
  const otherUser = users.find((u) => u.id === userId);

  const userTransactions = allTransactions.filter(
    (t) =>
      (t.from?.id === currentUser.id && t.to?.id === userId) ||
      (t.from?.id === userId && t.to?.id === currentUser.id)
  );

  const getInitials = (name: string) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  const handlePayment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const amount = e.currentTarget.amount.value;
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: 'Invalid Amount',
        description: 'Please enter a valid amount to send.',
        variant: 'destructive',
      });
      return;
    }
    toast({
      title: 'Payment Sent!',
      description: `You have sent $${amount} to ${otherUser?.name}.`,
    });
    e.currentTarget.reset();
  };
  
  const formatCurrency = (amount: number) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);

  if (!otherUser) {
    return (
        <div className="flex items-center justify-center h-full">
            <p>User not found.</p>
        </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))]">
      <header className="flex items-center gap-4 p-4 border-b">
        <Avatar>
          <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
          <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
        </Avatar>
        <h2 className="text-xl font-bold font-headline">{otherUser.name}</h2>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {userTransactions.length > 0 ? (
          userTransactions.map((tx) => {
            const fromSelf = tx.from?.id === currentUser.id;
            return (
              <div
                key={tx.id}
                className={cn(
                  'flex items-end gap-2',
                  fromSelf ? 'justify-end' : 'justify-start'
                )}
              >
                {!fromSelf && (
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
                     <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
                   </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-xs md:max-w-md rounded-lg px-4 py-2',
                    fromSelf
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="font-bold text-lg">{formatCurrency(tx.amount)}</p>
                  <p className="text-sm">{tx.description}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {format(new Date(tx.date), 'MMM d, h:mm a')}
                  </p>
                </div>
                 {fromSelf && (
                   <Avatar className="h-8 w-8">
                     <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                     <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
                   </Avatar>
                )}
              </div>
            );
          })
        ) : (
          <Card className="text-center p-12">
            <p className="text-muted-foreground">No transaction history with {otherUser.name}.</p>
            <p className="text-muted-foreground">Start by sending them a payment.</p>
          </Card>
        )}
      </main>

      <footer className="p-4 border-t">
        <form onSubmit={handlePayment} className="flex items-center gap-2">
          <Input
            name="amount"
            type="number"
            placeholder="Enter amount..."
            className="flex-1"
            step="0.01"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </footer>
    </div>
  );
}
