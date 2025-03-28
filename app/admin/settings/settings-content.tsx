"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { useAuthContext } from "@/components/auth-provider"
import { ProfilePictureUpload } from "@/components/admin/profile-picture-upload"
import { IntegrationStatus } from "@/components/admin/integration-status"

export default function SettingsContent() {
  const { toast } = useToast()
  const { userEmail } = useAuthContext()
  const [isSaving, setIsSaving] = useState(false)

  // Profile form state
  const [profileForm, setProfileForm] = useState({
    name: "Your Name",
    email: userEmail || "",
    bio: "Passionate about leveraging cutting-edge technologies to solve complex problems in robotics, artificial intelligence, and quantum computing.",
    location: "San Francisco, CA",
    website: "https://yourwebsite.com",
  })

  // Site settings form state
  const [siteForm, setSiteForm] = useState({
    siteTitle: "Personal Portfolio",
    siteDescription: "My professional portfolio showcasing projects in robotics, AI, and quantum computing.",
    enableBlog: true,
    enableAchievements: true,
    enableDarkMode: true,
    enableParticles: true,
  })

  // Social links form state
  const [socialForm, setSocialForm] = useState({
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    email: "your.email@example.com",
  })

  // Handle profile form change
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfileForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle site form change
  const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setSiteForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Handle toggle change
  const handleToggleChange = (name: string, checked: boolean) => {
    setSiteForm((prev) => ({ ...prev, [name]: checked }))
  }

  // Handle social form change
  const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialForm((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Settings saved",
      description: "Your settings have been saved successfully.",
    })

    setIsSaving(false)
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your profile information</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfilePictureUpload />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the appearance of your website</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Appearance settings coming soon</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2">
              <IntegrationStatus />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

