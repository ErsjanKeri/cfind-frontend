import { useMemo } from "react"
import { useToggleSavedListing, useSavedListings } from "@/lib/hooks/useLeads"
import { toast } from "sonner"
import { getErrorMessage } from "@/lib/utils"

export function useSavedListing(listingId: string | undefined) {
    const { data: savedListings } = useSavedListings()
    const toggleMutation = useToggleSavedListing()

    const isSaved = useMemo(() => {
        if (!listingId || !savedListings) return false
        return savedListings.some((saved) => saved.id === listingId)
    }, [savedListings, listingId])

    const toggleSave = async () => {
        if (!listingId) return

        try {
            const result = await toggleMutation.mutateAsync(listingId)
            toast.success(result.is_saved ? "Listing saved!" : "Listing unsaved")
        } catch (error: unknown) {
            toast.error(getErrorMessage(error, "Failed to save listing"))
        }
    }

    return {
        isSaved,
        toggleSave,
        isPending: toggleMutation.isPending,
    }
}
