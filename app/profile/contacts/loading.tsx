import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

function ContactCardSkeleton() {
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        {/* Listing Info */}
        <div className="flex-1 p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-12 w-12 rounded-lg shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-6 w-28" />
            </div>
          </div>
          <div className="mt-4">
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
        {/* Agent Info sidebar */}
        <div className="border-t sm:border-t-0 sm:border-l border-border p-4 sm:p-6 sm:w-64 bg-muted/30 space-y-3">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-9 w-full rounded-md" />
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
        <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Back Link */}
          <Skeleton className="h-4 w-28 mb-6" />

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-5 w-36" />
            </div>
          </div>

          {/* Contact History List */}
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <ContactCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
