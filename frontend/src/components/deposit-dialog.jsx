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
import { ArrowDownLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast.js';

export function DepositDialog() {
  const { toast } = useToast();

  const handleDeposit = () => {
    toast({
      title: "Deposit Successful",
      description: "Your funds have been added to your account.",
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <ArrowDownLeft className="mr-2 h-4 w-4" />
          Deposit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Deposit Funds</DialogTitle>
          <DialogDescription>
            Enter the amount you wish to deposit into your account.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="amount">Amount (INR)</Label>
            <Input id="amount" type="number" placeholder="100.00" />
          </div>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" onClick={handleDeposit}>
              Confirm Deposit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
