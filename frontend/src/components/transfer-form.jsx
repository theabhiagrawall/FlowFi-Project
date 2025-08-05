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
import { ArrowRight, Loader2, X } from 'lucide-react';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';

const formSchema = z.object({
    recipientId: z.string().min(1, { message: 'Please select a recipient.' }),
    amount: z.coerce.number().positive({
        message: 'Amount must be positive.',
    }),
    note: z.string().optional(),
});

export function TransferForm() {
    const { toast } = useToast();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [loading, setLoading] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const searchRef = React.useRef(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            recipientId: '',
            amount: '',
            note: '',
        },
    });

    const { setValue, handleSubmit, reset, watch, control } = form;
    const currentAmount = watch('amount');
    const currentNote = watch('note');

    // --- Data Fetching and State Logic (Unchanged) ---
    React.useEffect(() => {
        const fetchUsers = () => {
            setLoading(true);
            const token = localStorage.getItem('authToken');
            const headers = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            fetch(`http://localhost:8080/user-service/users/search?email=${search}`, { headers })
                .then((res) => res.json())
                .then((data) => {
                    console.log(data)
                    setSearchResults(Array.isArray(data) ? data : []);
                })
                .catch(() => setSearchResults([]))
                .finally(() => setLoading(false));
        };

        if (search.trim().length > 0 && !selectedUser) {
            const debounce = setTimeout(fetchUsers, 300);
            return () => clearTimeout(debounce);
        } else {
            setSearchResults([]);
        }
    }, [search, selectedUser]);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const getInitials = (name) => {
        if (!name) return "";
        const names = name.trim().split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.slice(0, 2).toUpperCase();
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setValue('recipientId', user.id, { shouldValidate: true });
        setSearch(user.name);
        setSearchResults([]); // Hide dropdown after selection
    };

    const clearRecipient = () => {
        setSelectedUser(null);
        setValue('recipientId', '');
        setSearch('');
        // Persist amount and note if user just wants to change recipient
        reset({
            recipientId: '',
            amount: currentAmount || '',
            note: currentNote || '',
        });
    };

    function onSubmit(values) {
        console.log({ ...values, recipientName: selectedUser.name });
        toast({
            title: 'Transfer Successful',
            description: `You have sent $${values.amount} to ${selectedUser.name}.`,
        });
        // Full reset after successful submission
        setSelectedUser(null);
        setSearch('');
        reset({ recipientId: '', amount: '', note: '' });
    }

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormLabel>Recipient</FormLabel>
                    <FormField
                        control={control}
                        name="recipientId"
                        render={() => (
                            <FormItem>
                                {!selectedUser ? (
                                    // --- CUSTOM RECIPIENT SEARCH (Replaces <Command>) ---
                                    <div className="relative" ref={searchRef}>
                                        <div className="relative">
                                            <Input
                                                placeholder="Search by name or email"
                                                value={search}
                                                onChange={(e) => setSearch(e.target.value)}
                                                className="pr-10"
                                                autoComplete="off"
                                            />
                                            {loading && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                                        </div>
                                        {searchResults.length > 0 && (
                                            <div className="absolute top-full z-10 mt-2 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md max-h-60">
                                                <div className="p-1">
                                                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                                                        Contacts
                                                    </div>
                                                    {searchResults.map((user) => (
                                                        <div
                                                            key={user.id}
                                                            onClick={() => handleUserSelect(user)}
                                                            className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <Avatar className="h-8 w-8">
                                                                    <AvatarImage src={user.avatar} data-ai-hint="person portrait" />
                                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                                </Avatar>
                                                                <div>
                                                                    <p className="font-medium">{user.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{user.email}</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                ) : (

                                    <div className="flex items-center gap-3 rounded-md border p-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedUser.avatar} data-ai-hint="person portrait" />
                                            <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <p className="font-medium">{selectedUser.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                        </div>
                                        <Button variant="ghost" size="icon" className="ml-auto" onClick={clearRecipient}>
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                )}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <fieldset disabled={!selectedUser} className="space-y-6">
                    <FormField
                        control={control}
                        name="amount"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Amount (USD)</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="0.00" {...field} step="0.01" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={control}
                        name="note"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Note (Optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. for dinner" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </fieldset>

                <Button type="submit" className="w-full" disabled={!selectedUser || !currentAmount || currentAmount <= 0}>
                    Send Money <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </form>
        </Form>
    );
}