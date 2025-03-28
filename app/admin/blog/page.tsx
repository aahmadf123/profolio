"use client"

import { Suspense, useState } from "react"
import { PlusCircle, Search, Filter, Edit, Trash, Calendar, Eye, ArrowUpDown, CheckCircle, XCircle } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useToast } from "@/components/ui/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useSearchParams } from "next/navigation"

// Add this near the top of your file
import { logActivity } from "@/lib/logging-service"

interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  published: boolean
  featured: boolean
  createdAt: string
  updatedAt: string
}

function BlogContent() {
  const searchParams = useSearchParams()
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(searchParams.get("category") || null)
  const [sortBy, setSortBy] = useState<"title" | "date">((searchParams.get("sort") as "title" | "date") || "date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">((searchParams.get("order") as "asc" | "desc") || "desc")
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") || "all")
  const { toast } = useToast()

  // Sample blog posts data
  const blogPosts: BlogPost[] = [
    {
      id: "quantum-robotics-future",
      title: "The Future of Quantum Computing in Robotics",
      excerpt:
        "Exploring how quantum algorithms can revolutionize path planning and decision making in autonomous robotic systems.",
      content: "Full content would go here...",
      coverImage: "/placeholder.svg?height=400&width=800",
      category: "Quantum Computing",
      tags: ["Quantum", "Robotics", "AI", "Research"],
      published: true,
      featured: true,
      createdAt: "2023-11-10T14:30:00Z",
      updatedAt: "2023-11-12T09:15:00Z",
    },
    {
      id: "drone-swarm-intelligence",
      title: "Swarm Intelligence: Coordinating Drone Fleets",
      excerpt:
        "How biomimetic algorithms inspired by bees and ants are enabling unprecedented coordination in drone swarm operations.",
      content: "Full content would go here...",
      coverImage: "/placeholder.svg?height=400&width=800",
      category: "Drones",
      tags: ["Drones", "Swarm Intelligence", "Algorithms"],
      published: true,
      featured: false,
      createdAt: "2023-10-25T10:15:00Z",
      updatedAt: "2023-10-26T16:20:00Z",
    },
    {
      id: "reinforcement-learning-robotics",
      title: "Reinforcement Learning Breakthroughs in Robotic Manipulation",
      excerpt:
        "Recent advances in reinforcement learning are making robotic manipulation more adaptable and precise than ever before.",
      content: "Full content would go here...",
      coverImage: "/placeholder.svg?height=400&width=800",
      category: "AI",
      tags: ["Reinforcement Learning", "Robotics", "AI"],
      published: true,
      featured: false,
      createdAt: "2023-10-12T08:30:00Z",
      updatedAt: "2023-10-15T13:45:00Z",
    },
    {
      id: "quantum-optimization-challenges",
      title: "Overcoming Challenges in Quantum Optimization",
      excerpt:
        "Addressing the practical limitations and future potential of quantum computing for solving complex optimization problems.",
      content: "Full content would go here...",
      coverImage: "/placeholder.svg?height=400&width=800",
      category: "Quantum Computing",
      tags: ["Quantum", "Optimization", "Challenges"],
      published: true,
      featured: false,
      createdAt: "2023-09-30T10:15:00Z",
      updatedAt: "2023-10-05T09:30:00Z",
    },
    {
      id: "future-of-aerial-robotics",
      title: "The Future of Aerial Robotics",
      excerpt: "Exploring upcoming trends and technologies in drone development and aerial robotics.",
      content: "Full content would go here...",
      coverImage: "/placeholder.svg?height=400&width=800",
      category: "Drones",
      tags: ["Drones", "Future Tech", "Robotics"],
      published: false,
      featured: false,
      createdAt: "2023-11-15T11:20:00Z",
      updatedAt: "2023-11-15T11:20:00Z",
    },
  ]

  // Get unique categories
  const categories = Array.from(new Set(blogPosts.map((post) => post.category)))

  // Filter and sort blog posts
  const filteredPosts = blogPosts
    .filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

      const matchesCategory = selectedCategory ? post.category === selectedCategory : true

      const matchesTab =
        activeTab === "all"
          ? true
          : activeTab === "published"
            ? post.published
            : activeTab === "drafts"
              ? !post.published
              : activeTab === "featured"
                ? post.featured
                : true

      return matchesSearch && matchesCategory && matchesTab
    })
    .sort((a, b) => {
      if (sortBy === "title") {
        return sortOrder === "asc" ? a.title.localeCompare(b.title) : b.title.localeCompare(a.title)
      } else {
        return sortOrder === "asc"
          ? new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
          : new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      }
    })

  // Edit post
  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post)
    setIsDialogOpen(true)
  }

  const userEmail = "test@example.com" // Replace with actual user email retrieval

  // Then modify your handleSavePost function
  const handleSavePost = async () => {
    if (!selectedPost) return

    // In a real app, this would be an API call
    // Your existing code...

    // Add logging
    await logActivity(
      "success",
      selectedPost.id ? `Blog post updated: ${selectedPost.title}` : `Blog post created: ${selectedPost.title}`,
      "blog",
      userEmail || undefined,
    )

    toast({
      title: "Post Saved",
      description: `Successfully saved ${selectedPost.title}`,
    })

    setIsDialogOpen(false)
    setSelectedPost(null)
  }

  // And your handleDeletePost function
  const handleDeletePost = async () => {
    if (!selectedPost) return

    // In a real app, this would be an API call
    // Your existing code...

    // Add logging
    await logActivity("warning", `Blog post deleted: ${selectedPost.title}`, "blog", userEmail || undefined)

    toast({
      title: "Post Deleted",
      description: `Successfully deleted ${selectedPost.title}`,
    })

    setIsDeleteDialogOpen(false)
    setSelectedPost(null)
  }

  // Toggle sort order
  const toggleSort = (field: "title" | "date") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(field)
      setSortOrder("asc")
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blog Posts</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-1" onClick={() => setSelectedPost(null)}>
              <PlusCircle className="h-4 w-4" />
              New Post
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>{selectedPost ? "Edit Post" : "Create New Post"}</DialogTitle>
              <DialogDescription>
                {selectedPost ? "Update your blog post details below." : "Fill in the details of your new blog post."}
              </DialogDescription>
            </DialogHeader>
            {selectedPost !== null || isDialogOpen ? (
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="title">Post Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter post title"
                    value={selectedPost?.title || ""}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost!,
                        title: e.target.value,
                      } as BlogPost)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Brief summary of the post"
                    value={selectedPost?.excerpt || ""}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost!,
                        excerpt: e.target.value,
                      } as BlogPost)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Full post content (HTML supported)"
                    className="min-h-[200px]"
                    value={selectedPost?.content || ""}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost!,
                        content: e.target.value,
                      } as BlogPost)
                    }
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      placeholder="e.g., Robotics, AI"
                      value={selectedPost?.category || ""}
                      onChange={(e) =>
                        setSelectedPost({
                          ...selectedPost!,
                          category: e.target.value,
                        } as BlogPost)
                      }
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="coverImage">Cover Image URL</Label>
                    <Input
                      id="coverImage"
                      placeholder="Image path or URL"
                      value={selectedPost?.coverImage || ""}
                      onChange={(e) =>
                        setSelectedPost({
                          ...selectedPost!,
                          coverImage: e.target.value,
                        } as BlogPost)
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="tags">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    placeholder="e.g., Robotics, AI, Research"
                    value={selectedPost?.tags.join(", ") || ""}
                    onChange={(e) =>
                      setSelectedPost({
                        ...selectedPost!,
                        tags: e.target.value.split(",").map((tag) => tag.trim()),
                      } as BlogPost)
                    }
                  />
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="published"
                      checked={selectedPost?.published || false}
                      onCheckedChange={(checked) =>
                        setSelectedPost({
                          ...selectedPost!,
                          published: checked as boolean,
                        } as BlogPost)
                      }
                    />
                    <Label htmlFor="published">Published</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="featured"
                      checked={selectedPost?.featured || false}
                      onCheckedChange={(checked) =>
                        setSelectedPost({
                          ...selectedPost!,
                          featured: checked as boolean,
                        } as BlogPost)
                      }
                    />
                    <Label htmlFor="featured">Featured</Label>
                  </div>
                </div>
              </div>
            ) : null}
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePost}>{selectedPost?.id ? "Update Post" : "Create Post"}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete confirmation dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Blog Post</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this blog post? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              {selectedPost && (
                <div className="p-4 bg-muted rounded-md">
                  <h3 className="font-semibold">{selectedPost.title}</h3>
                  <p className="text-sm text-muted-foreground">{selectedPost.category}</p>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeletePost}>
                Delete Post
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Search */}
            <div className="relative flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {/* Post status tabs */}
              <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="published">Published</TabsTrigger>
                  <TabsTrigger value="drafts">Drafts</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Filter by category */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Filter className="h-4 w-4" />
                    {selectedCategory || "All Categories"}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setSelectedCategory(null)}>All Categories</DropdownMenuItem>
                  {categories.map((category) => (
                    <DropdownMenuItem key={category} onClick={() => setSelectedCategory(category)}>
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <div className="grid grid-cols-12 p-4 bg-muted text-sm font-medium">
              <div className="col-span-5 flex items-center gap-2">
                <Button variant="ghost" size="sm" className="gap-1 p-0 font-medium" onClick={() => toggleSort("title")}>
                  Post Title
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="col-span-2 text-center">Category</div>
              <div className="col-span-2 text-center">
                <Button variant="ghost" size="sm" className="gap-1 p-0 font-medium" onClick={() => toggleSort("date")}>
                  Updated
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </div>
              <div className="col-span-1 text-center">Status</div>
              <div className="col-span-2 text-right">Actions</div>
            </div>

            {filteredPosts.map((post) => (
              <div key={post.id} className="grid grid-cols-12 items-center p-4 border-t">
                <div className="col-span-5 flex items-center gap-3">
                  <div className="h-10 w-16 rounded overflow-hidden bg-muted flex-shrink-0">
                    <img
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium truncate">{post.title}</p>
                    <p className="text-sm text-muted-foreground truncate">
                      {post.tags.slice(0, 3).join(", ")}
                      {post.tags.length > 3 && "..."}
                    </p>
                  </div>
                </div>
                <div className="col-span-2 text-center">
                  <Badge variant="outline">{post.category}</Badge>
                </div>
                <div className="col-span-2 text-center text-sm text-muted-foreground">
                  <div className="flex items-center justify-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatDate(post.updatedAt)}
                  </div>
                </div>
                <div className="col-span-1 text-center">
                  {post.published ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mx-auto" />
                  ) : (
                    <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                  )}
                </div>
                <div className="col-span-2 flex justify-end space-x-2">
                  <a
                    href={`/blog/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </a>
                  <button
                    onClick={() => handleEditPost(post)}
                    className="p-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-muted transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedPost(post)
                      setIsDeleteDialogOpen(true)
                    }}
                    className="p-2 text-muted-foreground hover:text-destructive rounded-md hover:bg-muted transition-colors"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}

            {filteredPosts.length === 0 && (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">No blog posts found.</p>
                {(searchQuery || selectedCategory || activeTab !== "all") && (
                  <Button
                    variant="link"
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                      setActiveTab("all")
                    }}
                  >
                    Clear filters
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <BlogContent />
    </Suspense>
  )
}

