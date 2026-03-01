"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
} from "@/components/ui/sheet"
import { Search, MapPin, SlidersHorizontal, X } from "lucide-react"
import { businessCategories, albanianCities, getCategoryLabel, MAX_LISTING_PRICE } from "@/lib/constants"
import { formatCurrency } from "@/lib/currency"
import { useState } from "react"

interface ListingFiltersProps {
    filters: {
        query: string
        category: string
        city: string
        priceRange: [number, number]
        minRoi: number
        sortBy: string
        activeFiltersCount: number
    }
    setters: {
        setQuery: (val: string) => void
        setCategory: (val: string) => void
        setCity: (val: string) => void
        setPriceRange: (val: [number, number]) => void
        setMinRoi: (val: number) => void
        setSortBy: (val: string) => void
        clearAllFilters: () => void
    }
}

export function ListingFilters({ filters, setters }: ListingFiltersProps) {
    const [isFilterOpen, setIsFilterOpen] = useState(false)

    const activeFiltersList = []
    if (filters.category) {
        activeFiltersList.push({
            key: "category",
            label: getCategoryLabel(filters.category),
            onRemove: () => setters.setCategory(""),
        })
    }
    if (filters.city) {
        activeFiltersList.push({
            key: "city",
            label: filters.city,
            onRemove: () => setters.setCity(""),
        })
    }
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_LISTING_PRICE) {
        activeFiltersList.push({
            key: "price",
            label: `${formatCurrency(filters.priceRange[0], "EUR")} - ${formatCurrency(filters.priceRange[1], "EUR")}`,
            onRemove: () => setters.setPriceRange([0, MAX_LISTING_PRICE]),
        })
    }
    if (filters.minRoi > 0) {
        activeFiltersList.push({
            key: "roi",
            label: `ROI > ${filters.minRoi}%`,
            onRemove: () => setters.setMinRoi(0),
        })
    }

    const advancedFiltersCount = (filters.priceRange[0] > 0 || filters.priceRange[1] < MAX_LISTING_PRICE ? 1 : 0) + (filters.minRoi > 0 ? 1 : 0)

    return (
        <div className="flex flex-col gap-5">
            <div className="flex flex-col lg:flex-row gap-3">
                {/* Search Input */}
                <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or keyword..."
                        value={filters.query}
                        onChange={(e) => setters.setQuery(e.target.value)}
                        className="h-10 pl-9 bg-background"
                    />
                </div>

                {/* Filter Controls */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
                    {/* Category */}
                    <Select value={filters.category || "all"} onValueChange={setters.setCategory}>
                        <SelectTrigger className="h-10 w-full sm:w-[150px] bg-background">
                            <SelectValue placeholder="Category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Categories</SelectItem>
                            {businessCategories.map((cat) => (
                                <SelectItem key={cat.value} value={cat.value}>
                                    {cat.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* City */}
                    <Select value={filters.city || "all"} onValueChange={setters.setCity}>
                        <SelectTrigger className="h-10 w-full sm:w-[140px] bg-background">
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground shrink-0" />
                                <SelectValue placeholder="City" />
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Cities</SelectItem>
                            {albanianCities.map((c) => (
                                <SelectItem key={c} value={c}>
                                    {c}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    {/* Divider */}
                    <div className="hidden sm:block h-6 w-px bg-border" />

                    {/* Advanced Filters Sheet */}
                    <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="default" className="h-10 bg-background">
                                <SlidersHorizontal className="h-4 w-4 sm:mr-2" />
                                <span className="hidden sm:inline">Filters</span>
                                {advancedFiltersCount > 0 && (
                                    <Badge variant="secondary" className="ml-2 h-5 w-5 p-0 justify-center text-xs">
                                        {advancedFiltersCount}
                                    </Badge>
                                )}
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="w-full sm:max-w-md flex flex-col">
                            <SheetHeader className="text-left">
                                <SheetTitle className="text-xl">Filters</SheetTitle>
                                <SheetDescription>Refine your search with advanced filtering options</SheetDescription>
                            </SheetHeader>

                            <div className="flex-1 overflow-y-auto py-6">
                                <div className="space-y-6">
                                    {/* Price Range */}
                                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="text-sm font-medium">Price Range</Label>
                                        </div>
                                        <Slider
                                            value={filters.priceRange}
                                            onValueChange={(v) => setters.setPriceRange(v as [number, number])}
                                            min={0}
                                            max={MAX_LISTING_PRICE}
                                            step={50000}
                                            className="mb-4"
                                        />
                                        <div className="flex items-center justify-between gap-4">
                                            <div className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-center">
                                                <span className="text-xs text-muted-foreground block">Min</span>
                                                <span className="text-sm font-medium">{formatCurrency(filters.priceRange[0], "EUR")}</span>
                                            </div>
                                            <div className="text-muted-foreground">—</div>
                                            <div className="flex-1 rounded-md border border-border bg-background px-3 py-2 text-center">
                                                <span className="text-xs text-muted-foreground block">Max</span>
                                                <span className="text-sm font-medium">{formatCurrency(filters.priceRange[1], "EUR")}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Minimum ROI */}
                                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <Label className="text-sm font-medium">Minimum ROI</Label>
                                            <span className="text-xs text-muted-foreground">Annual return on investment</span>
                                        </div>
                                        <Slider
                                            value={[filters.minRoi]}
                                            onValueChange={(v) => setters.setMinRoi(v[0])}
                                            min={0}
                                            max={100}
                                            step={5}
                                            className="mb-4"
                                        />
                                        <div className="rounded-md border border-border bg-background px-3 py-2 text-center">
                                            <span className="text-sm font-medium">
                                                {filters.minRoi > 0 ? `${filters.minRoi}% or higher` : "No minimum"}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Sort By (Mobile Sheet) */}
                                    <div className="rounded-lg border border-border bg-muted/30 p-4">
                                        <Label className="text-sm font-medium block mb-3">Sort By</Label>
                                        <Select value={filters.sortBy} onValueChange={setters.setSortBy}>
                                            <SelectTrigger className="bg-background">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="price-low">Price: Low to High</SelectItem>
                                                <SelectItem value="price-high">Price: High to Low</SelectItem>
                                                <SelectItem value="roi">Highest ROI</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Actions */}
                            <SheetFooter className="border-t border-border pt-4 gap-2 sm:gap-2">
                                {activeFiltersList.length > 0 && (
                                    <Button
                                        variant="outline"
                                        className="flex-1 bg-transparent"
                                        onClick={() => {
                                            setters.clearAllFilters()
                                            setIsFilterOpen(false)
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                )}
                                <Button className="flex-1" onClick={() => setIsFilterOpen(false)}>
                                    Show Results
                                </Button>
                            </SheetFooter>
                        </SheetContent>
                    </Sheet>

                    {/* Sort (Desktop) */}
                    <Select value={filters.sortBy} onValueChange={setters.setSortBy}>
                        <SelectTrigger className="hidden lg:flex h-10 w-[150px] bg-background">
                            <SelectValue placeholder="Sort By" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="newest">Newest First</SelectItem>
                            <SelectItem value="price-low">Price: Low to High</SelectItem>
                            <SelectItem value="price-high">Price: High to Low</SelectItem>
                            <SelectItem value="roi">Highest ROI</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Active Filters Badges */}
            {activeFiltersList.length > 0 && (
                <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active Filters:</span>
                    {activeFiltersList.map((filter) => (
                        <Badge
                            key={filter.key}
                            variant="secondary"
                            className="flex items-center gap-1 pr-1 bg-primary/10 text-primary hover:bg-primary/20"
                        >
                            {filter.label}
                            <button onClick={filter.onRemove} className="ml-1 rounded-full p-0.5 hover:bg-primary/20">
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={setters.clearAllFilters}
                        className="text-muted-foreground hover:text-foreground h-7 px-2"
                    >
                        Clear All
                    </Button>
                </div>
            )}
        </div>
    )
}
