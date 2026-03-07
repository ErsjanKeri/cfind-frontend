"use client"

import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { FormFieldWrapper } from "@/components/shared/form-field-wrapper"
import { FileCheck, Upload } from "lucide-react"
import { countries, VALID_COUNTRY_CODES } from "@/lib/constants"

export interface AgentFieldsData {
  operating_country: string
  company_name: string
  license_number: string
  phone: string
  whatsapp_number: string
  bio_en?: string
  license_document?: File | null
  company_document?: File | null
  id_document?: File | null
}

interface RegisterAgentFieldsProps {
  data: AgentFieldsData
  onChange: (field: keyof AgentFieldsData, value: string | File | null) => void
  disabled: boolean
  showDocuments?: boolean
  showBio?: boolean
}

export function RegisterAgentFields({
  data,
  onChange,
  disabled,
  showDocuments = true,
  showBio = false
}: RegisterAgentFieldsProps) {
  return (
    <div className="space-y-4">
      <FormFieldWrapper label="Operating Country" htmlFor="operating_country" required>
        <Select
          value={data.operating_country}
          onValueChange={(val) => onChange("operating_country", val)}
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select your operating country" />
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

      <FormFieldWrapper label="Company / Agency Name" htmlFor="company_name" required>
        <Input
          id="company_name"
          placeholder="Your Agency Name"
          value={data.company_name}
          onChange={(e) => onChange("company_name", e.target.value)}
          required
          disabled={disabled}
        />
      </FormFieldWrapper>

      <FormFieldWrapper label="License Number" htmlFor="license_number" required>
        <Input
          id="license_number"
          placeholder="License #"
          value={data.license_number}
          onChange={(e) => onChange("license_number", e.target.value)}
          required
          disabled={disabled}
        />
      </FormFieldWrapper>

      <div className="grid grid-cols-2 gap-4">
        <FormFieldWrapper label="Phone" htmlFor="phone" required>
          <Input
            id="phone"
            placeholder="+355 69 123 4567"
            value={data.phone}
            onChange={(e) => onChange("phone", e.target.value)}
            required
            disabled={disabled}
          />
        </FormFieldWrapper>

        <FormFieldWrapper label="WhatsApp" htmlFor="whatsapp_number" required>
          <Input
            id="whatsapp_number"
            placeholder="+355 69 123 4567"
            value={data.whatsapp_number}
            onChange={(e) => onChange("whatsapp_number", e.target.value)}
            required
            disabled={disabled}
          />
        </FormFieldWrapper>
      </div>

      {showDocuments && (
        <div className="space-y-3 pt-2 border-t border-border">
          <p className="text-sm font-medium text-primary flex items-center gap-2">
            <FileCheck className="h-4 w-4" />
            Required Documents
          </p>

          <FormFieldWrapper label="Business License Document" htmlFor="license_document" required>
            <div className="relative">
              <Input
                id="license_document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onChange("license_document", e.target.files?.[0] || null)}
                required
                disabled={disabled}
                className="cursor-pointer"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {data.license_document && (
              <p className="text-xs text-green-600 mt-1">{data.license_document.name}</p>
            )}
          </FormFieldWrapper>

          <FormFieldWrapper label="Company Registration Document" htmlFor="company_document" required>
            <div className="relative">
              <Input
                id="company_document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onChange("company_document", e.target.files?.[0] || null)}
                required
                disabled={disabled}
                className="cursor-pointer"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {data.company_document && (
              <p className="text-xs text-green-600 mt-1">{data.company_document.name}</p>
            )}
          </FormFieldWrapper>

          <FormFieldWrapper label="ID / Passport Document" htmlFor="id_document" required>
            <div className="relative">
              <Input
                id="id_document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(e) => onChange("id_document", e.target.files?.[0] || null)}
                required
                disabled={disabled}
                className="cursor-pointer"
              />
              <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            </div>
            {data.id_document && (
              <p className="text-xs text-green-600 mt-1">{data.id_document.name}</p>
            )}
          </FormFieldWrapper>
        </div>
      )}
    </div>
  )
}
