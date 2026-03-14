"use client"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import { businessCategories, countries, VALID_COUNTRY_CODES } from "@/lib/constants"
import type { ListingFormData, ListingFormErrors } from "../use-listing-form"

interface Step1Props {
    data: ListingFormData
    updateData: (field: string, value: string | number | boolean | string[]) => void
    errors?: ListingFormErrors
    showCountry?: boolean
}

export function Step1PrivateInfo({ data, updateData, errors, showCountry = true }: Step1Props) {
    const handleCountryChange = (value: string) => {
        updateData("country_code", value)
        // Reset city and area when country changes
        updateData("public_location_city_en", "")
        updateData("public_location_area", "")
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Real Business Name (Private)"
                    htmlFor="real_business_name"
                    error={errors?.real_business_name}
                >
                    <Input
                        id="real_business_name"
                        value={data.real_business_name}
                        onChange={(e) => updateData("real_business_name", e.target.value)}
                        className={errors?.real_business_name ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="Category"
                    htmlFor="category"
                    error={errors?.category}
                >
                    <Select
                        value={data.category}
                        onValueChange={(value) => updateData("category", value)}
                    >
                        <SelectTrigger className={errors?.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                            {businessCategories.map((category) => (
                                <SelectItem key={category.value} value={category.value}>
                                    {category.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormFieldWrapper>
            </div>

            {/* Country - only shown to admins, agents have it auto-set */}
            {showCountry && (
                <FormFieldWrapper
                    label="Country"
                    htmlFor="country_code"
                    error={errors?.country_code}
                >
                    <Select
                        value={data.country_code}
                        onValueChange={handleCountryChange}
                    >
                        <SelectTrigger className={errors?.country_code ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select country" />
                        </SelectTrigger>
                        <SelectContent>
                            {VALID_COUNTRY_CODES.map((code) => (
                                <SelectItem key={code} value={code}>
                                    {countries[code].flag} {countries[code].name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </FormFieldWrapper>
            )}

            <FormFieldWrapper
                label="Full Address (Private)"
                htmlFor="real_location_address"
                error={errors?.real_location_address}
                description="Complete address including street, city, and postal code"
            >
                <Input
                    id="real_location_address"
                    value={data.real_location_address}
                    onChange={(e) => updateData("real_location_address", e.target.value)}
                    placeholder="e.g., Rruga Durrësit 123, Tirana 1001"
                    className={errors?.real_location_address ? "border-red-500" : ""}
                />
            </FormFieldWrapper>
        </div>
    )
}
