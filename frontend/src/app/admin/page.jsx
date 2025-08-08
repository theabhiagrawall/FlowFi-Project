// File: components/admin/AdminPage.jsx

"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table.jsx";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card.jsx";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar.jsx";
import { Badge } from "@/components/ui/badge.jsx";
import { MoreHorizontal, CheckCircle, XCircle, FileText } from "lucide-react";
import { Button } from "@/components/ui/button.jsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu.jsx";
import Link from "next/link";
import { cn } from "@/lib/utils.js";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast.js";

export default function AdminPage() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toast } = useToast();

    const getInitials = (name) => {
        const names = name.split(" ");
        return names.length > 1
            ? `${names[0][0]}${names[1][0]}`
            : names[0].substring(0, 2);
    };

    const formatCurrency = (amount) => {
        const numericAmount = parseFloat(amount);
        if (isNaN(numericAmount)) return "₹0.00";
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2,
        }).format(numericAmount);
    };

    const getKycStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case "verified":
                return "default";
            case "pending":
                return "secondary";
            case "rejected":
            case "unverified":
                return "destructive";
            default:
                return "outline";
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem("authToken");
        setLoading(true);

        try {
            const res = await fetch("http://localhost:8080/admin-service/admin", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch users");

            const data = await res.json();
            setUsers(data);
        } catch (error) {
            console.error("Error fetching users:", error);
            toast({
                title: "Error",
                description: "Failed to fetch user list.",
                variant: "destructive",
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSuspendUser = async (userId) => {
        const token = localStorage.getItem("authToken");

        try {
            const res = await fetch(`http://localhost:8080/admin-service/admin/users/${userId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to suspend user.");
            }

            setUsers(users.filter(user => user.id !== userId));

            toast({
                title: "Success",
                description: "User account has been deleted.",
            });
        } catch (error) {
            console.error("Error deleting user:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    // ✅ New function to handle KYC approval
    const handleApproveKyc = async (userId) => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`http://localhost:8080/admin-service/admin/approve/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to approve KYC.");
            }

            setUsers(users.map(user => user.id === userId ? { ...user, kycStatus: 'Verified' } : user));

            toast({
                title: "Success",
                description: "KYC has been approved.",
            });
        } catch (error) {
            console.error("Error approving KYC:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };

    // ✅ New function to handle KYC rejection
    const handleRejectKyc = async (userId) => {
        const token = localStorage.getItem("authToken");
        try {
            const res = await fetch(`http://localhost:8080/admin-service/admin/reject/${userId}`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to reject KYC.");
            }

            setUsers(users.map(user => user.id === userId ? { ...user, kycStatus: 'Unverified' } : user));

            toast({
                title: "Success",
                description: "KYC has been rejected.",
            });
        } catch (error) {
            console.error("Error rejecting KYC:", error);
            toast({
                title: "Error",
                description: error.message,
                variant: "destructive",
            });
        }
    };


    return (
        <div>
            <h1 className="text-3xl font-bold font-headline mb-6">User Management</h1>
            <Card>
                <CardHeader>
                    <CardTitle>User Accounts</CardTitle>
                    <CardDescription>
                        An overview of all user accounts and their KYC status.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p>Loading users...</p>
                    ) : users.length === 0 ? (
                        <p>No users found.</p>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>KYC Status</TableHead>
                                    <TableHead className="text-right">Balance</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <Avatar className="h-10 w-10">
                                                    <AvatarImage src={user.avatar} alt={user.name} />
                                                    <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">{user.name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={getKycStatusVariant(user.kycStatus)}
                                                className="capitalize"
                                            >
                                                {user.kycStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            {formatCurrency(user.walletBalance)}
                                        </TableCell>
                                        <TableCell>
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button
                                                        aria-haspopup="true"
                                                        size="icon"
                                                        variant="ghost"
                                                    >
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Toggle menu</span>
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem asChild>
                                                        <Link href={`/admin/users/${user.id}`}>
                                                            View User Details
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    {user.kycStatus?.toLowerCase() === "unverified" && (
                                                        <>
                                                            <DropdownMenuSeparator />
                                                            <DropdownMenuLabel>KYC Verification</DropdownMenuLabel>
                                                            <DropdownMenuItem asChild>
                                                                {/* ✅ Corrected the Link href */}
                                                                <Link
                                                                    href={`http://localhost:8080/admin-service/kyc-documents/view/${user.id}`}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className={cn(
                                                                        !user.kycDocumentUrl &&
                                                                        "pointer-events-none opacity-50"
                                                                    )}
                                                                >
                                                                    <FileText /> View Document
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleApproveKyc(user.id)}>
                                                                <CheckCircle className="text-green-500" /> Approve
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => handleRejectKyc(user.id)}>
                                                                <XCircle className="text-red-500" /> Reject
                                                            </DropdownMenuItem>
                                                        </>
                                                    )}
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem
                                                        className="text-destructive"
                                                        onClick={() => handleSuspendUser(user.id)}
                                                    >
                                                        Suspend Account
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}