"use client"

import { useState } from "react"
import { ChevronRight, PlusCircle, Edit, Trash, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/components/ui/use-toast"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"

// Sample achievements based on previous user achievements
const initialAchievements = [
  {
    id: "explorer",
    title: "Explorer",
    description: "Visit all sections of the website",
    unlocked: false,
    icon: "Award",
    active: true,
  },
  {
    id: "curious",
    title: "Curious Mind",
    description: "View details of at least 3 different projects",
    unlocked: false,
    icon: "Search",
    active: true,
  },
  {
    id: "tech_enthusiast",
    title: "Tech Enthusiast",
    description: "Explore all skill categories",
    unlocked: false,
    icon: "Cpu",
    active: true,
  },
  {
    id: "map_traveler",
    title: "World Traveler",
    description: "Interact with the world map",
    unlocked: false,
    icon: "Map",
    active: true,
  },
  {
    id: "chatbot_friend",
    title: "AI Companion",
    description: "Have a conversation with the AI chatbot",
    unlocked: false,
    icon: "MessageSquare",
    active: true,
  },
  {
    id: "night_owl",
    title: "Night Owl",
    description: "Switch to dark mode",
    unlocked: false,
    icon: "Moon",
    active: true,
  },
  {
    id: "early_bird",
    title: "Early Bird",
    description: "Switch to light mode",
    unlocked: false,
    icon: "Sun",
    active: true,
  },
  {
    id: "media_buff",
    title: "Media Buff",
    description: "Watch a video or interact with 3D content",
    unlocked: false,
    icon: "Film",
    active: true,
  },
  {
    id: "knowledge_seeker",
    title: "Knowledge Seeker",
    description: "Read a blog post",
    unlocked: false,
    icon: "BookOpen",
    active: true,
  },
  {
    id: "future_visionary",
    title: "Future Visionary",
    description: "Explore the future aspirations section",
    unlocked: false,
    icon: "Compass",
    active: true,
  },
]

export default function GamificationContent() {
  const [achievements, setAchievements] = useState(initialAchievements)
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [gamificationEnabled, setGamificationEnabled] = useState(true)
  const { toast } = useToast()

  // Handle saving achievement changes
  const saveAchievement = (achievement: any) => {
    if (achievement.id) {
      // Update existing achievement
      setAchievements(achievements.map((a) => (a.id === achievement.id ? achievement : a)))
    } else {
      // Add new achievement
      const newId = `custom_${Date.now().toString(36)}`
      setAchievements([
        ...achievements,
        {
          ...achievement,
          id: newId,
          unlocked: false,
          active: true,
        },
      ])
    }

    setIsDialogOpen(false)
    setSelectedAchievement(null)

    toast({
      title: "Success",
      description: `Achievement ${achievement.id ? "updated" : "created"} successfully`,
    })
  }

  // Handle deleting an achievement
  const deleteAchievement = (id: string) => {
    setAchievements(achievements.filter((a) => a.id !== id))

    toast({
      title: "Success",
      description: "Achievement deleted successfully",
    })
  }

  // Handle toggling achievement active state
  const toggleAchievementActive = (id: string) => {
    setAchievements(achievements.map((a) => (a.id === id ? { ...a, active: !a.active } : a)))
  }

  // Open the dialog for editing
  const editAchievement = (achievement: any) => {
    setSelectedAchievement(achievement)
    setIsDialogOpen(true)
  }

  // Open the dialog for creating
  const createAchievement = () => {
    setSelectedAchievement({
      title: "",
      description: "",
      icon: "Award",
    })
    setIsDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gamification Management</h1>
        <p className="text-muted-foreground">Manage achievements, progress bars, and other gamification elements</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Enable Gamification</CardTitle>
              <CardDescription>Turn on or off all gamification features across your site</CardDescription>
            </div>
            <Switch checked={gamificationEnabled} onCheckedChange={setGamificationEnabled} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Achievement Progress</h3>
              <Badge variant="secondary">{achievements.filter((a) => a.active).length} Active Achievements</Badge>
            </div>
            <Progress
              value={(achievements.filter((a) => a.unlocked).length / achievements.length) * 100}
              className="h-2"
            />
            <div className="text-sm text-muted-foreground">
              {achievements.filter((a) => a.unlocked).length} out of {achievements.length} achievements unlocked
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="achievements">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
          <TabsTrigger value="milestones">Milestones & Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="achievements" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Manage Achievements</h2>
            <Button onClick={createAchievement}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Create Achievement
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              {achievements.map((achievement) => (
                <Collapsible key={achievement.id} className="mb-4">
                  <div className="flex items-center justify-between py-2 px-4 rounded-md hover:bg-muted">
                    <div className="flex items-center">
                      <CollapsibleTrigger className="flex items-center">
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </CollapsibleTrigger>
                      <div className={`ml-2 w-4 h-4 rounded-full ${achievement.active ? "bg-primary" : "bg-muted"}`} />
                      <span className="ml-2 font-medium">{achievement.title}</span>
                      {achievement.unlocked && (
                        <Badge variant="secondary" className="ml-2">
                          Unlocked
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => toggleAchievementActive(achievement.id)}>
                        <Switch
                          checked={achievement.active}
                          onClick={(e) => e.stopPropagation()}
                          className="data-[state=checked]:bg-primary"
                        />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => editAchievement(achievement)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteAchievement(achievement.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <CollapsibleContent className="px-10 py-2">
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">{achievement.description}</p>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline">ID: {achievement.id}</Badge>
                        <Badge variant="outline">Icon: {achievement.icon}</Badge>
                      </div>
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="milestones" className="space-y-4 mt-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Milestones & Progress</h2>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Milestone
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground text-center py-12">Milestone configuration will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Achievement Edit/Create Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{selectedAchievement?.id ? "Edit Achievement" : "Create Achievement"}</DialogTitle>
            <DialogDescription>
              {selectedAchievement?.id
                ? "Modify the details of this achievement."
                : "Create a new achievement for your users to unlock."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={selectedAchievement?.title || ""}
                onChange={(e) => setSelectedAchievement({ ...selectedAchievement, title: e.target.value })}
                placeholder="Achievement title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={selectedAchievement?.description || ""}
                onChange={(e) => setSelectedAchievement({ ...selectedAchievement, description: e.target.value })}
                placeholder="Describe how to unlock this achievement"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Input
                id="icon"
                value={selectedAchievement?.icon || ""}
                onChange={(e) => setSelectedAchievement({ ...selectedAchievement, icon: e.target.value })}
                placeholder="Icon name (e.g., Award, Star, Trophy)"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => saveAchievement(selectedAchievement)}>
              <Save className="h-4 w-4 mr-2" />
              {selectedAchievement?.id ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

