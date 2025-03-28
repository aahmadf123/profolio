"use client"

import { useState, useEffect } from "react"
import { Download, FileText, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export function ResumeViewer() {
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Fetch the resume URL from an API or database
    const fetchResumeUrl = async () => {
      try {
        setIsLoading(true)

        // In a real app, this would be an API call
        // For now, we'll check localStorage first, then use a fallback
        const storedResumeUrl = localStorage.getItem("resumeUrl")

        if (storedResumeUrl) {
          setResumeUrl(storedResumeUrl)
        } else {
          // Use a default PDF if none is stored
          // This is a placeholder URL - replace with an actual PDF URL
          setResumeUrl("/sample-resume.pdf")
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching resume:", err)
        setError("Unable to load resume. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeUrl()
  }, []) // Empty dependency array ensures this only runs once

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading resume...</p>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="bg-destructive/10 border-destructive">
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive font-medium">{error}</p>
          <Button variant="outline" className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (!resumeUrl) {
    return (
      <Card>
        <CardContent className="py-8 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No resume has been uploaded yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button variant="outline" className="gap-2" asChild>
          <a href={resumeUrl} download="resume.pdf" target="_blank" rel="noopener noreferrer">
            <Download className="h-4 w-4" />
            Download PDF
          </a>
        </Button>
      </div>

      <Card className="w-full overflow-hidden border rounded-lg">
        <CardContent className="p-0">
          <object data={resumeUrl} type="application/pdf" className="w-full h-[800px]">
            <div className="flex flex-col items-center justify-center h-[800px] bg-muted/30">
              <FileText className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-2">Unable to display PDF</p>
              <Button asChild>
                <a href={resumeUrl} target="_blank" rel="noopener noreferrer">
                  Open PDF in new tab
                </a>
              </Button>
            </div>
          </object>
        </CardContent>
      </Card>
    </div>
  )
}

