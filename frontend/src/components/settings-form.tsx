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
import { getAuthenticatedUser } from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Name must be at least 2 characters.',
  }),
  email: z.string().email(),
  profilePicture: z.any().optional(),
});

export function SettingsForm() {
  const { toast } = useToast();
  const user = getAuthenticatedUser();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: user.name,
      email: user.email,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Profile Updated',
      description: 'Your settings have been saved successfully.',
    });
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
