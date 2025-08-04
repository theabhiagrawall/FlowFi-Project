'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button.jsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form.jsx';
import { Input } from '@/components/ui/input.jsx';
import { useToast } from '@/hooks/use-toast.js';
import { Alert, AlertDescription, AlertTitle } from './ui/alert.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/data.js';

const formSchema = z.object({
  aadhar: z
    .string()
    .regex(/^\d{12}$/, "Aadhar must be a 12-digit number."),
  pan: z
    .string()
    .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Enter valid PAN (e.g., ABCDE1234F)."),
  document: z
    .any()
    .refine((files) => files?.length === 1, "Document is required."),
});

export function KycForm() {
  const { toast } = useToast();
  const user = getAuthenticatedUser();
  const kycStatus = user.kycStatus;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    console.log(values);
    toast({
      title: 'KYC Submitted',
      description: 'Your documents are under review. This may take up to 24 hours.',
    });
  }

  if (kycStatus === 'verified') {
    return (
      <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
        <CheckCircle className="h-5 w-5 !text-green-500" />
        <AlertTitle className="font-headline">You are verified!</AlertTitle>
        <AlertDescription>
          Your identity has been successfully verified. You have access to all features.
        </AlertDescription>
      </Alert>
    );
  }

  if (kycStatus === 'pending') {
    return (
      <Alert>
        <Clock className="h-5 w-5" />
        <AlertTitle className="font-headline">Pending Review</AlertTitle>
        <AlertDescription>
          Your documents have been submitted and are currently under review. We'll notify you once the process is complete.
        </AlertDescription>
      </Alert>
    );
  }

  if (kycStatus === 'rejected') {
    return (
      <Alert variant="destructive">
        <XCircle className="h-5 w-5" />
        <AlertTitle className="font-headline">Verification Failed</AlertTitle>
        <AlertDescription>
          There was an issue with your document. Please check the requirements and submit again.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="aadhar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aadhar Card Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter 12-digit Aadhar number" {...field} maxLength={12} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="pan"
          render={({ field }) => (
            <FormItem>
              <FormLabel>PAN Card Number</FormLabel>
              <FormControl>
                <Input placeholder="Enter PAN (e.g. ABCDE1234F)" {...field} maxLength={10} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="document"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upload Document</FormLabel>
              <FormControl>
                <Input type="file" onChange={(e) => field.onChange(e.target.files)} />
              </FormControl>
              <FormDescription>
                Please upload a clear image of your selected document.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit for Verification</Button>
      </form>
    </Form>
  );
}
