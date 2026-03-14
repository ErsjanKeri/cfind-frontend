"use client"

import { useState, useCallback } from "react"
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { businessCategories, MAX_LISTING_PRICE } from "@/lib/constants"
import type { ListingFilters } from "@/lib/api/types"

interface UseListingFiltersOptions {
    country: string
}

const PAGE_SIZE = 20

export function useListingFilters({ country }: UseListingFiltersOptions) {
    const searchParams = useSearchParams()
    const router = useRouter()
    const pathname = usePathname()

    const getInitialCategory = () => {
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
    const [query, setQuery] = useState(searchParams.get("q") || "")
    const [category, setCategory] = useState<string>(getInitialCategory())
    const [city, setCity] = useState<string>(searchParams.get("city") || "")

    const initialMinPrice = searchParams.get("minPrice") ? Number(searchParams.get("minPrice")) : 0
    const initialMaxPrice = searchParams.get("maxPrice") ? Number(searchParams.get("maxPrice")) : MAX_LISTING_PRICE
    const [priceRange, setPriceRange] = useState<[number, number]>([initialMinPrice, initialMaxPrice])

    const [minRoi, setMinRoi] = useState<number>(searchParams.get("minRoi") ? Number(searchParams.get("minRoi")) : 0)
    const [sortBy, setSortBy] = useState<string>(searchParams.get("sortBy") || "newest")
    const [page, setPage] = useState<number>(searchParams.get("page") ? Number(searchParams.get("page")) : 1)

    // Build current URL params from state
    const buildUrlParams = useCallback(
        (overrides: Record<string, string | number | undefined> = {}) => {
            const state: Record<string, string | number | undefined> = {
                category: category || undefined,
                city: city || undefined,
                q: query || undefined,
                minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
                maxPrice: priceRange[1] < MAX_LISTING_PRICE ? priceRange[1] : undefined,
                minRoi: minRoi > 0 ? minRoi : undefined,
                sortBy: sortBy !== "newest" ? sortBy : undefined,
                ...overrides,
            }

            const params = new URLSearchParams()
            for (const [key, value] of Object.entries(state)) {
                if (value !== undefined && value !== "") {
                    params.set(key, String(value))
                }
            }
            return params
        },
        [category, city, query, priceRange, minRoi, sortBy],
    )

    const replaceUrl = useCallback(
        (params: URLSearchParams) => {
            const newUrl = params.toString() ? `${pathname}?${params.toString()}` : pathname
            router.replace(newUrl, { scroll: false })
        },
        [pathname, router],
    )

    // All filter changes reset to page 1
    const handleCategoryChange = (value: string) => {
        const newCategory = value === "all" ? "" : value
        setCategory(newCategory)
        setPage(1)
        replaceUrl(buildUrlParams({ category: newCategory || undefined }))
    }

    const handleCityChange = (value: string) => {
        const newCity = value === "all" ? "" : value
        setCity(newCity)
        setPage(1)
        replaceUrl(buildUrlParams({ city: newCity || undefined }))
    }

    const handleQueryChange = (value: string) => {
        setQuery(value)
        setPage(1)
        replaceUrl(buildUrlParams({ q: value || undefined }))
    }

    const handlePriceRangeChange = (value: [number, number]) => {
        setPriceRange(value)
        setPage(1)
        replaceUrl(buildUrlParams({
            minPrice: value[0] > 0 ? value[0] : undefined,
            maxPrice: value[1] < MAX_LISTING_PRICE ? value[1] : undefined,
        }))
    }

    const handleMinRoiChange = (value: number) => {
        setMinRoi(value)
        setPage(1)
        replaceUrl(buildUrlParams({ minRoi: value > 0 ? value : undefined }))
    }

    const handleSortByChange = (value: string) => {
        setSortBy(value)
        setPage(1)
        replaceUrl(buildUrlParams({ sortBy: value !== "newest" ? value : undefined }))
    }

    const handlePageChange = (newPage: number) => {
        setPage(newPage)
        const params = buildUrlParams()
        if (newPage > 1) params.set("page", String(newPage))
        replaceUrl(params)
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    const clearAllFilters = () => {
        setQuery("")
        setCategory("")
        setCity("")
        setPriceRange([0, MAX_LISTING_PRICE])
        setMinRoi(0)
        setSortBy("newest")
        setPage(1)
        router.replace(pathname, { scroll: false })
    }

    const activeFiltersCount =
        (category ? 1 : 0) +
        (city ? 1 : 0) +
        (priceRange[0] > 0 || priceRange[1] < MAX_LISTING_PRICE ? 1 : 0) +
        (minRoi > 0 ? 1 : 0)

    // Build API filter params for server-side filtering
    const apiFilters: ListingFilters = {
        country_code: country,
        page,
        limit: PAGE_SIZE,
        sort_by: sortBy as ListingFilters["sort_by"],
        ...(category && { category: category as ListingFilters["category"] }),
        ...(city && { city }),
        ...(query && { search: query }),
        ...(priceRange[0] > 0 && { min_price_eur: priceRange[0] }),
        ...(priceRange[1] < MAX_LISTING_PRICE && { max_price_eur: priceRange[1] }),
        ...(minRoi > 0 && { min_roi: minRoi }),
    }

    return {
        filters: {
            query,
            category,
            city,
            priceRange,
            minRoi,
            sortBy,
            activeFiltersCount,
        },
        setters: {
            setQuery: handleQueryChange,
            setCategory: handleCategoryChange,
            setCity: handleCityChange,
            setPriceRange: handlePriceRangeChange,
            setMinRoi: handleMinRoiChange,
            setSortBy: handleSortByChange,
            clearAllFilters,
        },
        page,
        setPage: handlePageChange,
        apiFilters,
    }
}
