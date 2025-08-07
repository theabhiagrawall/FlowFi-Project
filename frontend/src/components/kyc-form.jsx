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
import { CheckCircle, Clock, XCircle, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/context/auth-context.js';
import * as React from 'react';

const allowedFileTypes = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/webp'
];

const formSchema = z.object({
    aadhar: z
        .string()
        .regex(/^\d{12}$/, 'Aadhar must be a 12-digit number.'),
    pan: z
        .string()
        .regex(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Enter valid PAN (e.g., ABCDE1234F).'),
    document: z
        .any()
        .refine(
            (files) => files?.length === 1,
            'Document is required.'
        )
        .refine(
            (files) => allowedFileTypes.includes(files?.[0]?.type),
            'Only PDF or image files are allowed.'
        ),
});

export function KycForm() {
    const { toast } = useToast();
    const { user, setUser } = useAuth();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [previewUrl, setPreviewUrl] = React.useState(null);
    // --- NEW: State for loading the document viewer ---
    const [isLoadingDocument, setIsLoadingDocument] = React.useState(false);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            aadhar: '',
            pan: '',
        }
    });

    async function onSubmit(values) {
        setIsSubmitting(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!user?.id || !token) {
                throw new Error("Authentication failed. Please log in again.");
            }

            // Step 1: Submit KYC Info (Aadhar, PAN) to User Service
            const kycInfoPayload = {
                aadharNumber: values.aadhar,
                panNumber: values.pan,
            };

            const kycInfoRes = await fetch(`http://localhost:8080/user-service/users/kyc/${user.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(kycInfoPayload),
            });

            if (!kycInfoRes.ok) {
                const errorData = await kycInfoRes.json();
                throw new Error(errorData.message || "Failed to submit KYC information.");
            }

            // Step 2: Upload the document file to Admin Service
            const file = values.document[0];
            const formData = new FormData();
            formData.append('file', file);

            const fileUploadRes = await fetch(`http://localhost:8080/admin-service/kyc-documents/upload/${user.id}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!fileUploadRes.ok) {
                const errorData = await fileUploadRes.json();
                throw new Error(errorData.message || "Failed to upload document.");
            }

            toast({
                title: 'KYC Submitted Successfully!',
                description: 'Your documents are now under review.',
            });

            // Update user's status globally to 'pending'
            const updatedUser = { ...user, kycStatus: 'pending' };
            setUser(updatedUser);
            localStorage.setItem('userData', JSON.stringify(updatedUser));

        } catch (error) {
            toast({
                title: 'Submission Failed',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    // --- NEW: Function to handle viewing the verified document ---
    const handleViewDocument = async () => {
        setIsLoadingDocument(true);
        try {
            const token = localStorage.getItem('authToken');
            if (!user?.id || !token) throw new Error("Authentication failed.");

            const response = await fetch(`http://localhost:8080/admin-service/kyc-documents/view/${user.id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) throw new Error("Could not retrieve document.");

            // Get the file as a blob and create a temporary URL to open it
            const fileBlob = await response.blob();
            const documentUrl = URL.createObjectURL(fileBlob);
            window.open(documentUrl, '_blank');

        } catch (error) {
            toast({
                title: 'Failed to Load Document',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setIsLoadingDocument(false);
        }
    };

    const kycStatus = user?.kycStatus;

    if (!user) {
        return <div>Loading user data...</div>; // Or a skeleton loader
    }

    if (kycStatus === 'verified') {
        return (
            <Alert variant="default" className="bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300">
                <CheckCircle className="h-5 w-5 !text-green-500" />
                <AlertTitle className="font-headline">You are verified!</AlertTitle>
                <AlertDescription className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <span>Your identity has been successfully verified.</span>
                    {/* --- NEW: Button to view the document --- */}
                    <Button
                        variant="outline"
                        size="sm"
                        className="mt-2 sm:mt-0 bg-green-100/50 hover:bg-green-100 border-green-300"
                        onClick={handleViewDocument}
                        disabled={isLoadingDocument}
                    >
                        {isLoadingDocument ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <Eye className="mr-2 h-4 w-4" />
                        )}
                        View Document
                    </Button>
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
                {/* Aadhaar */}
                <FormField
                    control={form.control}
                    name="aadhar"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Aadhar Card Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter 12-digit Aadhar number"
                                    {...field}
                                    maxLength={12}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* PAN */}
                <FormField
                    control={form.control}
                    name="pan"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>PAN Card Number</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="Enter PAN (e.g. ABCDE1234F)"
                                    {...field}
                                    maxLength={10}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* Document Upload */}
                <FormField
                    control={form.control}
                    name="document"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Upload Document</FormLabel>
                            <FormControl>
                                <div className="flex items-center gap-2">
                                    <Input
                                        type="file"
                                        accept=".pdf,image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            field.onChange(e.target.files);

                                            if (previewUrl) URL.revokeObjectURL(previewUrl);

                                            if (file && allowedFileTypes.includes(file.type)) {
                                                setPreviewUrl(URL.createObjectURL(file));
                                            } else {
                                                setPreviewUrl(null);
                                            }
                                        }}
                                    />
                                    <Button
                                        type="button"
                                        variant="outline"
                                        disabled={!previewUrl}
                                        onClick={() =>
                                            previewUrl && window.open(previewUrl, '_blank')
                                        }
                                    >
                                        <Eye className="h-4 w-4 mr-2" /> Preview
                                    </Button>
                                </div>
                            </FormControl>
                            <FormDescription>
                                Please upload a clear image or PDF of your document.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {isSubmitting ? "Submitting..." : "Submit for Verification"}
                </Button>
            </form>
        </Form>
    );
}
