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
import { ArrowRight, Loader2, X, Check, ChevronsUpDown } from 'lucide-react';
import * as React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command.jsx";
import { cn } from "@/lib/utils.js";

const formSchema = z.object({
    recipientId: z.string().min(1, { message: 'Please select a recipient.' }),
    amount: z.coerce.number().positive({
        message: 'Amount must be positive.',
    }),
    note: z.string().optional(),
    category: z.string().min(1, { message: 'Please select or add a category.' }),
});

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

const USER_CATEGORIES_KEY = 'user_transfer_categories';
const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Entertainment', 'Other'];

export function TransferForm() {
    const { toast } = useToast();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [loadingSearch, setLoadingSearch] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);
    const [recipientWalletId, setRecipientWalletId] = React.useState(null);
    const [walletFetchState, setWalletFetchState] = React.useState({ status: 'idle', error: null });

    const [categories, setCategories] = React.useState(DEFAULT_CATEGORIES);
    const [categoryPopoverOpen, setCategoryPopoverOpen] = React.useState(false);
    const [categorySearch, setCategorySearch] = React.useState('');

    const searchRef = React.useRef(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { recipientId: '', amount: '', note: '', category: '' },
    });
    const { setValue, handleSubmit, reset, watch, control, getValues } = form;
    const currentAmount = watch('amount');
    const currentNote = watch('note');

    React.useEffect(() => {
        try {
            const storedCategories = localStorage.getItem(USER_CATEGORIES_KEY);
            if (storedCategories) {
                setCategories(JSON.parse(storedCategories));
            } else {
                localStorage.setItem(USER_CATEGORIES_KEY, JSON.stringify(DEFAULT_CATEGORIES));
            }
        } catch (error) {
            console.error("Failed to load categories from localStorage", error);
            setCategories(DEFAULT_CATEGORIES);
        }
    }, []);

    React.useEffect(() => {
        const fetchUsers = () => {
            setLoadingSearch(true);
            fetch(`http://localhost:8080/user-service/users/search?email=${search}`, { headers: getAuthHeaders() })
                .then(res => res.json())
                .then(data => setSearchResults(Array.isArray(data) ? data : []))
                .catch(() => setSearchResults([]))
                .finally(() => setLoadingSearch(false));
        };
        if (search.trim().length > 0 && !selectedUser) {
            const debounce = setTimeout(fetchUsers, 300);
            return () => clearTimeout(debounce);
        } else {
            setSearchResults([]);
        }
    }, [search, selectedUser]);

    React.useEffect(() => {
        if (!selectedUser) {
            setRecipientWalletId(null);
            setWalletFetchState({ status: 'idle', error: null });
            return;
        }
        const fetchRecipientWallet = async () => {
            setWalletFetchState({ status: 'loading', error: null });
            try {
                const res = await fetch(`http://localhost:8080/wallet-service/wallets/user/${selectedUser.id}`, {
                    method: 'GET',
                    headers: getAuthHeaders(),
                });
                if (!res.ok) throw new Error(`This user doesn't have a wallet.`);
                const walletData = await res.json();
                setRecipientWalletId(walletData.id);
                setWalletFetchState({ status: 'success', error: null });
            } catch (error) {
                setRecipientWalletId(null);
                setWalletFetchState({ status: 'error', error: error.message });
            }
        };
        fetchRecipientWallet();
    }, [selectedUser]);

    const getInitials = (name) => {
        if (!name) return "";
        const names = name.trim().split(' ');
        if (names.length > 1) { return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase(); }
        return name.slice(0, 2).toUpperCase();
    };

    const handleUserSelect = (user) => {
        setSelectedUser(user);
        setValue('recipientId', user.id, { shouldValidate: true });
        setSearch(user.name);
        setSearchResults([]);
    };

    const clearRecipient = () => {
        setSelectedUser(null);
        setValue('recipientId', '');
        setSearch('');
        reset({
            recipientId: '',
            amount: currentAmount || '',
            note: currentNote || '',
            category: getValues('category') || '',
        });
    };

    async function onSubmit(values) {
        if (walletFetchState.status !== 'success' || !recipientWalletId) {
            toast({ title: 'Invalid Recipient', description: 'Please select a valid recipient with a wallet.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);
        try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            const fromWalletId = userData.walletId;

            const transactionPayload = {
                fromWalletId,
                toWalletId: recipientWalletId,
                amount: values.amount,
                category: values.category,
                type: "TRANSFER",
                description: values.note || `Transfer to ${selectedUser.name}`,
            };

            const transactionRes = await fetch('http://localhost:8080/transaction-service/api/transactions', {
                method: 'POST',
                headers: getAuthHeaders(),
                body: JSON.stringify(transactionPayload),
            });

            if (!transactionRes.ok) {
                const errorData = await transactionRes.json();
                throw new Error(errorData.message || 'Transaction failed.');
            }

            toast({
                title: 'Transfer Successful',
                description: `You have sent ${values.amount.toFixed(2)} to ${selectedUser.name}.`,
            });

            const newCategory = values.category;
            const lowerCaseCategories = categories.map(c => c.toLowerCase());
            if (!lowerCaseCategories.includes(newCategory.toLowerCase())) {
                const updatedCategories = [...categories, newCategory];
                setCategories(updatedCategories);
                localStorage.setItem(USER_CATEGORIES_KEY, JSON.stringify(updatedCategories));
            }

            setSelectedUser(null);
            setSearch('');
            reset({ recipientId: '', amount: '', note: '', category: '' });

        } catch (error) {
            toast({ title: 'Transfer Failed', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    }

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setSearchResults([]);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const isRecipientValid = walletFetchState.status === 'success';

    // --- NEW: Check if the typed category is new ---
    const isNewCategory = categorySearch.length > 0 && !categories.some(cat => cat.toLowerCase() === categorySearch.toLowerCase());

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                    <FormLabel>Recipient</FormLabel>
                    <FormField control={control} name="recipientId" render={() => (
                        <FormItem>
                            {!selectedUser ? (
                                <div className="relative" ref={searchRef}>
                                    <div className="relative">
                                        <Input placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} className="pr-10" autoComplete="off"/>
                                        {loadingSearch && <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />}
                                    </div>
                                    {searchResults.length > 0 && (
                                        <div className="absolute top-full z-10 mt-2 w-full overflow-y-auto rounded-md border bg-popover text-popover-foreground shadow-md max-h-60">
                                            <div className="p-1">
                                                <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">Contacts</div>
                                                {searchResults.map((user) => (
                                                    <div key={user.id} onClick={() => handleUserSelect(user)} className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground">
                                                        <div className="flex items-center gap-3"><Avatar className="h-8 w-8"><AvatarImage src={user.avatar} /><AvatarFallback>{getInitials(user.name)}</AvatarFallback></Avatar><div><p className="font-medium">{user.name}</p><p className="text-sm text-muted-foreground">{user.email}</p></div></div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="rounded-md border p-2 space-y-2">
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-8 w-8"><AvatarImage src={selectedUser.avatar} /><AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback></Avatar>
                                        <div className="flex-grow"><p className="font-medium">{selectedUser.name}</p><p className="text-sm text-muted-foreground">{selectedUser.email}</p></div>
                                        {walletFetchState.status === 'loading' && <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />}
                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={clearRecipient}><X className="h-4 w-4" /></Button>
                                    </div>
                                    {walletFetchState.status === 'error' && <p className="text-sm text-destructive px-1">{walletFetchState.error}</p>}
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

                <fieldset disabled={!isRecipientValid || isSubmitting} className="space-y-6">
                    <FormField control={control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount (INR)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} step="0.01" /></FormControl><FormMessage /></FormItem> )}/>

                    <FormField
                        control={control}
                        name="category"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Category</FormLabel>
                                <Popover open={categoryPopoverOpen} onOpenChange={setCategoryPopoverOpen}>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                className={cn("w-full justify-between", !field.value && "text-muted-foreground")}
                                            >
                                                {field.value
                                                    ? categories.find(cat => cat.toLowerCase() === field.value.toLowerCase()) || field.value
                                                    : "Select or create a category"}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                                        <Command>
                                            {/* --- FIX: Track input value correctly --- */}
                                            <CommandInput
                                                placeholder="Search or create category..."
                                                value={categorySearch}
                                                onValueChange={setCategorySearch}
                                            />
                                            <CommandList>
                                                <CommandEmpty>No results found.</CommandEmpty>
                                                <CommandGroup>
                                                    {isNewCategory && (
                                                        <CommandItem
                                                            value={categorySearch}
                                                            onSelect={() => {
                                                                setValue("category", categorySearch, { shouldValidate: true });
                                                                setCategoryPopoverOpen(false);
                                                            }}
                                                        >
                                                            <span className="mr-2 h-4 w-4" /> {/* Spacer for alignment */}
                                                            Create "{categorySearch}"
                                                        </CommandItem>
                                                    )}
                                                    {categories.map((category) => (
                                                        <CommandItem
                                                            value={category}
                                                            key={category}
                                                            onSelect={() => {
                                                                setValue("category", category, { shouldValidate: true });
                                                                setCategoryPopoverOpen(false);
                                                            }}
                                                        >
                                                            <Check className={cn("mr-2 h-4 w-4", category.toLowerCase() === field.value?.toLowerCase() ? "opacity-100" : "opacity-0")} />
                                                            {category}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField control={control} name="note" render={({ field }) => ( <FormItem><FormLabel>Note (Optional)</FormLabel><FormControl><Input placeholder="e.g., For lunch at Cafe Goodluck" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </fieldset>

                <Button type="submit" className="w-full" disabled={!isRecipientValid || !currentAmount || currentAmount <= 0 || isSubmitting}>
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>) : (<><ArrowRight className="mr-2 h-4 w-4" /> Send Money</>)}
                </Button>
            </form>
        </Form>
    );
}
