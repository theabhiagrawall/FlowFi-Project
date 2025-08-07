'use client';

import { useState, useEffect } from "react";
import Logo from "@/components/logo.jsx";
import UserNav from "@/components/user-nav.jsx";
import PrivateRoute from "@/components/private-route.jsx";
import DashboardSidebar from "@/components/dashboard-sidebar";

export default function AdminLayout({ children }) {
    const fullText = "Admin Panel";
    const [displayedText, setDisplayedText] = useState("");
    const [isTypingDone, setIsTypingDone] = useState(false);

    useEffect(() => {
        let i = 0;
        const interval = setInterval(() => {
            setDisplayedText(fullText.slice(0, i + 1));
            i++;
            if (i === fullText.length) {
                clearInterval(interval);
                setIsTypingDone(true);
            }
        }, 150); // typing speed in ms
        return () => clearInterval(interval);
    }, []);

    return (
        <PrivateRoute>
            <DashboardSidebar />
            <div className="flex min-h-screen w-full flex-col sm:pl-14">
                <header className="sticky top-0 flex h-16 items-center justify-between border-b bg-background px-4 md:px-6">
                    <div className="flex items-center">
                        <Logo />
                    </div>
                    <div className="flex flex-1 justify-center">
                        <nav>
                           <span
                               className={`font-bold text-lg whitespace-nowrap ${
                                   !isTypingDone ? "border-r-2 border-black pr-1 animate-pulse" : ""
                               }`}
                           >
                                {displayedText}
                            </span>
                        </nav>
                    </div>

                    {/* Right: UserNav */}
                    <div className="flex items-center">
                        <UserNav />
                    </div>
                </header>

                <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
                    {children}
                </main>
            </div>
        </PrivateRoute>
    );
}
