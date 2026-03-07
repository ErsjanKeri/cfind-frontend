"use client"

import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import { getCountryCities, getCityAreas, isValidCountryCode } from "@/lib/constants"
import type { ListingFormData, ListingFormErrors } from "@/lib/api/types"

interface Step2Props {
    data: ListingFormData
    updateData: (field: string, value: string | number | boolean | string[]) => void
    errors?: ListingFormErrors
}

export function Step2PublicInfo({ data, updateData, errors }: Step2Props) {
    const countryCode = isValidCountryCode(data.country_code) ? data.country_code : undefined
    const cities = countryCode ? getCountryCities(countryCode) : []
    const areas = countryCode && data.public_location_city_en
        ? getCityAreas(countryCode, data.public_location_city_en)
        : []

    const handleCityChange = (city: string) => {
        updateData("public_location_city_en", city)
        updateData("public_location_area", "") // Reset area when city changes
    }

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

            {/* Location fields */}
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="City"
                    htmlFor="public_location_city_en"
                    error={errors?.public_location_city_en}
                >
                    <Select
                        value={data.public_location_city_en}
                        onValueChange={handleCityChange}
                        disabled={cities.length === 0}
                    >
                        <SelectTrigger className={errors?.public_location_city_en ? "border-red-500" : ""}>
                            <SelectValue placeholder={cities.length === 0 ? "Select country first" : "Select city"} />
                        </SelectTrigger>
                        <SelectContent>
                            {cities.map((city) => (
                                <SelectItem key={city} value={city}>{city}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Area/Neighborhood"
                    htmlFor="public_location_area"
                    error={errors?.public_location_area}
                >
                    <Select
                        value={data.public_location_area}
                        onValueChange={(val) => updateData("public_location_area", val)}
                        disabled={areas.length === 0}
                    >
                        <SelectTrigger className={errors?.public_location_area ? "border-red-500" : ""}>
                            <SelectValue placeholder={areas.length === 0 ? "Select city first" : "Select area"} />
                        </SelectTrigger>
                        <SelectContent>
                            {areas.map((area) => (
                                <SelectItem key={area} value={area}>{area}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormFieldWrapper>
            </div>
        </div>
    )
}
