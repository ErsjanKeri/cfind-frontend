"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper"

interface Step3Props {
    data: any
    updateData: (field: string, value: any) => void
    errors?: any
}

export function Step3Financials({ data, updateData, errors }: Step3Props) {
    // Calculate ROI for display (using EUR values)
    // ROI = (Monthly Revenue × 12) / Asking Price × 100
    const roi = (data.monthlyRevenueEur && data.askingPriceEur)
        ? ((data.monthlyRevenueEur * 12) / data.askingPriceEur * 100).toFixed(1)
        : "N/A"

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-medium mb-1">Financial Information</h3>
                <p className="text-sm text-muted-foreground">Enter prices in both EUR (€) and LEK (Lekë)</p>
            </div>

            {/* Asking Price - Dual Currency */}
            <div className="space-y-4">
                <Label className="text-base font-medium">Asking Price *</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="askingPriceEur" className="text-sm text-muted-foreground">
                            Euro (€)
                        </Label>
                        <Input
                            id="askingPriceEur"
                            type="number"
                            value={data.askingPriceEur}
                            onChange={(e) => updateData("askingPriceEur", parseFloat(e.target.value) || "")}
                            placeholder="e.g. 150000"
                            className={errors?.askingPriceEur ? "border-red-500" : ""}
                        />
                        {errors?.askingPriceEur && (
                            <p className="text-sm text-red-500">{errors.askingPriceEur}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="askingPriceLek" className="text-sm text-muted-foreground">
                            Lekë (ALL)
                        </Label>
                        <Input
                            id="askingPriceLek"
                            type="number"
                            value={data.askingPriceLek}
                            onChange={(e) => updateData("askingPriceLek", parseFloat(e.target.value) || "")}
                            placeholder="e.g. 15000000"
                            className={errors?.askingPriceLek ? "border-red-500" : ""}
                        />
                        {errors?.askingPriceLek && (
                            <p className="text-sm text-red-500">{errors.askingPriceLek}</p>
                        )}
                    </div>
                </div>
            </div>

            <Separator />

            {/* Monthly Revenue - Dual Currency */}
            <div className="space-y-4">
                <Label className="text-base font-medium">Monthly Revenue (Optional)</Label>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="monthlyRevenueEur" className="text-sm text-muted-foreground">
                            Euro (€)
                        </Label>
                        <Input
                            id="monthlyRevenueEur"
                            type="number"
                            value={data.monthlyRevenueEur}
                            onChange={(e) => updateData("monthlyRevenueEur", parseFloat(e.target.value) || "")}
                            placeholder="e.g. 15000"
                            className={errors?.monthlyRevenueEur ? "border-red-500" : ""}
                        />
                        {errors?.monthlyRevenueEur && (
                            <p className="text-sm text-red-500">{errors.monthlyRevenueEur}</p>
                        )}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="monthlyRevenueLek" className="text-sm text-muted-foreground">
                            Lekë (ALL)
                        </Label>
                        <Input
                            id="monthlyRevenueLek"
                            type="number"
                            value={data.monthlyRevenueLek}
                            onChange={(e) => updateData("monthlyRevenueLek", parseFloat(e.target.value) || "")}
                            placeholder="e.g. 1500000"
                            className={errors?.monthlyRevenueLek ? "border-red-500" : ""}
                        />
                        {errors?.monthlyRevenueLek && (
                            <p className="text-sm text-red-500">{errors.monthlyRevenueLek}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* ROI Display */}
            {roi !== "N/A" && (
                <div className="p-4 bg-muted/50 rounded-lg border">
                    <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-muted-foreground">Estimated Annual ROI</span>
                        <span className="text-2xl font-bold text-primary">{roi}%</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                        Based on EUR values (Monthly Revenue × 12 / Asking Price × 100)
                    </p>
                </div>
            )}

            <Separator />

            {/* Other Details */}
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Employee Count"
                    htmlFor="employeeCount"
                >
                    <Input
                        id="employeeCount"
                        type="number"
                        value={data.employeeCount}
                        onChange={(e) => updateData("employeeCount", parseInt(e.target.value) || "")}
                        placeholder="e.g. 5"
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Years in Operation"
                    htmlFor="yearsInOperation"
                >
                    <Input
                        id="yearsInOperation"
                        type="number"
                        value={data.yearsInOperation}
                        onChange={(e) => updateData("yearsInOperation", parseInt(e.target.value) || "")}
                        placeholder="e.g. 3"
                    />
                </FormFieldWrapper>
            </div>

            {/* Physically Verified */}
            <div className="flex items-center space-x-2 pt-2">
                <Switch
                    id="isPhysicallyVerified"
                    checked={data.isPhysicallyVerified}
                    onCheckedChange={(checked) => updateData("isPhysicallyVerified", checked)}
                />
                <Label htmlFor="isPhysicallyVerified" className="cursor-pointer">
                    Physically Verified Listing
                </Label>
            </div>
        </div>
    )
}
