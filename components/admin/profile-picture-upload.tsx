"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

interface ProfilePictureUploadProps {
  onImageUpload?: (imageUrl: string) => void
}

const ProfilePictureUpload: React.FC<ProfilePictureUploadProps> = ({ onImageUpload }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // Simulate upload process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would upload the file to your server or storage service
      // and get back a URL to the uploaded image

      // For now, we'll just use the preview URL and save it to localStorage
      if (previewUrl) {
        localStorage.setItem("profilePicture", previewUrl)
        if (onImageUpload) {
          onImageUpload(previewUrl)
        }
      }

      toast({
        title: "Profile picture updated",
        description: "Your profile picture has been successfully updated.",
      })

      // Reset state
      setSelectedFile(null)
      setPreviewUrl(null)
    } catch (error) {
      console.error("Error uploading profile picture:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your profile picture. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      {previewUrl && (
        <img
          src={previewUrl || "/placeholder.svg"}
          alt="Profile Preview"
          className="rounded-full w-32 h-32 object-cover mb-4"
        />
      )}
      <Input type="file" accept="image/*" onChange={handleFileChange} className="mb-2" />
      <Button onClick={handleUpload} disabled={isUploading}>
        {isUploading ? "Uploading..." : "Upload"}
      </Button>
    </div>
  )
}

export { ProfilePictureUpload }

