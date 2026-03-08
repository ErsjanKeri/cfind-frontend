"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Building } from "lucide-react"
import { SearchInput } from "@/components/shared/search-input"
import { businessCategories, getCountryCities, type CountryCode } from "@/lib/constants"

interface SearchBarProps {
  country: CountryCode
  variant?: "hero" | "compact"
  initialValues?: {
    query?: string
    category?: string
    city?: string
  }
}

export function SearchBar({ country, variant = "hero", initialValues }: SearchBarProps) {
  const router = useRouter()
  const [query, setQuery] = useState(initialValues?.query ?? "")
  const [category, setCategory] = useState(initialValues?.category ?? "")
  const [city, setCity] = useState(initialValues?.city ?? "")

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (query) params.set("q", query)
    if (category) params.set("category", category)
    if (city) params.set("city", city)

    router.push(`/${country}/listings?${params.toString()}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-2 w-full">
        <SearchInput
          placeholder="Search businesses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          wrapperClassName="flex-1"
        />
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger className="w-[140px]">
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
        <Button onClick={handleSearch}>Search</Button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-card rounded-2xl shadow-lg border border-border p-2">
        <div className="flex flex-col md:flex-row md:items-center gap-2">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder="Search businesses..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              className="h-14 pl-12 text-base border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-border" />

          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="h-14 w-full md:w-[180px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0 pl-4 gap-2">
              <Building className="h-5 w-5 text-muted-foreground flex-shrink-0" />
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

          {/* Divider */}
          <div className="hidden md:block w-px h-8 bg-border" />

          {/* City Select */}
          <Select value={city} onValueChange={setCity}>
            <SelectTrigger className="h-14 w-full md:w-[160px] border-0 bg-transparent focus:ring-0 focus:ring-offset-0 pl-4 gap-2">
              <MapPin className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              <SelectValue placeholder="City" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Cities</SelectItem>
              {getCountryCities(country).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Search Button - matching height */}
          <Button onClick={handleSearch} className="h-14 px-8 rounded-xl">
            <Search className="mr-2 h-5 w-5" />
            Search
          </Button>
        </div>
      </div>
    </div>
  )
}
