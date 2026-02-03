"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper"

interface Step2Props {
    data: any
    updateData: (field: string, value: any) => void
    errors?: any
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
                <Label htmlFor="publicTitleEn">
                    Public Title <span className="text-red-500">*</span>
                </Label>
                <Input
                    id="publicTitleEn"
                    value={data.publicTitleEn}
                    onChange={(e) => updateData('publicTitleEn', e.target.value)}
                    placeholder="e.g. Profitable Cafe in City Center"
                    className={errors?.publicTitleEn ? "border-red-500" : ""}
                />
                {errors?.publicTitleEn && (
                    <p className="text-sm text-red-500">{errors.publicTitleEn}</p>
                )}
            </div>

            {/* Description */}
            <div className="space-y-2">
                <Label htmlFor="publicDescriptionEn">
                    Public Description <span className="text-red-500">*</span>
                </Label>
                <Textarea
                    id="publicDescriptionEn"
                    rows={6}
                    value={data.publicDescriptionEn}
                    onChange={(e) => updateData('publicDescriptionEn', e.target.value)}
                    placeholder="Describe the business opportunity without revealing sensitive details..."
                    className={errors?.publicDescriptionEn ? "border-red-500" : ""}
                />
                {errors?.publicDescriptionEn && (
                    <p className="text-sm text-red-500">{errors.publicDescriptionEn}</p>
                )}
            </div>

            {/* Location fields - Single language (these don't need translation) */}
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Area/Neighborhood"
                    htmlFor="publicArea"
                    error={errors?.publicArea}
                >
                    <Input
                        id="publicArea"
                        value={data.publicArea}
                        onChange={(e) => updateData("publicArea", e.target.value)}
                        placeholder="e.g. Blloku, Tirana"
                        className={errors?.publicArea ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="City"
                    htmlFor="publicCity"
                    error={errors?.publicCity}
                >
                    <Input
                        id="publicCity"
                        value={data.publicCity}
                        onChange={(e) => updateData("publicCity", e.target.value)}
                        placeholder="e.g. Tirana"
                        className={errors?.publicCity ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>
            </div>
        </div>
    )
}
