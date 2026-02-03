"use client"

import Link from "next/link"
import Image from "next/image"
import { MoreVertical, Eye, Edit, Trash2, Archive, Lock, Globe, TrendingUp, Users } from "lucide-react"
import { formatCurrency, type Currency } from "@/lib/currency"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { businessCategories } from "@/lib/constants"
import type { Listing } from "@/lib/api/types"

import { useState, useEffect } from "react"
import { useDeleteListing } from "@/lib/hooks/useListings"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"

interface AgentListingCardProps {
    listing: Listing
}

export function AgentListingCard({ listing }: AgentListingCardProps) {
    const [showDeleteAlert, setShowDeleteAlert] = useState(false)
    const [currency, setCurrency] = useState<Currency>("EUR")

    const deleteListing = useDeleteListing()

    useEffect(() => {
        const saved = localStorage.getItem("currency") as Currency
        if (saved) setCurrency(saved)
    }, [])

    const getCategoryLabel = (category: string) => {
        return businessCategories.find((c) => c.value === category)?.label ?? category
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "active":
                return <Badge className="bg-verified/10 text-verified">Active</Badge>
            case "draft":
                return <Badge variant="secondary">Draft</Badge>
            case "sold":
                return <Badge className="bg-primary/10 text-primary">Sold</Badge>
            case "archived":
                return <Badge variant="outline">Archived</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const handleDelete = async () => {
        try {
            await deleteListing.mutateAsync(listing.id)
            toast({
                title: "Deleted",
                description: "Listing deleted successfully"
            })
            setShowDeleteAlert(false)
        } catch (error: any) {
            toast({
                title: "Error",
                description: error.message || "Failed to delete listing",
                variant: "destructive"
            })
        }
    }

    return (
        <>
            <Card className="group overflow-hidden border-border hover:border-primary/50 hover:shadow-lg transition-all duration-300">
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                    <Image
                        src={listing.images[0]?.url || "/placeholder.svg?height=400&width=600&query=business storefront"}
                        alt={listing.public_title_en}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Category Badge */}
                    <Badge className="absolute top-3 left-3 bg-card/90 text-card-foreground backdrop-blur-sm">
                        {getCategoryLabel(listing.category)}
                    </Badge>

                    {/* Status Badge */}
                    <div className="absolute top-3 right-12 z-10">
                        {getStatusBadge(listing.status)}
                    </div>

                    {/* Actions Menu */}
                    <div className="absolute top-2 right-2 z-20">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full bg-card/80 backdrop-blur-sm hover:bg-card text-foreground">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                    <Link href={`/listings/${listing.id}`}>
                                        <Eye className="mr-2 h-4 w-4" />
                                        View Public
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <Link href={`/agent/listings/${listing.id}/edit`}>
                                        <Edit className="mr-2 h-4 w-4" />
                                        Edit
                                    </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem>
                                    <Archive className="mr-2 h-4 w-4" />
                                    Archive
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-destructive focus:text-destructive"
                                    onSelect={() => setShowDeleteAlert(true)}
                                >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Delete
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </div>

                <CardContent className="p-4">
                    {/* Title & Location */}
                    <h3 className="font-semibold text-lg text-foreground line-clamp-1 group-hover:text-primary transition-colors">
                        {listing.public_title_en}
                    </h3>

                    {/* Real Business Name (Private) */}
                    <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground bg-muted/50 p-1 rounded inline-flex">
                        <Lock className="h-3 w-3" />
                        <span>{listing.real_business_name || "Not Available"}</span>
                    </div>

                    <div className="flex items-center gap-1 mt-2 text-muted-foreground">
                        <Globe className="h-3.5 w-3.5" />
                        <span className="text-sm">
                            {listing.public_location_area && `${listing.public_location_area}, `}{listing.public_location_city_en}
                        </span>
                    </div>

                    {/* Real Address (Private) */}
                    {listing.real_location_address && (
                        <div className="flex items-center gap-1 mt-1 text-muted-foreground">
                            <Lock className="h-3.5 w-3.5" />
                            <span className="text-sm">
                                {listing.real_location_address}
                            </span>
                        </div>
                    )}

                    {/* Price */}
                    <div className="mt-4 flex justify-between items-end">
                        <span className="text-2xl font-bold text-foreground">{formatCurrency(listing.asking_price_eur, currency)}</span>
                    </div>

                    {/* Key Metrics */}
                    <div className="mt-4 grid grid-cols-3 gap-3 pt-4 border-t border-border">
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span className="text-xs">Revenue</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{listing.monthly_revenue_eur ? formatCurrency(listing.monthly_revenue_eur, currency) : "-"}</p>
                        </div>
                        <div className="text-center border-x border-border">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                <TrendingUp className="h-3.5 w-3.5" />
                                <span className="text-xs">ROI</span>
                            </div>
                            <p className="text-sm font-semibold text-accent">{listing.roi ? `${listing.roi}%` : "-"}</p>
                        </div>
                        <div className="text-center">
                            <div className="flex items-center justify-center gap-1 text-muted-foreground">
                                <Users className="h-3.5 w-3.5" />
                                <span className="text-xs">Staff</span>
                            </div>
                            <p className="text-sm font-semibold text-foreground mt-0.5">{listing.employee_count || "-"}</p>
                        </div>
                    </div>

                    {/* Stats Footer */}
                    <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground bg-accent/5 p-2 rounded">
                        <div className="flex items-center gap-1">
                            <Eye className="h-3.5 w-3.5" />
                            <span>{listing.view_count} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <span className="text-sm">Status: {listing.status}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete this listing and remove it from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={(e) => {
                                e.preventDefault()
                                handleDelete()
                            }}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            disabled={deleteListing.isPending}
                        >
                            {deleteListing.isPending ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    )
}
