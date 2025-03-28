"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, X, FileIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/components/ui/use-toast"
import { supabase, generateUniqueFilename, STORAGE_BUCKETS } from "@/lib/supabase-client"

interface FileUploaderProps {
  bucket?: string
  onUploadComplete?: (files: FileInfo[]) => void
  maxFiles?: number
  acceptedFileTypes?: string
}

export interface FileInfo {
  id: string
  name: string
  url: string
  size: number
  type: string
  thumbnailUrl?: string
}

export function FileUploader({
  bucket = STORAGE_BUCKETS.MEDIA,
  onUploadComplete,
  maxFiles = 10,
  acceptedFileTypes = "image/*,video/*,application/pdf",
}: FileUploaderProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<FileInfo[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selectedFiles = Array.from(e.target.files)

    // Check if adding these files would exceed the max limit
    if (files.length + selectedFiles.length > maxFiles) {
      toast({
        title: "Too many files",
        description: `You can only upload a maximum of ${maxFiles} files at once.`,
        variant: "destructive",
      })
      return
    }

    setFiles((prev) => [...prev, ...selectedFiles])

    // Reset input value so the same file can be selected again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const uploadFiles = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    const uploadedFilesInfo: FileInfo[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const uniqueFilename = generateUniqueFilename(file)

        // Initialize progress
        setUploadProgress((prev) => ({
          ...prev,
          [i]: 0,
        }))

        // Upload file to Supabase Storage
        const { data, error } = await supabase.storage.from(bucket).upload(uniqueFilename, file, {
          cacheControl: "3600",
          upsert: true,
          onUploadProgress: (progress) => {
            const percent = (progress.loaded / progress.total) * 100
            setUploadProgress((prev) => ({
              ...prev,
              [i]: percent,
            }))
          },
        })

        if (error) throw error

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(uniqueFilename)

        // Generate thumbnail URL for images
        let thumbnailUrl
        if (file.type.startsWith("image/")) {
          const {
            data: { publicUrl: thumbUrl },
          } = supabase.storage.from(bucket).getPublicUrl(uniqueFilename)
          thumbnailUrl = thumbUrl
        }

        uploadedFilesInfo.push({
          id: data?.path || uniqueFilename,
          name: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          thumbnailUrl,
        })
      }

      setUploadedFiles(uploadedFilesInfo)

      toast({
        title: "Upload successful",
        description: `Successfully uploaded ${files.length} files.`,
      })

      // Call the callback with the uploaded files info
      if (onUploadComplete) {
        onUploadComplete(uploadedFilesInfo)
      }

      // Clear the files
      setFiles([])
    } catch (error) {
      console.error("Error uploading files:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your files.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
      setUploadProgress({})
    }
  }

  const renderFilePreview = (file: File, index: number) => {
    const isImage = file.type.startsWith("image/")
    const progress = uploadProgress[index] || 0

    return (
      <Card key={index} className="relative p-2 flex items-center space-x-3">
        <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md overflow-hidden flex-shrink-0">
          {isImage ? (
            <img
              src={URL.createObjectURL(file) || "/placeholder.svg"}
              alt={file.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <FileIcon className="h-6 w-6 text-muted-foreground" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>

          {isUploading && <Progress value={progress} className="h-1 mt-1" />}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 flex-shrink-0"
          onClick={() => removeFile(index)}
          disabled={isUploading}
        >
          <X className="h-4 w-4" />
        </Button>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {/* File selection area */}
        <Card className="border-dashed border-2 p-6">
          <div className="flex flex-col items-center justify-center text-center space-y-4">
            <Upload className="h-10 w-10 text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Drag and drop your files here or click to browse</p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports images, videos, and documents (max {maxFiles} files)
              </p>
            </div>
            <Button variant="secondary" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
              Select Files
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              multiple
              accept={acceptedFileTypes}
              onChange={handleFileSelect}
              disabled={isUploading}
            />
          </div>
        </Card>

        {/* Selected files list */}
        {files.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Selected Files ({files.length})</h3>
            <div className="grid gap-2">{files.map((file, index) => renderFilePreview(file, index))}</div>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setFiles([])} disabled={isUploading}>
                Clear All
              </Button>
              <Button onClick={uploadFiles} disabled={isUploading}>
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </div>
        )}

        {/* Uploaded files list */}
        {uploadedFiles.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Uploaded Files ({uploadedFiles.length})</h3>
            <div className="grid gap-2">
              {uploadedFiles.map((file) => (
                <Card key={file.id} className="relative p-2 flex items-center space-x-3">
                  <div className="h-12 w-12 flex items-center justify-center bg-muted rounded-md overflow-hidden flex-shrink-0">
                    {file.thumbnailUrl ? (
                      <img
                        src={file.thumbnailUrl || "/placeholder.svg"}
                        alt={file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <FileIcon className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex-shrink-0"
                    onClick={() => window.open(file.url, "_blank")}
                  >
                    View
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

