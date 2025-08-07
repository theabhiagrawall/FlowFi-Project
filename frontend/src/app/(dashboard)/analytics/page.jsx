'use client';

import * as React from 'react';
import dynamic from 'next/dynamic';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.jsx";
import { ArrowDown, ArrowUp, Loader2, Terminal } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert.jsx';

// Dynamically import the chart components to prevent SSR issues and show a loading state
const AnalyticsChart = dynamic(() => import('@/components/analytics-chart.jsx'), {
    ssr: false,
    loading: () => <div className="h-[350px] flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});
const SpendingPieChart = dynamic(() => import('@/components/SpendingPieChart'), {
    ssr: false,
    loading: () => <div className="h-[350px] flex justify-center items-center"><Loader2 className="h-8 w-8 animate-spin" /></div>,
});

// Helper to format currency consistently
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
    }).format(amount || 0);

// Helper to format percentage with a sign
const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    const sign = value > 0 ? '+' : '';
    return `${sign}${value.toFixed(1)}%`;
};

export default function AnalyticsPage() {
    const [analyticsData, setAnalyticsData] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [error, setError] = React.useState(null);

    React.useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const userDataString = localStorage.getItem('userData');
                const token = localStorage.getItem('authToken');
                if (!userDataString || !token) {
                    throw new Error("User not authenticated.");
                }
                const userData = JSON.parse(userDataString);
                const walletId = userData.walletId;

                if (!walletId) {
                    throw new Error("Wallet ID not found.");
                }

                const response = await fetch(`http://localhost:8080/transaction-service/api/transactions/analytics/${walletId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch analytics data.");
                }

                const data = await response.json();
                setAnalyticsData(data);
            } catch (err) {
                console.error("Analytics fetch error:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold font-headline">Analytics</h1>
                <Alert variant="destructive" className="mt-6">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>Error Fetching Data</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    // Render the page only when data is available
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">
                Visualize your spending and earnings over time.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Incoming (This Month)</CardTitle>
                        <ArrowDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData?.summary?.currentMonth?.incoming)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatPercentage(analyticsData?.summary?.percentageChange?.incoming)} from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">Outgoing (This Month)</CardTitle>
                        <ArrowUp className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{formatCurrency(analyticsData?.summary?.currentMonth?.outgoing)}</div>
                        <p className="text-xs text-muted-foreground">
                            {formatPercentage(analyticsData?.summary?.percentageChange?.outgoing)} from last month
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Transaction Overview</CardTitle>
                        <CardDescription>Sent vs. Received funds over the last 7 months.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Pass the dynamic data to the chart component */}
                        <AnalyticsChart data={analyticsData?.monthlyOverview} />
                    </CardContent>
                </Card>
                <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                        <CardDescription>A breakdown of your spending by category.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {/* Pass the dynamic data to the pie chart component */}
                        <SpendingPieChart data={analyticsData?.spendingByCategory} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
