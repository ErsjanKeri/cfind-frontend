import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-9 rounded-lg" />
            <Skeleton className="h-6 w-36" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-0 shadow-sm">
          {/* Card Header */}
          <div className="flex flex-col items-center space-y-2 p-6 pb-4">
            <Skeleton className="h-7 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>

          {/* Card Content - Form fields */}
          <div className="space-y-4 px-6 pb-4">
            {/* Email field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Password field */}
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
            {/* Forgot password link */}
            <div className="flex justify-end">
              <Skeleton className="h-4 w-28" />
            </div>
            {/* Submit button */}
            <Skeleton className="h-10 w-full rounded-md" />
          </div>

          {/* Card Footer */}
          <div className="flex flex-col items-center gap-4 p-6 pt-2">
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-10 w-full rounded-md" />
          </div>
        </div>
      </main>
    </div>
  )
}
