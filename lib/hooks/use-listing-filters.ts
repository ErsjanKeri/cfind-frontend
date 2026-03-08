"use client"

import { useState, useMemo, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { businessCategories, MAX_LISTING_PRICE } from "@/lib/constants"
import type { Listing } from "@/lib/api/types"

interface UseListingFiltersOptions {
    initialData: Listing[]
    enableUrlSync?: boolean
}

export function useListingFilters({ initialData, enableUrlSync = true }: UseListingFiltersOptions) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const getInitialCategory = () => {
        if (!enableUrlSync) return ""
        const param = searchParams.get("category") || ""
        if (!param) return ""
        const directMatch = businessCategories.find((c) => c.value === param)
        if (directMatch) return directMatch.value
        const partialMatch = businessCategories.find(
            (c) => c.value.startsWith(param.toLowerCase()) || c.label.toLowerCase().startsWith(param.toLowerCase()),
        )
        return partialMatch?.value || ""
    }

    // State
    const [query, setQuery] = useState(enableUrlSync ? searchParams.get("q") || "" : "")
    const [category, setCategory] = useState<string>(getInitialCategory())
    const [city, setCity] = useState<string>(enableUrlSync ? searchParams.get("city") || "" : "")

    // Init Advanced State from URL
    const initialMinPrice = enableUrlSync && searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0
    const initialMaxPrice = enableUrlSync && searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : MAX_LISTING_PRICE
    const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])

    const [minRoi, setMinRoi] = useState<number>(enableUrlSync && searchParams.get("minRoi") ? Number(searchParams.get("minRoi")) : 0)
    const [sortBy, setSortBy] = useState<string>(enableUrlSync && searchParams.get("sortBy") ? searchParams.get("sortBy") || "newest" : "newest")
    const [listingStatus, setListingStatus] = useState<string>("active") // 'active', 'all', etc.

    // URL Sync
    const updateURL = useCallback(
        (newCategory: string, newCity: string, newQuery: string, newPriceRange: [number, number], newMinRoi: number, newSortBy: string) => {
            if (!enableUrlSync) return

            const params = new URLSearchParams(searchParams.toString())

            if (newCategory) params.set("category", newCategory)
            else params.delete("category")

            if (newCity) params.set("city", newCity)
            else params.delete("city")

            if (newQuery) params.set("q", newQuery)
            else params.delete("q")

            if (newPriceRange[0] > 0) params.set("minPrice", newPriceRange[0].toString())
            else params.delete("minPrice")

            if (newPriceRange[1] < MAX_LISTING_PRICE) params.set("maxPrice", newPriceRange[1].toString())
            else params.delete("maxPrice")

            if (newMinRoi > 0) params.set("minRoi", newMinRoi.toString())
            else params.delete("minRoi")

            if (newSortBy && newSortBy !== "newest") params.set("sortBy", newSortBy)
            else params.delete("sortBy")

            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
            router.replace(newUrl, { scroll: false })
        },
        [enableUrlSync, pathname, router, searchParams],
    )

    const handleCategoryChange = (value: string) => {
        const newCategory = value === "all" ? "" : value
        setCategory(newCategory)
        updateURL(newCategory, city, query, priceRange, minRoi, sortBy)
    }

    const handleCityChange = (value: string) => {
        const newCity = value === "all" ? "" : value
        setCity(newCity)
        updateURL(category, newCity, query, priceRange, minRoi, sortBy)
    }

    const handleQueryChange = (value: string) => {
        setQuery(value)
        updateURL(category, city, value, priceRange, minRoi, sortBy)
    }

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value)
        updateURL(category, city, query, value, minRoi, sortBy)
    }

    const handleMinRoiChange = (value: number) => {
        setMinRoi(value)
        updateURL(category, city, query, priceRange, value, sortBy)
    }

    const handleSortByChange = (value: string) => {
        setSortBy(value)
        updateURL(category, city, query, priceRange, minRoi, value)
    }

    const clearAllFilters = () => {
        setQuery("")
        setCategory("")
        setCity("")
        setPriceRange([0, MAX_LISTING_PRICE])
        setMinRoi(0)
        setSortBy("newest")
        if (enableUrlSync) {
            router.replace(pathname, { scroll: false })
        }
    }

    const filteredListings = useMemo(() => {
        let results = listingStatus !== "all"
            ? initialData.filter((listing) => listing.status === listingStatus)
            : [...initialData]

        // Apply category filter
        if (category) {
            results = results.filter((listing) => listing.category === category)
        }

        // Apply city filter
        if (city) {
            results = results.filter((listing) => listing.public_location_city_en === city)
        }

        // Apply search query filter
        if (query) {
            const q = query.toLowerCase()
            results = results.filter((listing) =>
                listing.public_title_en.toLowerCase().includes(q) ||
                listing.public_description_en.toLowerCase().includes(q) ||
                listing.category.toLowerCase().includes(q) ||
                (listing.public_location_area?.toLowerCase().includes(q))
            )
        }

        // Apply price range filter
        if (priceRange[0] > 0 || priceRange[1] < MAX_LISTING_PRICE) {
            results = results.filter((listing) =>
                listing.asking_price_eur >= priceRange[0] && listing.asking_price_eur <= priceRange[1]
            )
        }

        // Apply minimum ROI filter
        if (minRoi > 0) {
            results = results.filter((listing) => (listing.roi || 0) >= minRoi)
        }

        // Sort: promotion tier first, then by selected sort
        const tierOrder = { premium: 0, featured: 1, standard: 2 }
        results.sort((a, b) => {
            const tierA = tierOrder[a.promotion_tier as keyof typeof tierOrder] ?? 2
            const tierB = tierOrder[b.promotion_tier as keyof typeof tierOrder] ?? 2
            if (tierA !== tierB) return tierA - tierB

            switch (sortBy) {
                case "price-low":
                    return a.asking_price_eur - b.asking_price_eur
                case "price-high":
                    return b.asking_price_eur - a.asking_price_eur
                case "roi":
                    return (b.roi || 0) - (a.roi || 0)
                case "newest":
                default:
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
            }
        })

        return results
    }, [initialData, sortBy, listingStatus, category, city, query, priceRange, minRoi])

    const activeFiltersCount =
        (category ? 1 : 0) +
        (city ? 1 : 0) +
        (priceRange[0] > 0 || priceRange[1] < MAX_LISTING_PRICE ? 1 : 0) +
        (minRoi > 0 ? 1 : 0)

    return {
        filters: {
            query,
            category,
            city,
            priceRange,
            minRoi,
            sortBy,
            activeFiltersCount
        },
        setters: {
            setQuery: handleQueryChange,
            setCategory: handleCategoryChange,
            setCity: handleCityChange,
            setPriceRange: handlePriceRangeChange,
            setMinRoi: handleMinRoiChange,
            setSortBy: handleSortByChange,
            clearAllFilters,
            setListingStatus,
        },
        filteredListings,
    }
}
