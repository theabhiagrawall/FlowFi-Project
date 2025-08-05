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
import { apiFetch } from '@/lib/api.js';
import { useToast } from '@/hooks/use-toast.js';
import * as React from 'react';

const formSchema = z.object({
    phoneNumber: z.string().length(10, {
    message: 'Please enter a valid 10-digit phone number.',
  }),
  password: z.string().min(8, {
    message: 'Password must be at least 8 characters.',
  }),
});

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values) {
      setIsLoading(true);
      try {
          const response = await fetch('http://localhost:8080/auth-service/api/auth/login', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(values),
          });
          const data = await response.json();
          if (!response.ok) {
              throw new Error(data.message || 'login failed.');
          }
          const { token, message, ...user } = data;
          if(token && user) {
              login(token, user);
          }
          toast({
              title: 'login Successful',
              description: 'Welcome to flow fi!',
          });
          if(user.role === "admin"){
              router.push('/admin');
          }else{
              router.push('/dashboard');
          }


      } catch (error) {
          toast({
              title: 'Login Failed',
                  description: error.message || 'Please check your credentials and try again.',
                  variant: 'destructive',
          });
      } finally {
          setIsLoading(false);
      }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="7817649824" {...field} />
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
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="text-sm text-center block">
        <p>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-primary hover:underline">
            Sign up
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
