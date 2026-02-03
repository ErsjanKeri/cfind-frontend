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
import { FormError } from "@/components/ui/form-error"
import { useCreateDemand } from "@/lib/hooks/useDemands"
import { businessCategories, albanianCities } from "@/lib/constants"
import { Loader2 } from "lucide-react"

interface DemandDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess?: () => void
}

const EUR_TO_LEK_RATE = 100

export function DemandDialog({ open, onOpenChange, onSuccess }: DemandDialogProps) {
    const createDemand = useCreateDemand()
    const [formData, setFormData] = useState({
        demandType: "investor" as "investor" | "seeking_funding",
        budgetMinEur: "",
        budgetMaxEur: "",
        budgetMinLek: "",
        budgetMaxLek: "",
        category: "",
        preferredCityEn: "",
        preferredArea: "",
        description: "",
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [formError, setFormError] = useState<string | null>(null)

    const updateField = (field: string, value: string) => {
        setFormData(prev => {
            const updated = { ...prev, [field]: value }

            // Auto-convert between EUR and LEK
            if (field === "budgetMinEur" && value) {
                updated.budgetMinLek = String(parseFloat(value) * EUR_TO_LEK_RATE)
            } else if (field === "budgetMaxEur" && value) {
                updated.budgetMaxLek = String(parseFloat(value) * EUR_TO_LEK_RATE)
            } else if (field === "budgetMinLek" && value) {
                updated.budgetMinEur = String(parseFloat(value) / EUR_TO_LEK_RATE)
            } else if (field === "budgetMaxLek" && value) {
                updated.budgetMaxEur = String(parseFloat(value) / EUR_TO_LEK_RATE)
            }

            return updated
        })
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: "" }))
        }
    }

    const handleCityChange = (city: string) => {
        setFormData(prev => ({
            ...prev,
            preferredCityEn: city,
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
                preferred_city_en: formData.preferredCityEn,
                preferred_area: formData.preferredArea || undefined,
                budget_min_eur: parseFloat(formData.budgetMinEur),
                budget_max_eur: parseFloat(formData.budgetMaxEur),
                budget_min_lek: parseFloat(formData.budgetMinLek),
                budget_max_lek: parseFloat(formData.budgetMaxLek),
                demand_type: formData.demandType,
            })

            toast.success("Demand created successfully!")
            onOpenChange(false)
            onSuccess?.()

            // Reset form
            setFormData({
                demandType: "investor",
                budgetMinEur: "",
                budgetMaxEur: "",
                budgetMinLek: "",
                budgetMaxLek: "",
                category: "",
                preferredCityEn: "",
                preferredArea: "",
                description: "",
            })
        } catch (error: any) {
            // Show inline error for validation errors
            setFormError(error.message || "Failed to create demand")
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
                                onClick={() => setFormData(prev => ({ ...prev, demandType: "investor" }))}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    formData.demandType === "investor"
                                        ? "border-emerald-500 bg-emerald-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="font-medium text-emerald-700">Looking to Invest</span>
                                <p className="text-sm text-muted-foreground mt-1">I have capital and want to buy a business</p>
                            </button>
                            <button
                                type="button"
                                onClick={() => setFormData(prev => ({ ...prev, demandType: "seeking_funding" }))}
                                className={`p-4 rounded-lg border-2 text-left transition-all ${
                                    formData.demandType === "seeking_funding"
                                        ? "border-blue-500 bg-blue-50"
                                        : "border-gray-200 hover:border-gray-300"
                                }`}
                            >
                                <span className="font-medium text-blue-700">Seeking Investment</span>
                                <p className="text-sm text-muted-foreground mt-1">I need funding for my business</p>
                            </button>
                        </div>
                    </div>

                    {/* Budget Section - Dual Currency */}
                    <div className="space-y-4">
                        <Label className="text-base font-medium">Budget Range *</Label>
                        <div className="grid grid-cols-2 gap-4">
                            {/* EUR */}
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Euro (EUR)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={formData.budgetMinEur}
                                        onChange={(e) => updateField("budgetMinEur", e.target.value)}
                                        className={errors.budgetMinEur ? "border-red-500" : ""}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={formData.budgetMaxEur}
                                        onChange={(e) => updateField("budgetMaxEur", e.target.value)}
                                        className={errors.budgetMaxEur ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>
                            {/* LEK */}
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">Lekë (ALL)</Label>
                                <div className="grid grid-cols-2 gap-2">
                                    <Input
                                        type="number"
                                        placeholder="Min"
                                        value={formData.budgetMinLek}
                                        onChange={(e) => updateField("budgetMinLek", e.target.value)}
                                        className={errors.budgetMinLek ? "border-red-500" : ""}
                                    />
                                    <Input
                                        type="number"
                                        placeholder="Max"
                                        value={formData.budgetMaxLek}
                                        onChange={(e) => updateField("budgetMaxLek", e.target.value)}
                                        className={errors.budgetMaxLek ? "border-red-500" : ""}
                                    />
                                </div>
                            </div>
                        </div>
                        {errors.budgetMaxEur && (
                            <p className="text-sm text-red-500">{errors.budgetMaxEur}</p>
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
                            value={formData.preferredCityEn}
                            onValueChange={handleCityChange}
                        >
                            <SelectTrigger className={errors.preferredCityEn ? "border-red-500" : ""}>
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
                        {errors.preferredCityEn && (
                            <p className="text-sm text-red-500">{errors.preferredCityEn}</p>
                        )}
                    </div>

                    {/* Area (Optional) */}
                    <div className="space-y-2">
                        <Label>Preferred Area</Label>
                        <Input
                            value={formData.preferredArea}
                            onChange={(e) => updateField("preferredArea", e.target.value)}
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
                        <Button type="submit" disabled={createDemand.isPending}>
                            {createDemand.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {createDemand.isPending ? "Submitting..." : "Submit Demand"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
