"use client"

import { useState } from "react"
import { RefreshCw, Link, ArrowUpDown, Maximize2, Minimize2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"

interface RealTimePreviewProps {
  defaultView?: "desktop" | "tablet" | "mobile"
  defaultOrientation?: "vertical" | "horizontal"
  defaultUrl?: string
  title?: string
  expanded?: boolean
}

export function RealTimePreview({
  defaultView = "desktop",
  defaultOrientation = "vertical",
  defaultUrl = "/",
  title = "Preview",
  expanded = false,
}: RealTimePreviewProps) {
  const [view, setView] = useState(defaultView)
  const [orientation, setOrientation] = useState(defaultOrientation)
  const [url, setUrl] = useState(defaultUrl)
  const [isExpanded, setIsExpanded] = useState(expanded)
  const [lastRefresh, setLastRefresh] = useState(new Date())
  const { toast } = useToast()

  // Define device dimensions
  const viewportSizes = {
    desktop: {
      width: orientation === "vertical" ? "100%" : "1024px",
      height: orientation === "vertical" ? "600px" : "100%",
    },
    tablet: {
      width: orientation === "vertical" ? "100%" : "768px",
      height: orientation === "vertical" ? "500px" : "100%",
    },
    mobile: {
      width: orientation === "vertical" ? "100%" : "375px",
      height: orientation === "vertical" ? "667px" : "100%",
    },
  }

  // Handle URL navigation
  const navigateTo = (newUrl: string) => {
    setUrl(newUrl)
    refreshPreview()
  }

  // Refresh the preview
  const refreshPreview = () => {
    setLastRefresh(new Date())
    toast({
      title: "Preview refreshed",
      description: "The preview has been updated with the latest changes.",
    })
  }

  // Toggle orientation
  const toggleOrientation = () => {
    setOrientation(orientation === "vertical" ? "horizontal" : "vertical")
  }

  // Toggle expanded view
  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  // Common navigation urls
  const navUrls = [
    { label: "Home", url: "/" },
    { label: "About", url: "/#about" },
    { label: "Skills", url: "/#skills" },
    { label: "Projects", url: "/#projects" },
  ]

  return (
    <Card className={`${isExpanded ? "fixed inset-4 z-50" : "h-full"}`}>
      <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={refreshPreview} title="Refresh preview">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleOrientation}
            title="Toggle orientation"
          >
            <ArrowUpDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            onClick={toggleExpanded}
            title={isExpanded ? "Minimize" : "Maximize"}
          >
            {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-2 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="sm" className="h-7 px-2 text-xs gap-1" onClick={() => navigateTo(url)}>
              <Link className="h-3 w-3" />
              {url}
            </Button>
          </div>

          <Tabs defaultValue={view} onValueChange={(value) => setView(value as "desktop" | "tablet" | "mobile")}>
            <TabsList className="h-7 px-1">
              <TabsTrigger value="desktop" className="text-xs px-2">
                Desktop
              </TabsTrigger>
              <TabsTrigger value="tablet" className="text-xs px-2">
                Tablet
              </TabsTrigger>
              <TabsTrigger value="mobile" className="text-xs px-2">
                Mobile
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div
          className={`border rounded-md overflow-hidden bg-background flex ${
            orientation === "vertical" ? "flex-col" : "flex-row"
          }`}
          style={{
            height: isExpanded ? "calc(100vh - 150px)" : "calc(100% - 40px)",
          }}
        >
          <div
            className={`flex-grow flex ${orientation === "vertical" ? "w-full" : "h-full"}`}
            style={{
              width: viewportSizes[view].width,
              maxWidth: "100%",
              transition: "width 0.3s ease",
            }}
          >
            <iframe
              src={`${url}?_=${lastRefresh.getTime()}`}
              className="w-full h-full border-0"
              title="Site preview"
              key={`${url}-${lastRefresh.getTime()}`}
            />
          </div>

          {orientation === "horizontal" && (
            <div className="w-56 p-2 border-l bg-muted/50 overflow-y-auto">
              <div className="space-y-2">
                <p className="text-xs font-medium">Common Pages</p>
                <div className="space-y-1">
                  {navUrls.map((item) => (
                    <Button
                      key={item.url}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-xs h-7"
                      onClick={() => navigateTo(item.url)}
                    >
                      {item.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {orientation === "vertical" && (
          <div className="flex overflow-x-auto py-1 space-x-1">
            {navUrls.map((item) => (
              <Button
                key={item.url}
                variant="outline"
                size="sm"
                className="text-xs h-7 whitespace-nowrap"
                onClick={() => navigateTo(item.url)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

