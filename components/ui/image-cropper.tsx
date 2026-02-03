"use client"

import { useState, useCallback } from "react"
import Cropper from "react-easy-crop"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { getCroppedImg } from "@/lib/image-utils"
import { Loader2 } from "lucide-react"

interface ImageCropperProps {
    imageSrc: string | null
    open: boolean
    onOpenChange: (open: boolean) => void
    onCropComplete: (croppedBlob: Blob) => void
    aspect?: number // Default to 1 (square)
}

export function ImageCropper({ imageSrc, open, onOpenChange, onCropComplete, aspect = 1 }: ImageCropperProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [rotation, setRotation] = useState(0)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null)
    const [loading, setLoading] = useState(false)

    const onCropChange = (crop: { x: number; y: number }) => {
        setCrop(crop)
    }

    const onZoomChange = (zoom: number) => {
        setZoom(zoom)
    }

    const onCropAreaChange = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleSave = async () => {
        if (!imageSrc || !croppedAreaPixels) return

        setLoading(true)
        try {
            const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation)
            if (croppedImage) {
                onCropComplete(croppedImage)
                onOpenChange(false)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-xl">
                <DialogHeader>
                    <DialogTitle>Edit Image</DialogTitle>
                    <DialogDescription>
                        Drag to position and pinch to zoom.
                    </DialogDescription>
                </DialogHeader>

                <div className="relative w-full h-80 bg-black rounded-md overflow-hidden">
                    {imageSrc && (
                        <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={aspect}
                            onCropChange={onCropChange}
                            onCropComplete={onCropAreaChange}
                            onZoomChange={onZoomChange}
                            objectFit="contain"
                        />
                    )}
                </div>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <span className="text-sm font-medium">Zoom</span>
                        <Slider
                            value={[zoom]}
                            min={1}
                            max={3}
                            step={0.1}
                            onValueChange={(vals) => setZoom(vals[0])}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                        Apply Crop
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
