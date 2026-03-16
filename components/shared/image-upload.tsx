"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Upload, X, Loader2, Crop as CropIcon } from "lucide-react"
import { useFileUpload } from "@/lib/hooks/useFileUpload"
import Image from "next/image"
import { ImageCropper } from "@/components/shared/image-cropper"

interface ImageUploadProps {
    value: string[]
    onChange: (value: string[]) => void
    files?: File[]
    onFilesChange?: (files: File[]) => void
    disabled?: boolean
    maxImages?: number
    crop?: boolean
    aspect?: number
    manual?: boolean
}

export function ImageUpload({
    value = [],
    onChange,
    files = [], // Pending files from parent
    onFilesChange,
    disabled,
    maxImages = 5,
    crop = false,
    aspect = 1,
    manual = false
}: ImageUploadProps) {
    // Use new upload hook from Phase 2
    const { uploadFile, isUploading: hookUploading } = useFileUpload()
    const [isUploading, setIsUploading] = useState(false)
    const [fileQueue, setFileQueue] = useState<File[]>([])
    const [currentCropFile, setCurrentCropFile] = useState<string | null>(null)
    const [showCropper, setShowCropper] = useState(false)
    // We derive previews from props 'files' to keep sync
    const [previews, setPreviews] = useState<{ file: File, url: string }[]>([])

    useEffect(() => {
        // Sync previews with files prop
        // Skip if both files and previews are empty to prevent infinite loop
        // (empty array [] creates new reference on each render)
        if ((!files || files.length === 0) && previews.length === 0) {
            return
        }

        if (!files || files.length === 0) {
            // Clean up existing previews before clearing
            previews.forEach(p => URL.revokeObjectURL(p.url))
            setPreviews([])
            return
        }

        // Create new previews
        const newPreviews = files.map(f => ({ file: f, url: URL.createObjectURL(f) }))
        setPreviews(newPreviews)

        // Cleanup function
        return () => {
            newPreviews.forEach(p => URL.revokeObjectURL(p.url))
        }
    }, [files])

    // Handle initial file selection
    const onSelectFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (!files || files.length === 0) return

        const fileArray = Array.from(files)

        // If cropping is enabled, start the queue
        if (crop) {
            setFileQueue(prev => [...prev, ...fileArray])
        } else {
            // Direct or Manual processing
            if (manual) {
                handleManualAdd(fileArray)
            } else {
                uploadFiles(fileArray)
            }
        }

        // Reset input
        e.target.value = ""
    }

    const handleManualAdd = (newFiles: File[]) => {
        if (onFilesChange) {
            onFilesChange([...files, ...newFiles])
        }
    }

    // Process the crop queue
    useEffect(() => {
        if (crop && fileQueue.length > 0 && !showCropper && !isUploading) {
            const file = fileQueue[0]
            const reader = new FileReader()
            reader.onload = () => {
                setCurrentCropFile(reader.result as string)
                setShowCropper(true)
            }
            reader.readAsDataURL(file)
        }
    }, [fileQueue, showCropper, isUploading, crop])

    const handleCropComplete = async (croppedBlob: Blob) => {
        // Create a File from Blob to match upload logic
        const originalFile = fileQueue[0]
        const croppedFile = new File([croppedBlob], originalFile.name, { type: "image/jpeg" })

        if (manual) {
            handleManualAdd([croppedFile])
        } else {
            // Upload the crop directly
            await uploadFiles([croppedFile])
        }

        // Remove from queue
        setFileQueue(prev => prev.slice(1))
        setShowCropper(false)
        setCurrentCropFile(null)
    }

    const onRemoveFile = (fileToRemove: File) => {
        if (onFilesChange) {
            onFilesChange(files.filter(f => f !== fileToRemove))
        }
    }

    const uploadFiles = async (filesToUpload: File[]) => {
        setIsUploading(true)

        try {
            // Limit files to maxImages
            const allowedCount = maxImages - value.length
            const limitedFiles = filesToUpload.slice(0, allowedCount)

            if (limitedFiles.length === 0) {
                return
            }

            // Upload each file using new backend API
            const uploadedUrls: string[] = []
            for (const file of limitedFiles) {
                const url = await uploadFile(file, 'listing')
                if (url) {
                    uploadedUrls.push(url)
                }
            }

            if (uploadedUrls.length > 0) {
                onChange([...value, ...uploadedUrls])
            }
        } catch (error) {
            // Error handled silently
        } finally {
            setIsUploading(false)
        }
    }

    const onRemove = (url: string) => {
        onChange(value.filter((current) => current !== url))
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {/* Render Existing/Uploaded URLs */}
                {value.map((url) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden border border-border">
                        <Button
                            type="button"
                            onClick={() => onRemove(url)}
                            variant="destructive"
                            size="icon"
                            aria-label="Remove image"
                            className="absolute top-2 right-2 z-10 h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Image
                            fill
                            className="object-cover"
                            alt="Listing Image"
                            src={url}
                        />
                    </div>
                ))}

                {previews.map(({ url, file }) => (
                    <div key={url} className="relative aspect-square rounded-md overflow-hidden border border-border opacity-75">

                        <Button
                            type="button"
                            onClick={() => onRemoveFile(file)}
                            variant="destructive"
                            size="icon"
                            aria-label="Remove image"
                            className="absolute top-2 right-2 z-30 h-6 w-6"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                        <Image
                            fill
                            className="object-cover"
                            alt="Preview"
                            src={url}
                        />
                    </div>
                ))}
            </div>

            {value.length < maxImages && (
                <div className="flex items-center justify-center w-full">
                    <Label
                        htmlFor="image-upload"
                        className={`
                    flex flex-col items-center justify-center w-full h-32 
                    border-2 border-dashed rounded-lg cursor-pointer 
                    hover:bg-accent/50 transition-colors
                    ${disabled || isUploading ? "opacity-50 cursor-not-allowed" : ""}
                `}
                    >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            {isUploading ? (
                                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground mb-2" />
                            ) : (
                                <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                            )}
                            <p className="text-sm text-muted-foreground">
                                {isUploading ? "Uploading..." : "Click to upload images"}
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                                JPG, PNG (max 4MB) {crop && "+ Crop"}
                            </p>
                        </div>
                        <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            onChange={onSelectFiles}
                            disabled={disabled || isUploading}
                        />
                    </Label>
                </div>
            )}

            {/* Cropper Modal */}
            {crop && currentCropFile && (
                <ImageCropper
                    open={showCropper}
                    onOpenChange={(open) => {
                        setShowCropper(open)
                        if (!open) {
                            // If closed without save, remove current from queue to avoid stuck
                            setFileQueue(prev => prev.slice(1))
                        }
                    }}
                    imageSrc={currentCropFile}
                    onCropComplete={handleCropComplete}
                    aspect={aspect}
                />
            )}
        </div>
    )
}
