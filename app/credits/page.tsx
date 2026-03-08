'use client';

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CreditsPageClient } from "./credits-client"
import { useUser } from "@/lib/hooks/useAuth"
import { useCreditPackages, useAgentCredits } from "@/lib/hooks/usePromotions"
import { Skeleton } from "@/components/ui/skeleton"

export default function CreditsPage() {
    const router = useRouter()
    const { user, isLoading: authLoading } = useUser()

    // Redirect if not agent
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'agent')) {
            router.push('/profile')
        }
    }, [user, authLoading, router])

    const { data: packages, isLoading: packagesLoading } = useCreditPackages()
    const { data: creditsData, isLoading: creditsLoading } = useAgentCredits()

    // Show loading state while fetching auth or data
    if (authLoading || packagesLoading || creditsLoading) {
        return (
            <div className="min-h-screen flex flex-col bg-background">
                <Header />
                <main className="flex-1 container py-8">
                    <Skeleton className="h-8 w-64 mb-4" />
                    <Skeleton className="h-96 w-full" />
                </main>
                <Footer />
            </div>
        )
    }

    // Check if agent is verified
    const isVerified = user?.agent_profile?.verification_status === "approved"

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />
            <main className="flex-1">
                <CreditsPageClient
                    packages={packages || []}
                    initialBalance={creditsData?.balance || 0}
                    transactions={creditsData?.transactions || []}
                    isVerified={isVerified}
                />
            </main>
            <Footer />
        </div>
    )
}
