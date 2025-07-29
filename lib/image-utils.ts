// Image processing utilities
export const resizeImage = (file: File, maxWidth: number, maxHeight: number, quality = 0.8): Promise<Blob> => {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    const img = new Image()

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img

      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height
          height = maxHeight
        }
      }

      canvas.width = width
      canvas.height = height

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(resolve, "image/jpeg", quality)
    }

    img.src = URL.createObjectURL(file)
  })
}

export const generateThumbnail = (file: File): Promise<Blob> => {
  return resizeImage(file, 200, 150, 0.7)
}

export const compressImage = (file: File): Promise<Blob> => {
  return resizeImage(file, 1200, 800, 0.8)
}

export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
  const maxSize = 10 * 1024 * 1024 // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: "Please select a valid image file (JPEG, PNG, or WebP)" }
  }

  if (file.size > maxSize) {
    return { valid: false, error: "Image size must be less than 10MB" }
  }

  return { valid: true }
}
