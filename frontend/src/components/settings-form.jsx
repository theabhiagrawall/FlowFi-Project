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
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Left Column: Avatar + Phone */}
                <div className="space-y-6">
                    <FormField
                        control={form.control}
                        name="profilePicture"
                        render={() => (
                            <FormItem className="flex flex-col items-center gap-4">
                                <Avatar className="h-28 w-28">
                                    <AvatarImage src={user.avatar} data-ai-hint="woman portrait" />
                                    <AvatarFallback>{user.name?.[0] || 'A'}</AvatarFallback>
                                </Avatar>
                            </FormItem>
                        )}
                    />

                    {/* Phone Number (Read-only) */}
                    <FormItem className="w-full">
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input
                                type="text"
                                value={user.phoneNumber || ''}
                                disabled
                                className="bg-muted cursor-not-allowed"
                            />
                        </FormControl>
                    </FormItem>
                </div>

                {/* Right Column: Editable Fields */}
                <div className="space-y-6">
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

                    <Button type="submit" className="mt-4">Save Changes</Button>
                </div>
            </form>
        </Form>
    );
}
