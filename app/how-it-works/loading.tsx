import { Skeleton } from "@/components/ui/skeleton"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section Skeleton */}
        <section className="bg-gradient-to-b from-primary/5 via-background to-background">
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge pill */}
              <div className="flex justify-center">
                <Skeleton className="h-8 w-52 rounded-full" />
              </div>
              {/* Heading */}
              <Skeleton className="h-12 w-80 mx-auto" />
              {/* Description lines */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-full mx-auto" />
                <Skeleton className="h-5 w-5/6 mx-auto" />
                <Skeleton className="h-5 w-4/6 mx-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Problem Section Skeleton */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <Skeleton className="h-9 w-96 mx-auto" />
              <Skeleton className="h-5 w-80 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border p-6 space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-5 w-32" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional content sections skeleton */}
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 space-y-3">
              <Skeleton className="h-9 w-64 mx-auto" />
              <Skeleton className="h-5 w-96 mx-auto" />
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="rounded-lg border border-border bg-card p-6 space-y-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <Skeleton className="h-5 w-40" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section Skeleton */}
        <section className="py-16 sm:py-24 bg-primary">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <Skeleton className="h-10 w-56 mx-auto bg-primary-foreground/20" />
            <Skeleton className="h-5 w-96 mx-auto bg-primary-foreground/20" />
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Skeleton className="h-11 w-40 rounded-md bg-primary-foreground/20" />
              <Skeleton className="h-11 w-40 rounded-md bg-primary-foreground/20" />
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
