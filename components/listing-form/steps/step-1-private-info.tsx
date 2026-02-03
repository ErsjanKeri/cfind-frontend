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
import { FormFieldWrapper } from "@/components/ui/form-field-wrapper"
import { businessCategories } from "@/lib/constants"

interface Step1Props {
    data: any
    updateData: (field: string, value: any) => void
    errors?: any
}

export function Step1PrivateInfo({ data, updateData, errors }: Step1Props) {
    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Real Business Name (Private)"
                    htmlFor="realBusinessName"
                    error={errors?.realBusinessName}
                >
                    <Input
                        id="realBusinessName"
                        value={data.realBusinessName}
                        onChange={(e) => updateData("realBusinessName", e.target.value)}
                        className={errors?.realBusinessName ? "border-red-500" : ""}
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

            <div className="grid grid-cols-2 gap-4">
                <FormFieldWrapper
                    label="Street Address"
                    htmlFor="realStreet"
                    error={errors?.realStreet}
                >
                    <Input
                        id="realStreet"
                        value={data.realStreet}
                        onChange={(e) => updateData("realStreet", e.target.value)}
                        className={errors?.realStreet ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>

                <FormFieldWrapper
                    label="City"
                    htmlFor="realCity"
                    error={errors?.realCity}
                >
                    <Input
                        id="realCity"
                        value={data.realCity}
                        onChange={(e) => updateData("realCity", e.target.value)}
                        className={errors?.realCity ? "border-red-500" : ""}
                    />
                </FormFieldWrapper>
            </div>

            {/* <div className="space-y-2">
                <Label htmlFor="realDescription">Private Description (Optional)</Label>
                <Textarea
                    id="realDescription"
                    value={data.realDescription}
                    onChange={(e) => updateData("realDescription", e.target.value)}
                    placeholder="Internal notes about the business..."
                    className={errors?.realDescription ? "border-red-500" : ""}
                />
            </div> */}
        </div>
    )
}
