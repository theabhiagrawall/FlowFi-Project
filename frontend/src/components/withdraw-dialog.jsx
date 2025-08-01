'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog.jsx';
import { Button } from '@/components/ui/button.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Label } from '@/components/ui/label.jsx';
import { ArrowUpRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

export function WithdrawDialog() {
  const { toast } = useToast();

  const handleWithdraw = () => {
    toast({
      title: "Withdrawal Successful",
      description: "Funds have been withdrawn from your account.",
      variant: 'default',
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">
          <ArrowUpRight className="mr-2 h-4 w-4" />
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Withdraw Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to withdraw from your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Amount (USD)</Label>
            <Input id="amount" type="number" placeholder="50.00" />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" onClick={handleWithdraw}>
              Confirm Withdrawal
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
