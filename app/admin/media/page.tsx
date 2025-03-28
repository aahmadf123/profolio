"use client"

import { Suspense, useState, useEffect } from "react"
import { Grid, List, Filter, Search, Trash2, Download, Loader2, Plus } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/components/ui/use-toast"
import { FileUploader, type FileInfo } from "@/components/admin/shared/file-uploader"
import { supabase, STORAGE_BUCKETS } from "@/lib/supabase-client"
import { FileIcon } from "lucide-react" // Import FileIcon

function MediaPageContent() {
  const [files, setFiles] = useState<FileInfo[]>([])
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const { toast } = useToast()

  // Load files on mount
  useEffect(() => {
    fetchMediaFiles()
  }, [])

  // Fetch media files from Supabase
  const fetchMediaFiles = async () => {
    setIsLoading(true)

    try {
      // List all files in the media bucket
      const { data, error } = await supabase.storage.from(STORAGE_BUCKETS.MEDIA).list()

      if (error) throw error

      // Get public URLs for each file
      const filesWithUrls = await Promise.all(
        data.map(async (item) => {
          const {
            data: { publicUrl },
          } = supabase.storage.from(STORAGE_BUCKETS.MEDIA).getPublicUrl(item.name)

          // Determine file type
          const fileType = item.metadata?.mimetype || "application/octet-stream"

          // Generate thumbnail for images
          let thumbnailUrl = undefined
          if (fileType.startsWith("image/")) {
            thumbnailUrl = publicUrl
          }

          return {
            id: item.id,
            name: item.name,
            url: publicUrl,
            size: item.metadata?.size || 0,
            type: fileType,
            thumbnailUrl,
          }
        }),
      )

      setFiles(filesWithUrls)
      toast({
        title: "Success",
        description: "Media files loaded successfully",
      })
    } catch (error) {
      console.error("Error fetching media files:", error)
      toast({
        title: "Error",
        description: "Failed to load media files",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle file selection toggle
  const toggleFileSelection = (fileId: string) => {
    setSelectedFiles((prev) => (prev.includes(fileId) ? prev.filter((id) => id !== fileId) : [...prev, fileId]))
  }

  // Handle bulk delete
  const deleteSelectedFiles = async () => {
    if (selectedFiles.length === 0) return

    try {
      // Delete selected files from Supabase storage
      for (const fileId of selectedFiles) {
        const file = files.find((f) => f.id === fileId)
        if (file) {
          await supabase.storage.from(STORAGE_BUCKETS.MEDIA).remove([file.name])
        }
      }

      // Update local state
      setFiles(files.filter((file) => !selectedFiles.includes(file.id)))
      setSelectedFiles([])

      toast({
        title: "Success",
        description: `Deleted ${selectedFiles.length} files successfully`,
      })
    } catch (error) {
      console.error("Error deleting files:", error)
      toast({
        title: "Error",
        description: "Failed to delete selected files",
        variant: "destructive",
      })
    }
  }

  // Handle new uploads
  const handleUploadComplete = (newFiles: FileInfo[]) => {
    setFiles((prev) => [...newFiles, ...prev])
    setUploadDialogOpen(false)

    toast({
      title: "Upload complete",
      description: `Successfully uploaded ${newFiles.length} files`,
    })
  }

  // Get unique file types
  const fileTypes = Array.from(
    new Set(
      files.map((file) => {
        const baseType = file.type.split("/")[0]
        return baseType === "application" ? "document" : baseType
      }),
    ),
  )

  // Filter files based on search and type
  const filteredFiles = files.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesType = selectedType
      ? file.type.startsWith(selectedType) || (selectedType === "document" && file.type.startsWith("application"))
      : true
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Media Library</h1>
          <p className="text-muted-foreground">Manage your images, videos, and other media files</p>
        </div>

        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1">
              <Plus className="h-4 w-4" />
              Upload Files
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Upload Files</DialogTitle>
              <DialogDescription>Drag and drop files or click to browse your computer.</DialogDescription>
            </DialogHeader>
            <FileUploader
              bucket={STORAGE_BUCKETS.MEDIA}
              onUploadComplete={handleUploadComplete}
              maxFiles={10}
              acceptedFileTypes="image/*,video/*,application/pdf"
            />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Search and filter */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search media files..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto">
              {/* File type filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedType ? `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s` : "All Types"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedType(null)}>All Types</DropdownMenuItem>
                  {fileTypes.map((type) => (
                    <DropdownMenuItem key={type} onClick={() => setSelectedType(type)}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}s
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* View mode toggle */}
              <div className="flex items-center space-x-1 border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-l-md"
                  onClick={() => setViewMode("grid")}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "secondary" : "ghost"}
                  size="icon"
                  className="h-8 w-8 rounded-none rounded-r-md"
                  onClick={() => setViewMode("list")}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Selected files actions */}
          {selectedFiles.length > 0 && (
            <div className="flex items-center justify-between mb-4 p-2 bg-muted rounded-md">
              <p className="text-sm">
                {selectedFiles.length} {selectedFiles.length === 1 ? "file" : "files"} selected
              </p>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                  Clear Selection
                </Button>
                <Button variant="destructive" size="sm" onClick={deleteSelectedFiles}>
                  <Trash2 className="h-4 w-4 mr-1" /> Delete
                </Button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredFiles.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No media files found.</p>
              {(searchQuery || selectedType) && (
                <Button
                  variant="link"
                  onClick={() => {
                    setSearchQuery("")
                    setSelectedType(null)
                  }}
                >
                  Clear filters
                </Button>
              )}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredFiles.map((file) => (
                <Card key={file.id} className="overflow-hidden">
                  <div className="relative aspect-square bg-muted flex items-center justify-center">
                    {file.type.startsWith("image/") ? (
                      <img
                        src={file.url || "/placeholder.svg"}
                        alt={file.name}
                        className="object-cover w-full h-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center p-4">
                        <div className="p-3 bg-background rounded-full mb-2">
                          {file.type.startsWith("video/") ? (
                            <video src={file.url} className="w-12 h-12 object-cover" />
                          ) : (
                            <FileIcon className="h-8 w-8 text-muted-foreground" />
                          )}
                        </div>
                        <p className="text-xs text-center text-muted-foreground line-clamp-1">{file.name}</p>
                      </div>
                    )}
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      className="absolute top-2 left-2 h-5 w-5 bg-background/80 backdrop-blur-sm"
                    />
                  </div>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="truncate">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                              <Download className="h-4 w-4 mr-2" />
                              Download
                            </a>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedFiles([file.id])
                              deleteSelectedFiles()
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedFiles.includes(file.id)}
                      onCheckedChange={() => toggleFileSelection(file.id)}
                      className="h-5 w-5"
                    />
                    {file.type.startsWith("image/") ? (
                      <div className="h-10 w-10 rounded overflow-hidden bg-muted">
                        <img
                          src={file.url || "/placeholder.svg"}
                          alt={file.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="h-10 w-10 rounded overflow-hidden bg-muted flex items-center justify-center">
                        <FileIcon className="h-5 w-5 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">{file.name}</p>
                      <p className="text-xs text-muted-foreground">{(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{file.type.split("/")[0]}</Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Filter className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <a href={file.url} download={file.name} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => {
                            setSelectedFiles([file.id])
                            deleteSelectedFiles()
                          }}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

// Create a wrapper component that uses Suspense
function MediaWrapper() {
  return (
    <Suspense fallback={<div>Loading media files...</div>}>
      <MediaPageContent />
    </Suspense>
  )
}

export default function MediaPage() {
  return <MediaWrapper />
}
