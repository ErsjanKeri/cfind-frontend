"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import type { ListingFormData, ListingFormErrors } from "@/lib/api/types"

interface Step2Props {
    data: ListingFormData
    updateData: (field: string, value: string | number | boolean | string[]) => void
    errors?: ListingFormErrors
}

export function Step2PublicInfo({ data, updateData, errors }: Step2Props) {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h3 className="text-lg font-medium">Public Listing Information</h3>
                <p className="text-sm text-muted-foreground">Provide details that will be visible to potential buyers</p>
            </div>

            {/* Title */}
            <div className="space-y-2">
                <Label htmlFor="public_title_en">
                    Public Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="public_title_en"
                    value={data.public_title_en}
                    onChange={(e) => updateData('public_title_en', e.target.value)}
                    placeholder="e.g. Profitable Cafe in City Center"
                    className={errors?.public_title_en ? "border-red-500" : ""}
                />
                {errors?.public_title_en && (
                    <p className="text-sm text-red-500">{errors.public_title_en}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="public_description_en">
                    Public Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="public_description_en"
                    rows={6}
                    value={data.public_description_en}
                    onChange={(e) => updateData('public_description_en', e.target.value)}
                    placeholder="Describe the business opportunity without revealing sensitive details..."
                    className={errors?.public_description_en ? "border-red-500" : ""}
                />
                {errors?.public_description_en && (
                    <p className="text-sm text-red-500">{errors.public_description_en}</p>
                )}
            </div>

            {/* Location fields - Single language (these don't need translation) */}
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Area/Neighborhood"
                    htmlFor="public_location_area"
                    error={errors?.public_location_area}
                >
                    <Input
                        id="public_location_area"
                        value={data.public_location_area}
                        onChange={(e) => updateData("public_location_area", e.target.value)}
                        placeholder="e.g. Blloku"
                        className={errors?.public_location_area ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="City"
                    htmlFor="public_location_city_en"
                    error={errors?.public_location_city_en}
                >
                    <Input
                        id="public_location_city_en"
                        value={data.public_location_city_en}
                        onChange={(e) => updateData("public_location_city_en", e.target.value)}
                        placeholder="e.g. Tirana"
                        className={errors?.public_location_city_en ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>
            </div>
        </div>
    )
}
