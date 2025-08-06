'use client';

import React, { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx';
import Link from 'next/link';
import { Skeleton } from "@/components/ui/skeleton.jsx"; // For loading state

// This is the component for a single contact, making the main component cleaner.
const ContactBubble = ({ contact }) => {
    const getInitials = (name) => {
        if (!name) return "?";
        const names = name.split(' ');
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return names[0].substring(0, 2);
    };

    return (
        <Link href={`/users/${contact.userId}`}>
            <div className="flex flex-col items-center text-center gap-2 cursor-pointer group w-20">
                <Avatar className="h-16 w-16 border-2 border-transparent group-hover:border-primary transition-colors">
                    <AvatarImage src={contact.avatar} />
                    <AvatarFallback>{getInitials(contact.name)}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium truncate w-full">{contact.name.split(' ')[0]}</span>
            </div>
        </Link>
    );
};

// This is a placeholder component shown while data is loading.
const LoadingSkeleton = () => (
    <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-16 w-16 rounded-full" />
        <Skeleton className="h-4 w-12" />
    </div>
);

export default function FavoriteContacts() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFrequentContacts = async () => {
            try {
                // 1. Get current user data from localStorage
                const userDataString = localStorage.getItem('userData');
                const token = localStorage.getItem('authToken');

                if (!userDataString || !token) {
                    throw new Error("User not authenticated.");
                }
                const userData = JSON.parse(userDataString);
                const walletId = userData.walletId;

                if (!walletId) {
                    throw new Error("User wallet ID not found.");
                }

                // 2. Fetch frequent contacts from the new endpoint
                const response = await fetch(`http://localhost:8080/transaction-service/api/transactions/frequent-contacts/${walletId}?limit=6`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch frequent contacts.");
                }

                const data = await response.json();
                setContacts(data);

            } catch (err) {
                console.error("Error fetching frequent contacts:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFrequentContacts();
    }, []); // Empty dependency array means this runs once on component mount

    const renderContent = () => {
        if (loading) {
            // Show 6 skeleton loaders while fetching data
            return Array.from({ length: 6 }).map((_, index) => <LoadingSkeleton key={index} />);
        }

        if (error || contacts.length === 0) {
            return <p className="text-sm text-muted-foreground">No frequent contacts to display yet.</p>;
        }

        return contacts.map((contact) => (
            <ContactBubble key={contact.userId} contact={contact} />
        ));
    };

    return (
        <div className="w-full">
            <h3 className="text-lg font-semibold mb-4">Frequent Contacts</h3>
            <div className="flex space-x-6 overflow-x-auto pb-4">
                {renderContent()}
            </div>
        </div>
    );
}
