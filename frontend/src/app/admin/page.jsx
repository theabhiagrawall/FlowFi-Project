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
import { users } from "@/lib/data.js";
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

export default function AdminPage() {
  const getInitials = (name) => {
    const names = name.split(" ");
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`;
    }
    return names[0].substring(0, 2);
  };

  const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  
  const getKycStatusVariant = (status) => {
    switch (status) {
      case 'verified':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'rejected':
      case 'unverified':
        return 'destructive';
      default:
        return 'outline';
    }
  }

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
                        <AvatarImage src={user.avatar} alt={user.name} data-ai-hint="person portrait" />
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
                    <Badge variant={getKycStatusVariant(user.kycStatus)} className="capitalize">
                      {user.kycStatus}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono">{formatCurrency(user.balance)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button aria-haspopup="true" size="icon" variant="ghost">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Toggle menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View User Details</DropdownMenuItem>
                        {user.kycStatus === 'pending' && (
                           <>
                            <DropdownMenuSeparator />
                            <DropdownMenuLabel>KYC Verification</DropdownMenuLabel>
                             <DropdownMenuItem asChild>
                               <Link href={user.kycDocumentUrl || '#'} target="_blank" rel="noopener noreferrer" className={cn(!user.kycDocumentUrl && "pointer-events-none opacity-50")}>
                                <FileText /> View Document
                               </Link>
                             </DropdownMenuItem>
                             <DropdownMenuItem>
                               <CheckCircle className="text-green-500" /> Approve
                             </DropdownMenuItem>
                             <DropdownMenuItem>
                               <XCircle className="text-red-500" /> Reject
                             </DropdownMenuItem>
                           </>
                        )}
                         <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                            Suspend Account
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
