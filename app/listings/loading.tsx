import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

function ListingCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      {/* Image placeholder */}
      <Skeleton className="h-48 w-full rounded-none" />
      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category badge */}
        <Skeleton className="h-5 w-20 rounded-full" />
        {/* Title */}
        <Skeleton className="h-5 w-3/4" />
        {/* Location */}
        <Skeleton className="h-4 w-1/2" />
        {/* Price */}
        <Skeleton className="h-6 w-28" />
        {/* Stats row */}
        <div className="flex gap-4 pt-2">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          {/* Page header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="space-y-2">
              <Skeleton className="h-9 w-40" />
              <Skeleton className="h-5 w-72" />
            </div>
            <Skeleton className="h-10 w-40 rounded-md" />
          </div>

          {/* Filters placeholder */}
          <div className="flex flex-wrap gap-3">
            <Skeleton className="h-10 w-44 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-36 rounded-md" />
            <Skeleton className="h-10 w-28 rounded-md" />
          </div>

          {/* Listings grid - matches sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
