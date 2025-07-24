import AnalyticsChart from "@/components/analytics-chart";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowDown, ArrowUp } from "lucide-react";

export default function AnalyticsPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold font-headline">Analytics</h1>
            <p className="text-muted-foreground">
                Visualize your spending and earnings over time.
            </p>

            <div className="grid gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Incoming
                        </CardTitle>
                        <ArrowDown className="h-4 w-4 text-green-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$2,350.00</div>
                        <p className="text-xs text-muted-foreground">
                            +10.5% from last month
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">
                            Outgoing
                        </CardTitle>
                        <ArrowUp className="h-4 w-4 text-red-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">$1,210.50</div>
                        <p className="text-xs text-muted-foreground">
                            +5.2% from last month
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
                        <AnalyticsChart />
                    </CardContent>
                </Card>
                 <Card className="col-span-4 lg:col-span-3">
                    <CardHeader>
                        <CardTitle>Spending by Category</CardTitle>
                        <CardDescription>
                            A breakdown of your spending by category.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                       {/* Pie chart will be added here */}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
