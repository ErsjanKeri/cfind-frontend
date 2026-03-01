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
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Skeleton className="h-4 w-28 mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-44" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          {/* Saved Listings Grid - matches sm:grid-cols-2 lg:grid-cols-3 */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <ListingCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
