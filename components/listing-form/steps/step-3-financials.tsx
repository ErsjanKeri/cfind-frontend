"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import type { ListingFormData, ListingFormErrors } from "../use-listing-form"

interface Step3Props {
    data: ListingFormData
    updateData: (field: string, value: string | number | boolean | string[]) => void
    errors?: ListingFormErrors
}

export function Step3Financials({ data, updateData, errors }: Step3Props) {
    // Calculate ROI for display
    // ROI = (Monthly Revenue × 12) / Asking Price × 100
    const roi = (data.monthly_revenue_eur && data.asking_price_eur)
        ? ((Number(data.monthly_revenue_eur) * 12) / Number(data.asking_price_eur) * 100).toFixed(1)
        : "N/A"

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-1">Financial Information</h3>
                <p className="text-sm text-muted-foreground">All prices in EUR (€)</p>
            </div>

            {/* Asking Price */}
            <FormFieldWrapper
                label="Asking Price (EUR) *"
                htmlFor="asking_price_eur"
                error={errors?.asking_price_eur}
            >
                <Input
                    id="asking_price_eur"
                    type="number"
                    value={data.asking_price_eur}
                    onChange={(e) => updateData("asking_price_eur", parseFloat(e.target.value) || "")}
                    placeholder="e.g. 150000"
                    className={errors?.asking_price_eur ? "border-red-500" : ""}
                />
            </FormFieldWrapper>

            <Separator />

            {/* Monthly Revenue */}
            <FormFieldWrapper
                label="Monthly Revenue (EUR) - Optional"
                htmlFor="monthly_revenue_eur"
                error={errors?.monthly_revenue_eur}
            >
                <Input
                    id="monthly_revenue_eur"
                    type="number"
                    value={data.monthly_revenue_eur}
                    onChange={(e) => updateData("monthly_revenue_eur", parseFloat(e.target.value) || "")}
                    placeholder="e.g. 15000"
                    className={errors?.monthly_revenue_eur ? "border-red-500" : ""}
                />
            </FormFieldWrapper>

            {/* ROI Display */}
            {roi !== "N/A" && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Estimated Annual ROI</span>
                        <span className="text-2xl font-bold text-primary">{roi}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        (Monthly Revenue × 12 / Asking Price × 100)
                    </p>
                </div>
            )}

            <Separator />

            {/* Other Details */}
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Employee Count"
                    htmlFor="employee_count"
                >
                    <Input
                        id="employee_count"
                        type="number"
                        value={data.employee_count}
                        onChange={(e) => updateData("employee_count", parseInt(e.target.value) || "")}
                        placeholder="e.g. 5"
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Years in Operation"
                    htmlFor="years_in_operation"
                >
                    <Input
                        id="years_in_operation"
                        type="number"
                        value={data.years_in_operation}
                        onChange={(e) => updateData("years_in_operation", parseInt(e.target.value) || "")}
                        placeholder="e.g. 3"
                    />
                </FormFieldWrapper>
            </div>

            {/* Physically Verified */}
            <div className="flex items-center space-x-2 pt-2">
                <Switch
                    id="is_physically_verified"
                    checked={data.is_physically_verified}
                    onCheckedChange={(checked) => updateData("is_physically_verified", checked)}
                />
                <Label htmlFor="is_physically_verified" className="cursor-pointer">
                    Physically Verified Listing
                </Label>
            </div>
        </div>
    )
}
