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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { CheckCircle } from 'lucide-react';

const formSchema = z.object({
  documentType: z.string({
    required_error: "Please select a document type.",
  }),
  document: z.any()
    .refine((files) => files?.length == 1, "Document is required.")
});

export function KycForm() {
  const { toast } = useToast();
  // Simulate KYC status
  const isVerified = false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'KYC Submitted',
      description: 'Your documents are under review. This may take up to 24 hours.',
    });
  }

  if (isVerified) {
      return (
        <Alert variant="default" className="bg-green-50 border-green-200 text-green-800">
            <CheckCircle className="h-5 w-5 !text-green-500" />
            <AlertTitle className="font-headline">You are verified!</AlertTitle>
            <AlertDescription>
            Your identity has been successfully verified. You have access to all features.
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
