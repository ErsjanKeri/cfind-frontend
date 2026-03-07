"use client"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Lock, Globe, DollarSign } from "lucide-react"
import type { ListingFormData } from "../use-listing-form"

interface Step4Props {
    data: ListingFormData
    updateData: (field: string, value: string | number | boolean | string[]) => void
    onSubmit: () => void
    isSubmitting: boolean
    displayROI: string
}

export function Step4Review({ data, updateData, onSubmit, isSubmitting, displayROI }: Step4Props) {
    return (
        <div className="space-y-6">
            {/* Summary */}
            <div className="space-y-4">
                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                        <Lock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Hidden Information</span>
                    </div>
                    <p className="font-semibold">{data.real_business_name}</p>
                    <p className="text-sm text-muted-foreground">{data.real_location_address}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Public Information</span>
                    </div>
                    <p className="font-semibold">{data.public_title_en}</p>
                    <p className="text-sm text-muted-foreground">
                        {data.public_location_area}, {data.public_location_city_en}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">{data.public_description_en}</p>
                </div>

                <div className="p-4 rounded-lg bg-muted">
                    <div className="flex items-center gap-2 mb-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Financial Summary</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <p className="text-xs text-muted-foreground">Asking Price</p>
                            <p className="font-semibold">€{Number(data.asking_price_eur || 0).toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">Monthly Revenue</p>
                            <p className="font-semibold">€{Number(data.monthly_revenue_eur || 0).toLocaleString()}</p>
                        </div>
                        {displayROI !== "N/A" && (
                            <div>
                                <p className="text-xs text-muted-foreground">Calculated ROI</p>
                                <p className="font-semibold text-accent">{displayROI}%</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Verification Checkbox */}
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-muted/30">
                <Checkbox
                    id="verification"
                    checked={data.is_physically_verified}
                    onCheckedChange={(checked) => updateData("is_physically_verified", checked)}
                    className="mt-1"
                />
                <div className="space-y-1">
                    <label htmlFor="verification" className="text-sm font-medium leading-none cursor-pointer">
                        I certify that I have physically visited this business.
                    </label>
                    <p className="text-xs text-muted-foreground">
                        By checking this, you certify that you have physically visited this business, verified its existence, and conducted a basic audit of its operations.
                    </p>
                </div>
            </div>

            <div className="flex justify-end">
                <Button onClick={onSubmit} disabled={isSubmitting || !data.is_physically_verified}>
                    {isSubmitting ? "Submitting..." : "Submit Listing"}
                </Button>
            </div>
        </div>
    )
}
