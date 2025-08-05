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
import { useToast } from '@/hooks/use-toast.js';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar.jsx';
import { useAuth } from '@/context/auth-context.js';
import * as React from 'react';
import { Skeleton } from './ui/skeleton.jsx';

const formSchema = z.object({
    name: z.string().min(2, {
        message: 'Name must be at least 2 characters.',
    }),
    email: z.string().email(),
    profilePicture: z.any().optional(),
});

export function SettingsForm() {
    const { toast } = useToast();
    const { user } = useAuth();

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
        },
    });

    React.useEffect(() => {
        // When the user object is available, reset the form with their data.
        // This ensures the form is controlled with the correct values from the start.
        if (user) {
            form.reset({
                name: user.name || '',
                email: user.email || '',
            });
        }
    }, [user, form]);


    function onSubmit(values) {
        console.log(values);
        toast({
            title: 'Profile Updated',
            description: 'Your settings have been saved successfully.',
        });
    }

    // Display a loading state until the user data is available.
    // This prevents the form from rendering with undefined values.
    if (!user) {
        return (
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="grid gap-1.5 flex-1">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-10 w-full" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
        );
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="profilePicture"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-4">
                            <Avatar className="h-20 w-20">
                                <AvatarImage src={user.avatar} data-ai-hint="woman portrait"/>
                                <AvatarFallback>A</AvatarFallback>
                            </Avatar>
                            <div className="grid gap-1.5">
                                <FormLabel>Profile Picture</FormLabel>
                                <FormControl>
                                    <Input type="file" className="w-full" onChange={(e) => field.onChange(e.target.files)} />
                                </FormControl>
                            </div>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Full Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Your name" {...field} />
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
                            <FormLabel>Email Address</FormLabel>
                            <FormControl>
                                <Input type="email" placeholder="Your email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Save Changes</Button>
            </form>
        </Form>
    );
}
