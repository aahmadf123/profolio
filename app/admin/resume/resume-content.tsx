"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload, FileText, Trash2, Download, RefreshCw, Eye } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

export default function ResumeContent() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [currentResume, setCurrentResume] = useState(() => {
    // Initialize from localStorage if available and we're in the browser
    if (typeof window !== "undefined") {
      const storedUrl = localStorage.getItem("resumeUrl")
      const storedName = localStorage.getItem("resumeName")
      const storedDate = localStorage.getItem("resumeDate")

      if (storedUrl && storedName && storedDate) {
        return {
          url: storedUrl,
          fileName: storedName,
          uploadedAt: storedDate,
        }
      }
    }

    return {
      url: "",
      fileName: "",
      uploadedAt: "",
    }
  })

  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      // Validate file type
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file.",
          variant: "destructive",
        })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 5MB.",
          variant: "destructive",
        })
        return
      }

      setSelectedFile(file)
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setIsUploading(true)

    try {
      // In a real app with Supabase, you would do:
      // const fileName = generateUniqueFilename(selectedFile);
      // const { data, error } = await supabase.storage
      //   .from(STORAGE_BUCKETS.MEDIA)
      //   .upload(`resumes/${fileName}`, selectedFile);

      // if (error) throw error;

      // const { data: { publicUrl } } = supabase.storage
      //   .from(STORAGE_BUCKETS.MEDIA)
      //   .getPublicUrl(`resumes/${fileName}`);

      // For this demo, we'll use a local URL
      const fileUrl = URL.createObjectURL(selectedFile)

      // Store in localStorage for demo purposes
      localStorage.setItem("resumeUrl", fileUrl)
      localStorage.setItem("resumeName", selectedFile.name)
      localStorage.setItem("resumeDate", new Date().toISOString())

      // Update the current resume state
      setCurrentResume({
        url: fileUrl,
        fileName: selectedFile.name,
        uploadedAt: new Date().toISOString(),
      })

      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }

      toast({
        title: "Resume uploaded",
        description: "Your resume has been successfully uploaded.",
      })
    } catch (error) {
      console.error("Error uploading resume:", error)
      toast({
        title: "Upload failed",
        description: "There was an error uploading your resume. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async () => {
    try {
      // In a real app with Supabase, you would delete from storage
      // For this demo, we'll just clear localStorage
      localStorage.removeItem("resumeUrl")
      localStorage.removeItem("resumeName")
      localStorage.removeItem("resumeDate")

      setCurrentResume({
        url: "",
        fileName: "",
        uploadedAt: "",
      })

      toast({
        title: "Resume deleted",
        description: "Your resume has been successfully deleted.",
      })
    } catch (error) {
      console.error("Error deleting resume:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting your resume. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resume Management</h1>
        <p className="text-muted-foreground">Upload and manage your professional resume</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Upload Resume</CardTitle>
            <CardDescription>Upload a PDF file of your professional resume</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-md py-8 px-4">
              <FileText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-sm text-center text-muted-foreground mb-4">
                Drag and drop your resume PDF here,
                <br />
                or click to browse
              </p>
              <Input
                type="file"
                accept=".pdf"
                className="hidden"
                id="resume-upload"
                ref={fileInputRef}
                onChange={handleFileChange}
              />
              <Button variant="outline" onClick={() => document.getElementById("resume-upload")?.click()}>
                Select PDF File
              </Button>
            </div>

            {selectedFile && (
              <div className="p-4 bg-muted rounded-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-primary" />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            <p className="text-xs text-muted-foreground">Only PDF files are supported. Maximum file size: 5MB.</p>
          </CardContent>
          <CardFooter>
            <Button className="w-full" onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? (
                <>
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </>
              )}
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Resume</CardTitle>
            <CardDescription>Manage your currently uploaded resume</CardDescription>
          </CardHeader>
          <CardContent>
            {currentResume.url ? (
              <div className="space-y-4">
                <div className="p-4 bg-muted rounded-md">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 mr-3 text-primary" />
                    <div>
                      <p className="font-medium">{currentResume.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Uploaded on{" "}
                        {new Date(currentResume.uploadedAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="aspect-[3/4] bg-muted rounded-md overflow-hidden">
                  <object data={currentResume.url} type="application/pdf" className="w-full h-full">
                    <div className="flex flex-col items-center justify-center h-full">
                      <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-muted-foreground mb-2">Unable to display PDF preview</p>
                      <Button asChild>
                        <a href={currentResume.url} target="_blank" rel="noopener noreferrer">
                          Open PDF in new tab
                        </a>
                      </Button>
                    </div>
                  </object>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No resume has been uploaded yet.</p>
              </div>
            )}
          </CardContent>
          {currentResume.url && (
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline" asChild>
                  <a href={currentResume.url} target="_blank" rel="noopener noreferrer">
                    <Eye className="mr-2 h-4 w-4" />
                    View
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <a href={currentResume.url} download={currentResume.fileName || "resume.pdf"}>
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </a>
                </Button>
              </div>
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
    </div>
  )
}

