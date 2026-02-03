import Link from "next/link"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { FileQuestion, ArrowLeft } from "lucide-react"

export default function ListingNotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-6">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-2xl font-bold text-foreground">Listing Not Found</h1>
          <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
            This listing may have been removed or is no longer available.
          </p>
          <Link href="/listings" className="inline-block mt-6">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Listings
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}
