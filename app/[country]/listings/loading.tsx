import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCardSkeleton } from "@/components/shared/listing-card-skeleton"

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
