"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { LoadingButton } from "@/components/shared/loading-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormError } from "@/components/shared/form-error"
import { useCreateDemand } from "@/lib/hooks/useDemands"
import { businessCategories, albanianCities } from "@/lib/constants"

interface DemandDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

export function DemandDialog({ open, onOpenChange, onSuccess }: DemandDialogProps) {
    const createDemand = useCreateDemand()
    const [formData, setFormData] = useState({
        demand_type: "investor" as "investor" | "seeking_funding",
        budget_min_eur: "",
        budget_max_eur: "",
        category: "",
        preferred_city_en: "",
        preferred_area: "",
        description: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState<string | null>(null)

    const updateField = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleCityChange = (city: string) => {
        setFormData(prev => ({
            ...prev,
            preferred_city_en: city,
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setErrors({})
        setFormError(null)

        try {
            await createDemand.mutateAsync({
                description: formData.description,
                category: formData.category,
                preferred_city_en: formData.preferred_city_en,
                preferred_area: formData.preferred_area || undefined,
                budget_min_eur: parseFloat(formData.budget_min_eur),
                budget_max_eur: parseFloat(formData.budget_max_eur),
                demand_type: formData.demand_type,
            })

            toast.success("Demand created successfully!")
            onOpenChange(false)
            onSuccess?.()

            // Reset form
            setFormData({
                demand_type: "investor",
                budget_min_eur: "",
                budget_max_eur: "",
                category: "",
                preferred_city_en: "",
                preferred_area: "",
                description: "",
            })
        } catch (error: unknown) {
            // Show inline error for validation errors
            setFormError(error instanceof Error ? error.message : "An unexpected error occurred")
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Post Your Business Need</DialogTitle>
                    <DialogDescription>Tell us what you're looking for and get matched with verified agents</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Error Display */}
                    <FormError error={formError} title="Failed to Create Demand" />

                    {/* Demand Type Selector */}
                    <div className="space-y-2">
                        <Label className="text-base font-medium">I am *</Label>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, demand_type: "investor" }))}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    formData.demand_type === "investor"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="font-medium text-emerald-700">Looking to Invest</span>
                                <p className="text-sm text-muted-foreground mt-1">I have capital and want to buy a business</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, demand_type: "seeking_funding" }))}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    formData.demand_type === "seeking_funding"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="font-medium text-blue-700">Seeking Investment</span>
                                <p className="text-sm text-muted-foreground mt-1">I need funding for my business</p>
                            </button>
                        </div>
                    </div>

                    {/* Budget Section */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Budget Range (EUR) *</Label>
                        <div className="grid grid-cols-2 gap-4">
                            <Input
                                type="number"
                                placeholder="Min Budget"
                                value={formData.budget_min_eur}
                                onChange={(e) => updateField("budget_min_eur", e.target.value)}
                                className={errors.budget_min_eur ? "border-red-500" : ""}
                            />
                            <Input
                                type="number"
                                placeholder="Max Budget"
                                value={formData.budget_max_eur}
                                onChange={(e) => updateField("budget_max_eur", e.target.value)}
                                className={errors.budget_max_eur ? "border-red-500" : ""}
                            />
                        </div>
                        {errors.budget_max_eur && (
                            <p className="text-sm text-red-500">{errors.budget_max_eur}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div className="space-y-2">
                        <Label>Business Category *</Label>
                        <Select value={formData.category} onValueChange={(v) => updateField("category", v)}>
                            <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {businessCategories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category && (
                            <p className="text-sm text-red-500">{errors.category}</p>
                        )}
                    </div>

                    {/* City */}
                    <div className="space-y-2">
                        <Label>Preferred City *</Label>
                        <Select
                            value={formData.preferred_city_en}
                            onValueChange={handleCityChange}
                        >
                            <SelectTrigger className={errors.preferred_city_en ? "border-red-500" : ""}>
                                <SelectValue placeholder="Select a city" />
                            </SelectTrigger>
                            <SelectContent>
                                {albanianCities.map((city) => (
                                    <SelectItem key={city} value={city}>
                                        {city}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.preferred_city_en && (
                            <p className="text-sm text-red-500">{errors.preferred_city_en}</p>
                        )}
                    </div>

                    {/* Area (Optional) */}
                    <div className="space-y-2">
                        <Label>Preferred Area</Label>
                        <Input
                            value={formData.preferred_area}
                            onChange={(e) => updateField("preferred_area", e.target.value)}
                            placeholder="e.g., Blloku, Pazari i Ri"
                        />
                    </div>

                    {/* Description */}
                    <div className="space-y-2">
                        <Label>Description *</Label>
                        <Textarea
                            value={formData.description}
                            onChange={(e) => updateField("description", e.target.value)}
                            placeholder="Describe what you're looking for..."
                            rows={4}
                            className={errors.description ? "border-red-500" : ""}
                        />
                        {errors.description && (
                            <p className="text-sm text-red-500">{errors.description}</p>
                        )}
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <LoadingButton type="submit" isLoading={createDemand.isPending} loadingText="Submitting...">
                            Submit Demand
                        </LoadingButton>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
