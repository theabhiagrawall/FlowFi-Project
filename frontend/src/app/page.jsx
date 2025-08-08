import React from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, ShieldCheck, BarChart, Users } from 'lucide-react';

// Aceternity UI component imports
import { TextGenerateEffect } from '@/components/ui/text-generate-effect';
import { BackgroundBeams } from '@/components/ui/background-beams';
import { BentoGrid, BentoGridItem } from '@/components/ui/bento-grid';

// You'll need to create these component files in your project
// from Aceternity UI's website. For example:
// components/ui/text-generate-effect.tsx
// components/ui/background-beams.tsx
// components/ui/bento-grid.tsx

// A simple logo component for demonstration
const Logo = () => (
    <Link href="/" className="text-2xl font-bold text-white">
      FlowFi
    </Link>
);

// A visually representative header for the bento grid items
const FeatureHeader = ({ children }) => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 items-center justify-center">
      {children}
    </div>
);


export default function LandingPageV2() {
  const features = [
    {
      title: 'Fast, Free, & Global Transfers',
      description: (
          <span className="text-sm">
          Send and receive money in seconds. No hidden fees, no borders. Just fast, simple payments.
        </span>
      ),
      header: <FeatureHeader><Zap className="h-12 w-12 text-blue-400" /></FeatureHeader>,
      icon: <Zap className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-2',
    },
    {
      title: 'Your Security is Our Priority',
      description: (
          <span className="text-sm">
          We use end-to-end encryption and multi-factor authentication to protect your funds.
        </span>
      ),
      header: <FeatureHeader><ShieldCheck className="h-12 w-12 text-green-400" /></FeatureHeader>,
      icon: <ShieldCheck className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
    {
      title: 'Automated Smart Budgeting',
      description: (
          <span className="text-sm">
          Let our AI track your spending, categorize expenses, and help you save more.
        </span>
      ),
      header: <FeatureHeader><BarChart className="h-12 w-12 text-purple-400" /></FeatureHeader>,
      icon: <BarChart className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-1',
    },
    {
      title: 'Accounts for Your Whole Life',
      description: (
          <span className="text-sm">
          From family accounts for shared expenses to multi-currency wallets for travel.
        </span>
      ),
      header: <FeatureHeader><Users className="h-12 w-12 text-yellow-400" /></FeatureHeader>,
      icon: <Users className="h-4 w-4 text-neutral-500" />,
      className: 'md:col-span-2',
    },
  ];

  return (
      <div className="bg-black text-white">
        {/* Main Hero Section with Animated Text and Background Beams */}
        <div className="h-screen w-full rounded-md bg-neutral-950 relative flex flex-col items-center justify-center antialiased">
          <header className="fixed top-0 left-0 right-0 z-50 p-4 md:px-6 flex items-center justify-between bg-black/50 backdrop-blur-sm">
            <Logo />
            <Link
                href="/login"
                className="inline-flex h-10 items-center justify-center rounded-md bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <span>Login</span>
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </header>

          <div className="container px-4 md:px-6 z-10">
            <div className="flex flex-col items-center space-y-6 text-center">
              <TextGenerateEffect
                  words="Modern Banking for a Modern World"
                  className="text-8xl text-blue-500 font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none"
              />
              <p className="mx-auto max-w-[700px] text-neutral-300 md:text-xl">
                FlowFi provides a seamless, secure, and smart way to manage your finances. Experience banking that's built for you.
              </p>
              <div className="space-x-4 pt-6 flex items-center">
                <Link
                    href="/signup"
                    className="inline-flex h-12 items-center justify-center rounded-md bg-white px-8 text-lg font-semibold text-black shadow transition-colors hover:bg-neutral-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Get Started
                </Link>
                <Link
                    href="/login"
                    className="inline-flex h-12 items-center justify-center rounded-md border border-neutral-700 bg-transparent px-8 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </div>
          <BackgroundBeams />
        </div>

        {/* A simple, clean features section with Bento Grid */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-black">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Features Built For You</h2>
              <p className="max-w-[900px] text-neutral-400 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Everything you need to manage your financial life, all in one place.
              </p>
            </div>
            <BentoGrid className="max-w-4xl mx-auto">
              {features.map((item, i) => (
                  <BentoGridItem
                      key={i}
                      title={item.title}
                      description={item.description}
                      header={item.header}
                      icon={item.icon}
                      className={item.className}
                  />
              ))}
            </BentoGrid>
          </div>
        </section>

        {/* A simple footer section */}
        <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t border-neutral-800 bg-black">
          <p className="text-xs text-neutral-400">&copy; 2025 FlowFi. All rights reserved.</p>
          <nav className="sm:ml-auto flex gap-4 sm:gap-6">
            <Link className="text-xs hover:underline underline-offset-4 text-neutral-300" href="/terms-of-service">
              Terms of Service
            </Link>
            <Link className="text-xs hover:underline underline-offset-4 text-neutral-300" href="/privacy-policy">
              Privacy
            </Link>
          </nav>
        </footer>
      </div>
  );
}
