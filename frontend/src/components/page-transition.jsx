"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton.jsx";

export function PageTransition({ children }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate small delay for skeleton
        const timer = setTimeout(() => setLoading(false), 300);
        return () => clearTimeout(timer);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
        >
            {loading ? (
                <div className="space-y-4">
                    <Skeleton className="h-8 w-1/3" /> {/* Title skeleton */}
                    <Skeleton className="h-4 w-full" /> {/* Content line */}
                    <Skeleton className="h-4 w-5/6" /> {/* Content line */}
                    <Skeleton className="h-4 w-2/3" /> {/* Content line */}
                </div>
            ) : (
                children
            )}
        </motion.div>
    );
}
