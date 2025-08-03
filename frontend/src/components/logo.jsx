import Link from 'next/link';
import { cn } from '@/lib/utils.js';
import { Wallet } from 'lucide-react';

const Logo = ({ className }) => {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <Wallet className="h-6 w-6 text-primary" />
      <span className="text-xl font-bold font-headline text-primary">FlowFi</span>
    </Link>
  );
};

export default Logo;
