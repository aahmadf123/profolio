"use client"

import { Suspense, useState, useEffect, useCallback } from "react"
import { CardFooter } from "@/components/ui/card"
import {
  Grid,
  List,
  Filter,
  ArrowRight,
  Layers,
  Plus,
  Copy,
  Edit,
  Trash2,
  Layout,
  FileText,
  Users,
  MessageSquare,
  Map,
} from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"

interface Template {
  id: string
  title: string
  description: string
  type: string
  thumbnail: string
  tags: string[]
}

function TemplatesPageContent() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const { toast } = useToast()
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [templateUsed, setTemplateUsed] = useState(false)

  // Sample templates data
  const templates: Template[] = [
    {
      id: "project-basic",
      title: "Basic Project",
      description: "A simple project card with title, description, and links",
      type: "project",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["project", "basic", "card"],
    },
    {
      id: "project-detailed",
      title: "Detailed Project",
      description: "A comprehensive project template with images, tech stack, and results",
      type: "project",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["project", "detailed", "showcase"],
    },
    {
      id: "skill-basic",
      title: "Skill Card",
      description: "A simple skill card showing proficiency level",
      type: "skill",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["skill", "card", "basic"],
    },
    {
      id: "skill-detailed",
      title: "Detailed Skill Profile",
      description: "A comprehensive skill profile with related tools and projects",
      type: "skill",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["skill", "detailed", "profile"],
    },
    {
      id: "timeline-event",
      title: "Timeline Event",
      description: "A timeline event card for work or education history",
      type: "timeline",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["timeline", "event", "history"],
    },
    {
      id: "contact-form",
      title: "Contact Form",
      description: "A contact form with email validation and submission handling",
      type: "section",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["contact", "form", "section"],
    },
    {
      id: "chatbot-basic",
      title: "AI Chatbot",
      description: "An AI-powered chatbot interface for visitor interaction",
      type: "interactive",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["chatbot", "ai", "interactive"],
    },
    {
      id: "world-map",
      title: "Interactive World Map",
      description: "An interactive world map showing your journey or experience",
      type: "interactive",
      thumbnail: "/placeholder.svg?height=200&width=300",
      tags: ["map", "interactive", "journey"],
    },
  ]

  // Get unique template types
  const templateTypes = Array.from(new Set(templates.map((template) => template.type)))

  // Filter templates based on search and type
  const filteredTemplates = templates.filter((template) => {
    const matchesSearch =
      template.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesType = selectedType ? template.type === selectedType : true

    return matchesSearch && matchesType
  })

  // Handle using a template
  const useTemplate = useCallback(() => {
    if (selectedTemplate) {
      toast({
        title: "Template Selected",
        description: `You've selected the "${selectedTemplate.title}" template. Ready to customize.`,
      })
      setTemplateUsed(true)
    }
  }, [selectedTemplate, toast])

  useEffect(() => {
    if (!isDialogOpen && selectedTemplate) {
      useTemplate()
      setSelectedTemplate(null)
    }
  }, [isDialogOpen, selectedTemplate, toast, useTemplate])

  useEffect(() => {
    if (templateUsed) {
      setTemplateUsed(false)
    }
  }, [templateUsed])

  // Get icon based on template type
  const getTemplateIcon = (type: string) => {
    switch (type) {
      case "project":
        return <FileText className="h-4 w-4" />
      case "skill":
        return <Users className="h-4 w-4" />
      case "timeline":
        return <Layout className="h-4 w-4" />
      case "section":
        return <Layers className="h-4 w-4" />
      case "interactive":
        return type === "chatbot" ? <MessageSquare className="h-4 w-4" /> : <Map className="h-4 w-4" />
      default:
        return <Layout className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Templates</h1>
          <p className="text-muted-foreground">Pre-designed templates for projects, skills, sections, and more</p>
        </div>

        <Dialog
          onOpenChange={(open) => {
            setIsDialogOpen(open)
          }}
        >
          <DialogTrigger asChild>
            <Button className="gap-1" disabled={!selectedTemplate}>
              <Plus className="h-4 w-4" />
              Create Template
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Template</DialogTitle>
              <DialogDescription>Design a new template for future content.</DialogDescription>
            </DialogHeader>
            <div className="py-6">
              <p className="text-center text-muted-foreground">Template creation form will be displayed here.</p>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            {/* Search and filter */}
            <div className="relative flex-grow max-w-md">
              <Input
                type="text"
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            </div>

            <div className="flex items-center space-x-4 w-full sm:w-auto">
              {/* Template type filter */}
              <Tabs defaultValue="all" onValueChange={(value) => setSelectedType(value === "all" ? null : value)}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  {templateTypes.map((type) => (
                    <TabsTrigger key={type} value={type} className="capitalize">
                      {type}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

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
          {filteredTemplates.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No templates found.</p>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <Card key={template.id} className="overflow-hidden flex flex-col">
                  <div className="aspect-video bg-muted">
                    <img
                      src={template.thumbnail || "/placeholder.svg"}
                      alt={template.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="flex-grow p-4">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="secondary" className="capitalize">
                        {getTemplateIcon(template.type)}
                        <span className="ml-1">{template.type}</span>
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">{template.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {template.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0 gap-2">
                    <Button variant="default" className="w-full" onClick={() => setSelectedTemplate(template)}>
                      Use Template
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="flex items-center justify-between p-3 hover:bg-muted rounded-md">
                  <div className="flex items-center space-x-3">
                    <div className="h-12 w-12 rounded overflow-hidden bg-muted">
                      <img
                        src={template.thumbnail || "/placeholder.svg"}
                        alt={template.title}
                        className="object-cover w-full h-full"
                      />
                    </div>
                    <div>
                      <div className="flex items-center">
                        <h3 className="font-medium">{template.title}</h3>
                        <Badge variant="secondary" className="ml-2 capitalize">
                          {template.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{template.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setSelectedTemplate(template)}>
                      Use
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
function TemplatesWrapper() {
  return (
    <Suspense fallback={<div>Loading templates...</div>}>
      <TemplatesPageContent />
    </Suspense>
  )
}

export default function TemplatesPage() {
  return <TemplatesWrapper />
}

