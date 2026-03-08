"use client"

import { useState } from "react"
import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Shield,
  Heart,
  Share2,
  Loader2,
} from "lucide-react"
import { getCategoryLabel } from "@/lib/constants"

interface ListingImage {
  url: string
}

interface ListingImageGalleryProps {
  images: ListingImage[] | undefined
  title: string
  category: string
  isVerified: boolean
  isSaved: boolean
  isSaving: boolean
  onSave: () => void
}

export function ListingImageGallery({
  images,
  title,
  category,
  isVerified,
  isSaved,
  isSaving,
  onSave,
}: ListingImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const nextImage = () => {
    if (!images) return
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (!images) return
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-muted">
      <Image
        src={images?.[currentImageIndex]?.url || "/placeholder.svg?height=600&width=900&query=business"}
        alt={title}
        fill
        className="object-cover"
        priority
      />

      {images && images.length > 1 && (
        <>
          <button
            onClick={prevImage}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={nextImage}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`h-2 w-2 rounded-full transition-colors ${idx === currentImageIndex ? "bg-primary" : "bg-card/70"
                  }`}
              />
            ))}
          </div>
        </>
      )}

      <div className="absolute top-4 left-4 flex gap-2">
        <Badge className="bg-card/90 text-card-foreground backdrop-blur">
          {getCategoryLabel(category)}
        </Badge>
        {isVerified && (
          <Badge className="bg-verified text-verified-foreground">
            <Shield className="mr-1 h-3 w-3" />
            Agent Verified
          </Badge>
        )}
      </div>

      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onSave}
          disabled={isSaving}
          className="h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <Heart className={`h-5 w-5 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          )}
        </button>
        <button className="h-10 w-10 rounded-full bg-card/90 backdrop-blur flex items-center justify-center hover:bg-card transition-colors">
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
