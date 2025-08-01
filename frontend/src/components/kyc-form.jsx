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

const formSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type.",
  }),
  document: z.any()
    .refine((files) => files?.length == 1, "Document is required.")
});

export function KycForm() {
  const { toast } = useToast();
  // Simulate KYC status from user data
  const user = getAuthenticatedUser();
  const kycStatus = user.kycStatus;

  const form = useForm({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values) {
    console.log(values);
    // In a real app, this would upload the file and update the user's kycStatus to 'pending'
    toast({
      title: 'KYC Submitted',
      description: 'Your documents are under review. This may take up to 24 hours.',
    });
    // For simulation, we can just log it. A real implementation would trigger a state update.
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
      )
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
    )
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
    )
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
                  <SelectItem value="passport">Passport</SelectItem>
                  <SelectItem value="drivers_license">Driver's License</SelectItem>
                  <SelectItem value="national_id">National ID Card</SelectItem>
                </SelectContent>
              </Select>
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
