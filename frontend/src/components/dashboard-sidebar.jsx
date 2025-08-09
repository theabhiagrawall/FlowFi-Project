'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react'; // ✅ Import useEffect
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.jsx';
import {
  LayoutDashboard,
  TrendingUp,
  ArrowRightLeft,
  Settings,
  History,
  ShieldCheck,
  Lock,
} from 'lucide-react';
import { cn } from '@/lib/utils.js';
import { useAuth } from '@/context/auth-context.js';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', restricted: false },
  { href: '/analytics', icon: TrendingUp, label: 'Analytics', restricted: true },
  { href: '/transfer', icon: ArrowRightLeft, label: 'Transfer', restricted: true },
  { href: '/history', icon: History, label: 'History', restricted: true },
];

const adminItem = { href: '/admin', icon: ShieldCheck, label: 'Admin' };
const settingsItem = { href: '/settings', icon: Settings, label: 'Settings' };

export default function DashboardSidebar() {
  const pathname = usePathname();
  const { user, setUser } = useAuth(); // ✅ Get setUser to update the context




  const isFullyVerified = user?.kycVerified && user?.emailVerified && user?.status === 'active';

  return (
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {/* ... SVG Logo Link remains the same ... */}
          <Link
              href="/"
              className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            {/* Your SVG Logo */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 transition-all group-hover:scale-110"
            >
              <path d="M4 10a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V10z" />
              <path d="M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v2H4V6z" />
              <path d="M12 15h.01" />
            </svg>
            <span className="sr-only">FlowFi</span>
          </Link>
          <TooltipProvider>
            {navItems.map((item) => {

              const isDisabled = item.restricted && !isFullyVerified;
              const Icon = isDisabled ? Lock : item.icon; // Use Lock icon if disabled

              return (
                  <Tooltip key={item.href}>
                    <TooltipTrigger asChild>
                      <Link
                          // If disabled, prevent navigation.
                          href={isDisabled ? '#' : item.href}
                          className={cn(
                              'flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8',
                              pathname === item.href && !isDisabled && 'bg-accent text-accent-foreground',
                              isDisabled && 'cursor-not-allowed opacity-50' // Style for disabled state
                          )}
                      >
                        <Icon className="h-5 w-5" />
                        <span className="sr-only">{item.label}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      {/* Show a different message for disabled items */}
                      {isDisabled ? 'Verification Required' : item.label}
                    </TooltipContent>
                  </Tooltip>
              );
            })}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <TooltipProvider>
            {user?.role === 'admin' && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link href={adminItem.href} className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8', pathname === adminItem.href && 'bg-accent text-accent-foreground' )}>
                      <adminItem.icon className="h-5 w-5" />
                      <span className="sr-only">{adminItem.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{adminItem.label}</TooltipContent>
                </Tooltip>
            )}

            {/* Settings link remains enabled */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={settingsItem.href} className={cn('flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8', pathname === settingsItem.href && 'bg-accent text-accent-foreground' )}>
                  <settingsItem.icon className="h-5 w-5" />
                  <span className="sr-only">{settingsItem.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{settingsItem.label}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>
      </aside>
  );
}