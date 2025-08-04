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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select.jsx"
import { useToast } from '@/hooks/use-toast.js';
import { Alert, AlertDescription, AlertTitle } from './ui/alert.jsx';
import { CheckCircle, Clock, XCircle } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/data.js';
import { useWatch } from 'react-hook-form';

const formSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type.",
  }),
  documentNumber: z.string()
    .min(6, "Document number must be at least 6 characters.")
    .max(20, "Too long!"),
});

export function KycForm() {
  const { toast } = useToast();
  const user = getAuthenticatedUser();
  const kycStatus = user.kycStatus;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  const selectedType = useWatch({
    control: form.control,
    name: 'documentType',
  });

  function onSubmit(values) {
    console.log(values);
    toast({
      title: 'KYC Submitted',
      description: 'Your document number has been submitted and is under review.',
    });
  }

  // KYC status alerts
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
          Your documents have been submitted and are currently under review.
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
          name="documentType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Document Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a document type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="aadhar">Aadhar Card</SelectItem>
                  <SelectItem value="pan">PAN Card</SelectItem>
                  <SelectItem value="passport">Passport</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {selectedType && (
          <FormField
            control={form.control}
            name="documentNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  {selectedType === 'aadhar' && 'Aadhar Number'}
                  {selectedType === 'pan' && 'PAN Number'}
                  {selectedType === 'passport' && 'Passport Number'}
                </FormLabel>
                <FormControl>
                  <Input placeholder="Enter your ID number" {...field} />
                </FormControl>
                <FormDescription>
                  Ensure the number matches the selected ID.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit">Submit for Verification</Button>
      </form>
    </Form>
  );
}
