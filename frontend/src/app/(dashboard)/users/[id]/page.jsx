'use client';

import * as React from 'react';
import { useParams } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Send, Loader2, PartyPopper } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';
import { cn } from '@/lib/utils.js';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card.jsx';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';
import { Terminal } from 'lucide-react';
import Confetti from 'react-confetti';

const TransactionBubble = React.forwardRef(({ tx, currentUser, otherUser, isLast, triggerConfetti }, ref) => {
  if (!currentUser || !otherUser) return null;

  const fromSelf = tx.fromWalletId === currentUser.walletId;
  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);
  const getInitials = (name) => {
    if (!name) return "?";
    const names = name.split(" ");
    if (names.length > 1) return `${names[0][0]}${names[1][0]}`;
    return name.substring(0, 2);
  };

  return (
      <div ref={ref} className={cn('flex items-end gap-2 w-full', fromSelf ? 'justify-end' : 'justify-start')}>
        {!fromSelf && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{getInitials(otherUser.name)}</AvatarFallback>
            </Avatar>
        )}
        <div className={cn('relative max-w-xs md:max-w-md rounded-2xl px-4 py-2 shadow-md transition-transform transform hover:scale-105', fromSelf ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white dark:bg-slate-800 text-foreground rounded-bl-none')}>
          <p className="font-bold text-lg">{formatCurrency(tx.amount)}</p>
          {tx.description && <p className="text-sm">{tx.description}</p>}
          <p className="text-xs opacity-70 mt-1">{format(new Date(tx.createdAt), 'MMM d, h:mm a')}</p>
          {isLast && triggerConfetti && (
              <Confetti
                  recycle={false}
                  numberOfPieces={150}
                  width={300}
                  height={200}
                  className="absolute top-0 left-0"
                  style={{ zIndex: 50 }}
              />
          )}
        </div>
        {fromSelf && (
            <Avatar className="h-8 w-8">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback>{getInitials(currentUser.name)}</AvatarFallback>
            </Avatar>
        )}
      </div>
  );
});
TransactionBubble.displayName = 'TransactionBubble';


export default function UserTransactionPage() {
  const params = useParams();
  const { toast } = useToast();
  const { id: otherUserId } = params;

  const [currentUser, setCurrentUser] = React.useState(null);
  const [otherUser, setOtherUser] = React.useState(null);
  const [transactions, setTransactions] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [confettiTriggerId, setConfettiTriggerId] = React.useState(null);
  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    const initialLoad = async () => {
      setLoading(true);
      setError(null);
      try {
        const userDataString = localStorage.getItem('userData');
        const token = localStorage.getItem('authToken');
        if (!userDataString || !token) throw new Error("Authentication failed.");

        const loggedInUser = JSON.parse(userDataString);
        setCurrentUser(loggedInUser);

        const userRes = await fetch(`http://localhost:8080/user-service/users/${otherUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!userRes.ok) throw new Error("User not found.");
        const otherUserData = await userRes.json();

        const walletRes = await fetch(`http://localhost:8080/wallet-service/wallets/user/${otherUserId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!walletRes.ok) throw new Error("Could not find a wallet for this user.");
        const walletData = await walletRes.json();

        setOtherUser({ ...otherUserData, walletId: walletData.id });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    initialLoad();
  }, [otherUserId]);

  const fetchTransactions = React.useCallback(async () => {
    if (!currentUser?.walletId || !otherUser?.walletId) return;

    try {
      const token = localStorage.getItem('authToken');
      const response = await fetch(`http://localhost:8080/transaction-service/api/transactions/user/${otherUserId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error("Failed to fetch transaction history.");
      const allUserTransactions = await response.json();

      const filtered = allUserTransactions.filter(tx =>
          (tx.fromWalletId === currentUser.walletId && tx.toWalletId === otherUser.walletId) ||
          (tx.fromWalletId === otherUser.walletId && tx.toWalletId === currentUser.walletId)
      );

      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setTransactions(filtered);
    } catch (err) {
      setError(err.message);
    }
  }, [currentUser, otherUser, otherUserId]);

  React.useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [transactions]);

  const formatCurrency = (amount) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(amount || 0);

  const handlePayment = async (e) => {
    e.preventDefault();
    const formElement = e.currentTarget;
    const amountInput = formElement.elements.namedItem('amount');
    const noteInput = formElement.elements.namedItem('note');

    const amount = amountInput?.value;
    const note = noteInput?.value;

    if (!amount || parseFloat(amount) <= 0) {
      toast({ title: 'Invalid Amount', description: 'Please enter a valid amount.', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!otherUser?.walletId) throw new Error("Could not find recipient's wallet.");

      const payload = {
        fromWalletId: currentUser.walletId,
        toWalletId: otherUser.walletId,
        amount: parseFloat(amount),
        category: note || "General",
        type: "TRANSFER",
        description: note || `Payment to ${otherUser.name}`
      };
      const txRes = await fetch('http://localhost:8080/transaction-service/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      if (!txRes.ok) {
        const errorData = await txRes.json();
        throw new Error(errorData.message || "Transaction failed.");
      }
      const newTransaction = await txRes.json();

      toast({
        title: 'Payment Sent!',
        description: `You sent ${formatCurrency(amount)} to ${otherUser.name}.`,
        action: <PartyPopper className="h-5 w-5 text-green-500" />,
      });

      formElement.reset();
      await fetchTransactions();
      setConfettiTriggerId(newTransaction.id);
      setTimeout(() => setConfettiTriggerId(null), 5000);

    } catch (err) {
      toast({ title: 'Payment Failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading && !otherUser) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  if (error) {
    return (
        <div className="p-4">
          <Alert variant="destructive">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
    );
  }

  if (!otherUser) {
    return <div className="flex items-center justify-center h-screen"><p>User not found.</p></div>;
  }

  return (
      <>
        <style jsx global>{`
              .no-scrollbar::-webkit-scrollbar { display: none; }
              .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
            `}</style>
        <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] bg-slate-50 dark:bg-slate-900">
          <header className="flex-shrink-0 flex items-center gap-4 p-4 border-b bg-background shadow-sm">
            <Avatar>
              <AvatarImage src={otherUser.avatar} alt={otherUser.name} />
              <AvatarFallback>{otherUser.name ? otherUser.name.split(" ").map(n => n[0]).join("") : "?"}</AvatarFallback>
            </Avatar>
            <h2 className="text-xl font-bold font-headline">{otherUser.name}</h2>
          </header>

          <main className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar">
            {transactions.length > 0 ? (
                transactions.map((tx, index) => (
                    <TransactionBubble
                        key={tx.id}
                        ref={index === transactions.length - 1 ? messagesEndRef : null}
                        tx={tx}
                        currentUser={currentUser}
                        otherUser={otherUser}
                        isLast={index === transactions.length - 1}
                        triggerConfetti={tx.id === confettiTriggerId}
                    />
                ))
            ) : (
                <Card className="text-center p-12 bg-transparent border-dashed">
                  <p className="text-muted-foreground">No transaction history with {otherUser.name}.</p>
                  <p className="text-muted-foreground">Start by sending them a payment.</p>
                </Card>
            )}
          </main>

          <footer className="flex-shrink-0 p-4 border-t bg-background">
            <form onSubmit={handlePayment} className="grid grid-cols-1 md:grid-cols-3 gap-2 items-center">
              <Input name="amount" type="number" placeholder="₹0.00" className="md:col-span-1 text-lg" step="0.01" required />
              <Input name="note" type="text" placeholder="Add a note (e.g., Dinner)" className="md:col-span-1" />
              <Button type="submit" className="w-full md:w-auto md:col-span-1" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4 mr-2" />}
                {isSubmitting ? 'Sending...' : 'Send Payment'}
              </Button>
            </form>
          </footer>
        </div>
      </>
  );
}