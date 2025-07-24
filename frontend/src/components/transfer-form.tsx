'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { ArrowRight } from 'lucide-react';

const formSchema = z.object({
  recipient: z.string().min(2, {
    message: 'Please select a recipient.',
  }),
  amount: z.coerce.number().positive({
    message: 'Amount must be positive.',
  }),
  note: z.string().optional(),
});

export function TransferForm() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: '',
      amount: undefined,
      note: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Transfer Successful',
      description: `You have sent $${values.amount} to ${values.recipient}.`,
    });
    form.reset();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="recipient"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Recipient</FormLabel>
              <FormControl>
                <Input placeholder="Search by name or email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amount (USD)</FormLabel>
              <FormControl>
                <Input type="number" placeholder="0.00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note (Optional)</FormLabel>
              <FormControl>
                <Input placeholder="e.g. for dinner" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Send Money <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </Form>
  );
}
