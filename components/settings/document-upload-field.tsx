"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Building2, AlertTriangle, CheckCircle } from "lucide-react"

interface DocumentUploadFieldProps {
  id: string
  label: string
  icon?: "file" | "building"
  existingUrl: string
  file: File | null
  error: string | null
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  noUploadMessage?: string
}

export function DocumentUploadField({
  id,
  label,
  icon = "file",
  existingUrl,
  file,
  error,
  onChange,
  required,
  noUploadMessage = "No document uploaded yet",
}: DocumentUploadFieldProps) {
  const Icon = icon === "building" ? Building2 : FileText

  return (
    <div className="space-y-3">
      <Label htmlFor={id}>
        <FileText className="inline h-4 w-4 mr-1" />
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {existingUrl && !file && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {existingUrl.includes('s3') ? '• Verified' : ''}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(existingUrl, '_blank')}
                  className="h-8 px-3"
                >
                  <FileText className="h-3 w-3 mr-1" />
                  View
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Input
        id={id}
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={onChange}
        className={error ? "cursor-pointer border-red-500" : "cursor-pointer"}
      />
      {!error && (
        <p className="text-xs text-muted-foreground">PDF, JPG, PNG - Max 50MB per file</p>
      )}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle className="h-3 w-3" />
          {error}
        </p>
      )}
      {file && !error && (
        <p className="text-xs text-green-600 flex items-center gap-1">
          <CheckCircle className="h-3 w-3" />
          New file selected: {file.name} ({(file.size / (1024 * 1024)).toFixed(2)}MB)
        </p>
      )}
      {!existingUrl && !file && !error && (
        <p className="text-xs text-amber-600">{noUploadMessage}</p>
      )}
    </div>
  )
}
