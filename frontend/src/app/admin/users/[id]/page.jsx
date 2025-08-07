// File: components/admin/AdminUserDetailsPage.jsx

'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar.jsx'
import { useToast } from '@/hooks/use-toast.js'
import { ArrowLeft } from 'lucide-react'
import { cn } from "@/lib/utils.js";

export default function AdminUserDetailsPage() {
    const params = useParams()
    const { id: userId } = params
    const router = useRouter()
    const { toast } = useToast()

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // State for editable fields
    const [role, setRole] = useState('')
    const [status, setStatus] = useState('')
    const [emailVerified, setEmailVerified] = useState('false')
    const [kycVerified, setKycVerified] = useState('false')

    const getInitials = (name) => {
        if (!name) return "";
        const names = name.split(" ");
        if (names.length > 1) {
            return `${names[0][0]}${names[1][0]}`;
        }
        return names[0].substring(0, 2);
    };

    useEffect(() => {
        const fetchUser = async () => {
            if (!userId) return;

            const token = localStorage.getItem("authToken");
            if (!token) {
                setError("Authentication token not found.");
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`http://localhost:8080/admin-service/admin/users/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) {
                    throw new Error("Failed to fetch user details");
                }

                const data = await res.json();
                setUser(data);

                setRole(data.role);
                setStatus(data.status);
                setEmailVerified(String(data.emailVerified));
                setKycVerified(String(data.kycVerified));

            } catch (err) {
                console.error("Error fetching user details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("authToken");
        if (!token) {
            toast({
                title: "Update Failed",
                description: "Authentication token is missing.",
                variant: "destructive",
            });
            return;
        }

        const updatedUserData = {
            id: user.id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            kycVerified: kycVerified === 'true',
            emailVerified: emailVerified === 'true',
            role: role,
            status: status,
        };

        try {
            const res = await fetch(`http://localhost:8080/admin-service/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(updatedUserData),
            });

            if (!res.ok) {
                let errorMessage = 'Failed to update user details';
                try {
                    const errorData = await res.json();
                    errorMessage = errorData.message || errorMessage;
                } catch (e) {
                    errorMessage = `Server responded with status: ${res.status}`;
                }
                throw new Error(errorMessage);
            }

            // ✅ This line is the problem. Remove it completely.

            toast({
                title: "User Updated",
                description: `${user.name}'s details have been updated.`,
            });

            // ✅ This redirection will now work.
            router.push('/admin');

        } catch (err) {
            console.error("Error updating user details:", err);
            toast({
                title: "Update Failed",
                description: err.message,
                variant: "destructive",
            });
        }
    }

    if (loading) {
        return <div>Loading user details...</div>
    }

    if (error || !user) {
        return <div>User not found or an error occurred.</div>
    }

    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">User Details</h1>
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                        </Avatar>
                        <div>
                            <CardTitle>{user.name}</CardTitle>
                            <CardDescription>Manage user profile and settings.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <input type="hidden" name="userId" value={user.id} />
                        {/* Read-only fields */}
                        <div className="space-y-2">
                            <Label htmlFor="name">Full Name</Label>
                            <Input id="name" defaultValue={user.name} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input id="email" type="email" defaultValue={user.email} disabled />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" type="tel" defaultValue={user.phoneNumber} disabled />
                        </div>

                        {/* Editable fields */}
                        <div className="space-y-2">
                            <Label htmlFor="role">Role</Label>
                            <Select name="role" value={role} onValueChange={setRole}>
                                <SelectTrigger id="role">
                                    <SelectValue placeholder="Select role" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* ✅ Values must be uppercase to match Java enums */}
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="admin">Admin</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select name="status" value={status} onValueChange={setStatus}>
                                <SelectTrigger id="status">
                                    <SelectValue placeholder="Select status" />
                                </SelectTrigger>
                                <SelectContent>
                                    {/* ✅ Values must be uppercase to match Java enums */}
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                    <SelectItem value="suspended">Suspended</SelectItem>
                                    <SelectItem value="blocked">Blocked</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="emailVerified">Email Verified</Label>
                            <Select name="emailVerified" value={emailVerified} onValueChange={setEmailVerified}>
                                <SelectTrigger id="emailVerified">
                                    <SelectValue placeholder="Select verification status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="kycVerified">KYC Verified</Label>
                            <Select name="kycVerified" value={kycVerified} onValueChange={setKycVerified}>
                                <SelectTrigger id="kycVerified">
                                    <SelectValue placeholder="Select verification status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="true">True</SelectItem>
                                    <SelectItem value="false">False</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action buttons */}
                        <div className="md:col-span-2 flex justify-end gap-2">
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel</Button>
                            <Button type="submit">Save Changes</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}