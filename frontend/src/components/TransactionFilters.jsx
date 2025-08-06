'use client';

import * as React from 'react';
import { Button } from "@/components/ui/button.jsx";
import { Calendar } from "@/components/ui/calendar.jsx";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select.jsx";
import { cn } from "@/lib/utils.js";
import { CalendarIcon, RotateCcw } from "lucide-react";
import { addDays, format } from "date-fns";

export function TransactionFilters({ filters, setFilters, disabled }) {
    const { type, dateRange } = filters;

    const handleTypeChange = (newType) => {
        setFilters(prev => ({ ...prev, type: newType === 'ALL' ? null : newType }));
    };

    const handleDateChange = (newDateRange) => {
        setFilters(prev => ({ ...prev, dateRange: newDateRange }));
    };

    const clearFilters = () => {
        setFilters({ type: null, dateRange: { from: undefined, to: undefined } });
    };

    return (
        <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Type Filter */}
            <Select
                value={type || 'ALL'}
                onValueChange={handleTypeChange}
                disabled={disabled}
            >
                <SelectTrigger className="w-full md:w-[180px]">
                    <SelectValue placeholder="Filter by type..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="ALL">All Types</SelectItem>
                    <SelectItem value="TRANSFER">Transfer</SelectItem>
                    <SelectItem value="DEPOSIT">Deposit</SelectItem>
                    <SelectItem value="WITHDRAWAL">Withdrawal</SelectItem>
                </SelectContent>
            </Select>

            {/* Date Range Filter */}
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        variant={"outline"}
                        className={cn(
                            "w-full md:w-[300px] justify-start text-left font-normal",
                            !dateRange.from && "text-muted-foreground"
                        )}
                        disabled={disabled}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? (
                            dateRange.to ? (
                                <>
                                    {format(dateRange.from, "LLL dd, y")} -{" "}
                                    {format(dateRange.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(dateRange.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date range</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={dateRange.from}
                        selected={dateRange}
                        onSelect={handleDateChange}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            {/* Clear Filters Button */}
            <Button variant="ghost" onClick={clearFilters} disabled={disabled} className="flex items-center gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset
            </Button>
        </div>
    );
}