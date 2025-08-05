'use client';
import * as React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet.jsx';
import { Button } from '@/components/ui/button.jsx';
import Link from 'next/link';
import {
    PanelLeft,
    LayoutDashboard,
    TrendingUp,
    ArrowRightLeft,
    Settings,
    History,
} from 'lucide-react';
import UserNav from './user-nav.jsx';
import { usePathname } from 'next/navigation';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb.jsx'
import Logo from './logo.jsx';

const navItems = [
    { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { href: '/analytics', icon: TrendingUp, label: 'Analytics' },
    { href: '/transfer', icon: ArrowRightLeft, label: 'Transfer' },
    { href: '/history', icon: History, label: 'History' },
];

export default function DashboardHeader() {
    const pathname = usePathname();

    const capitalize = (s) => {
        if (s === '/') return 'Dashboard';
        // a page can be at / an therefore s is empty
        if (!s) return '';
        return s.charAt(0).toUpperCase() + s.slice(1);
    }

    const pathSegments = pathname.split('/').filter(Boolean);


    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <div className="flex justify-center -ml-4">
                            <Logo />
                        </div>
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-4 px-2.5 ${pathname === item.href ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                <item.icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        ))}
                        <Link
                            href="/settings"
                            className={`flex items-center gap-4 px-2.5 ${pathname === "/settings" ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                        >
                            <Settings className="h-5 w-5" />
                            Settings
                        </Link>
                    </nav>
                </SheetContent>
            </Sheet>
            <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link href="/">Home</Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    {pathSegments.length === 0 && (
                        <>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                <BreadcrumbPage>Dashboard</BreadcrumbPage>
                            </BreadcrumbItem>
                        </>
                    )}
                    {pathSegments.map((segment, index) => (
                        <React.Fragment key={segment}>
                            <BreadcrumbSeparator />
                            <BreadcrumbItem>
                                {index === pathSegments.length - 1 ? (
                                    <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                                ) : (
                                    <BreadcrumbLink asChild>
                                        <Link href={`/${pathSegments.slice(0, index + 1).join('/')}`}>{capitalize(segment)}</Link>
                                    </BreadcrumbLink>
                                )}
                            </BreadcrumbItem>
                        </React.Fragment>
                    ))}
                </BreadcrumbList>
            </Breadcrumb>
            <div className="relative ml-auto flex-1 md:grow-0">
            </div>
            <UserNav />
        </header>
    );
}
