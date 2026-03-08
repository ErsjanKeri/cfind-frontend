import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ListingCardSkeleton } from "@/components/shared/listing-card-skeleton"

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
