'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button.jsx';
import { Wallet, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-blue-50 to-white dark:from-gray-900 dark:to-gray-950 text-center px-4">
      {/* Animated Icon */}
      <div className="animate-bounce">
        <Wallet className="w-20 h-20 text-blue-500 dark:text-blue-400" />
      </div>

      {/* 404 Number with Fade In */}
      <h1 className="mt-6 text-7xl font-extrabold text-gray-800 dark:text-white animate-fade-in">
        404
      </h1>

      {/* Message */}
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300 max-w-md animate-fade-in-delay">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>

      {/* Back to Home Button */}
      <Link href="/" className="mt-6 animate-fade-in-delay-2">
        <Button className="flex items-center gap-2">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Button>
      </Link>

      {/* Custom CSS Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.6s ease forwards;
        }
        .animate-fade-in-delay {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.2s;
        }
        .animate-fade-in-delay-2 {
          animation: fadeIn 0.8s ease forwards;
          animation-delay: 0.4s;
        }
      `}</style>
    </div>
  );
}
