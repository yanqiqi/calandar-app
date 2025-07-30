"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, ImageIcon, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { validateImageFile, generateThumbnail, compressImage } from "@/lib/image-utils"

interface ImageUploadProps {
  onImageSelect: (imageData: { file: File; thumbnail: Blob; compressed: Blob }) => void
  onImageRemove: () => void
  currentImage?: string | null
  disabled?: boolean
}

export function ImageUpload({ onImageSelect, onImageRemove, currentImage, disabled }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError(null)
    setIsProcessing(true)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error!)
        return
      }

      // Create preview
      const previewUrl = URL.createObjectURL(file)
      setPreview(previewUrl)

      // Generate thumbnail and compressed version
      const [thumbnail, compressed] = await Promise.all([generateThumbnail(file), compressImage(file)])

      onImageSelect({ file, thumbnail, compressed })
    } catch (err) {
      setError("Failed to process image. Please try again.")
      console.error("Image processing error:", err)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleRemove = () => {
    setPreview(null)
    setError(null)
    onImageRemove()
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click()
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <ImageIcon className="h-4 w-4" />
          Event Image
        </label>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleRemove}
            disabled={disabled || isProcessing}
            className="text-red-500 hover:text-red-700 h-auto p-1"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer ${
          preview ? "border-gray-300 bg-gray-50" : "border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview || "/placeholder.svg"}
              alt="Event preview"
              className="w-full h-48 object-cover rounded-lg"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                <div className="flex items-center gap-2 text-white">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            {isProcessing ? (
              <div className="flex items-center gap-2 text-gray-500">
                <Loader2 className="h-6 w-6 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 text-center">Click to upload an image</p>
                <p className="text-xs text-gray-400 mt-1">JPEG, PNG, WebP up to 10MB</p>
              </>
            )}
          </div>
        )}
      </div>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || isProcessing}
      />
    </div>
  )
}
