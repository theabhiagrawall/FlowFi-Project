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

const getAuthHeaders = () => {
    const token = localStorage.getItem('authToken');
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    return headers;
};

export function TransferForm() {
    const { toast } = useToast();
    const [search, setSearch] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    const [loadingSearch, setLoadingSearch] = React.useState(false);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState(null);

    // new state to fetch wallet ID early so that transaction can be quicker
    const [recipientWalletId, setRecipientWalletId] = React.useState(null);
    const [walletFetchState, setWalletFetchState] = React.useState({ status: 'idle', error: null }); // 'idle' | 'loading' | 'success' | 'error'

    const searchRef = React.useRef(null);
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { recipientId: '', amount: '', note: '' },
    });
    const { setValue, handleSubmit, reset, watch, control } = form;
    const currentAmount = watch('amount');
    const currentNote = watch('note');

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
        // If no user is selected, reset everything
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

                if (!res.ok) {
                    throw new Error(`This user doesn't have a wallet or can't be found.`);
                }

                const walletData = await res.json();
                console.log("to wallet "+ walletData);
                setRecipientWalletId(walletData.id);
                setWalletFetchState({ status: 'success', error: null });
            } catch (error) {
                console.error("Recipient wallet fetch error:", error);
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
        reset({ recipientId: '', amount: currentAmount || '', note: currentNote || '' });
    };

    async function onSubmit(values) {
        // Guard clause: Ensure we have a valid recipient wallet before proceeding
        // to safeguard failing of API call
        if (walletFetchState.status !== 'success' || !recipientWalletId) {
            toast({
                title: 'Invalid Recipient',
                description: 'Please select a valid recipient with a wallet.',
                variant: 'destructive',
            });
            return;
        }

        setIsSubmitting(true);
        try {
            const userDataString = localStorage.getItem('userData');
            if (!userDataString) throw new Error("Could not find current user data. Please log in again.");
            const userData = JSON.parse(userDataString);
            const fromWalletId = userData.walletId;

            const transactionPayload = {
                fromWalletId,
                toWalletId: recipientWalletId,
                amount: values.amount,
                category: "TRANSFER",
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
                throw new Error(errorData.message || 'Transaction failed. Please try again.');
            }

            toast({
                title: 'Transfer Successful',
                description: `You have sent $${values.amount.toFixed(2)} to ${selectedUser.name}.`,
                variant: 'success',
            });

            setSelectedUser(null);
            setSearch('');
            reset({ recipientId: '', amount: '', note: '' });

        } catch (error) {
            toast({
                title: 'Transfer Failed',
                description: error.message,
                variant: 'destructive',
            });
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

    // Determine if form fields should be enabled
    const isRecipientValid = walletFetchState.status === 'success';

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
                                        <Avatar className="h-8 w-8">
                                            <AvatarImage src={selectedUser.avatar} />
                                            <AvatarFallback>{getInitials(selectedUser.name)}</AvatarFallback>
                                        </Avatar>
                                        <div className="flex-grow">
                                            <p className="font-medium">{selectedUser.name}</p>
                                            <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                                        </div>
                                        {walletFetchState.status === 'loading' && (
                                            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                                        )}
                                        <Button variant="ghost" size="icon" className="shrink-0" onClick={clearRecipient}><X className="h-4 w-4" /></Button>
                                    </div>
                                    {walletFetchState.status === 'error' && (
                                        <p className="text-sm text-destructive px-1">{walletFetchState.error}</p>
                                    )}
                                </div>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}/>
                </div>

                <fieldset disabled={!isRecipientValid || isSubmitting} className="space-y-6">
                    <FormField control={control} name="amount" render={({ field }) => ( <FormItem><FormLabel>Amount (USD)</FormLabel><FormControl><Input type="number" placeholder="0.00" {...field} step="0.01" /></FormControl><FormMessage /></FormItem> )}/>
                    <FormField control={control} name="note" render={({ field }) => ( <FormItem><FormLabel>Note (Optional)</FormLabel><FormControl><Input placeholder="For lunch at Cafe Goodluck, August 6th" {...field} /></FormControl><FormMessage /></FormItem> )}/>
                </fieldset>

                <Button type="submit" className="w-full" disabled={!isRecipientValid || !currentAmount || currentAmount <= 0 || isSubmitting}>
                    {isSubmitting ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...</>) : (<><ArrowRight className="mr-2 h-4 w-4" /> Send Money</>)}
                </Button>
            </form>
        </Form>
    );
}