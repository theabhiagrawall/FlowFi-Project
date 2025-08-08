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
} from '@/components/ui/form.jsx';
import { Input } from '@/components/ui/input.jsx';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card.jsx';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context.js';
import { useToast } from '@/hooks/use-toast.js';
import * as React from 'react';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email({
        message: 'Please enter a valid email address.',
    }),
    phoneNumber: z.string().min(1, {
        message: 'Phone number is required.',
    }),
    password: z.string().min(8, {
        message: 'Password must be at least 8 characters.',
    }),
});

export function SignupForm() {
    const router = useRouter();
    const { login, isAuthenticated, loading: authLoading } = useAuth();
    const { toast } = useToast();
    const [isLoading, setIsLoading] = React.useState(false);

    React.useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/dashboard');
        }
    }, [isAuthenticated, authLoading, router]);


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            phoneNumber: '',
            password: '',
        },
    });

    async function onSubmit(values) {
        setIsLoading(true);
        try {
            const response = await fetch('http://localhost:8080/auth-service/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(values),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Registration failed.');
            }
            const { token, message, ...user } = data;
            if(token && user) {
                login(token, user);
            }
            toast({
                title: 'Registration Successful',
                description: 'Welcome to flow fi!',
                variant: 'success',
            });
            router.push('/dashboard');

        } catch (error) {
            toast({
                title: 'Registration Failed',
                description: error.message || 'Please check your details and try again.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }

    if (authLoading) {
        return <div>Loading...</div>; // Or return null;
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Create an Account</CardTitle>
                <CardDescription>Enter your details to get started with flow fi.</CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="John Doe" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="name@example.com" type="email" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="phoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="123-456-7890" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="********" {...field} disabled={isLoading} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full" disabled={isLoading}>
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </Button>
                    </form>
                </Form>
            </CardContent>
            <CardFooter className="text-sm text-center block">
                <p>
                    Already have an account?{' '}
                    <Link href="/login" className="text-primary hover:underline">
                        Sign in
                    </Link>
                </p>
            </CardFooter>
        </Card>
    );
}
