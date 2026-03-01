"use client"

import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface DocumentViewerProps {
    label: string
    description: string
    notUploadedText?: string
    url: string | null | undefined
    icon: LucideIcon
}

export function DocumentViewer({ label, description, notUploadedText = "Not uploaded yet", url, icon: Icon }: DocumentViewerProps) {
    const hasDocument = !!url

    return (
        <div className={`p-4 rounded-lg border ${hasDocument ? 'border-green-200 bg-green-50/30' : 'border-amber-200 bg-amber-50/30'}`}>
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 ${hasDocument ? 'bg-green-100' : 'bg-amber-100'}`}>
                        <Icon className={`h-5 w-5 ${hasDocument ? 'text-green-600' : 'text-amber-600'}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">{label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {hasDocument ? description : notUploadedText}
                        </p>
                    </div>
                </div>
                {hasDocument && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(url, '_blank')}
                        className="h-8 px-3 flex-shrink-0"
                    >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                    </Button>
                )}
            </div>
        </div>
    )
}
