"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Mail, MapPin, Phone, Save, RefreshCw, Globe } from "lucide-react"

export default function ContactSettingsContent() {
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  // Contact information form state
  const [contactInfo, setContactInfo] = useState({
    email: "your.email@example.com",
    phone: "+1 (123) 456-7890",
    location: "San Francisco, California, USA",
    description:
      "Have a question or want to work together? Feel free to reach out using the form below or through my contact information.",
  })

  // Social links form state
  const [socialLinks, setSocialLinks] = useState({
    github: "https://github.com/yourusername",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
    scholar: "https://scholar.google.com",
    website: "https://yourwebsite.com",
  })

  // Form settings state
  const [formSettings, setFormSettings] = useState({
    enableForm: true,
    notificationEmail: "your.email@example.com",
    autoReply: true,
    autoReplyMessage: "Thank you for your message. I'll get back to you as soon as possible.",
  })

  // Handle contact info change
  const handleContactInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setContactInfo((prev) => ({ ...prev, [name]: value }))
  }

  // Handle social links change
  const handleSocialLinksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setSocialLinks((prev) => ({ ...prev, [name]: value }))
  }

  // Handle form settings change
  const handleFormSettingsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target
    setFormSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  // Save settings
  const saveSettings = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real app, you would save these settings to your database
    // For now, we'll just show a success message
    toast({
      title: "Settings saved",
      description: "Your contact settings have been updated successfully.",
    })

    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Contact Settings</h1>
        <p className="text-muted-foreground">Manage your contact information and form settings</p>
      </div>

      <Tabs defaultValue="contact-info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="contact-info">Contact Information</TabsTrigger>
          <TabsTrigger value="social-links">Social Links</TabsTrigger>
          <TabsTrigger value="form-settings">Form Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="contact-info" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Update your contact details displayed on your website</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <label htmlFor="email" className="text-sm font-medium">
                      Email Address
                    </label>
                  </div>
                  <Input
                    id="email"
                    name="email"
                    value={contactInfo.email}
                    onChange={handleContactInfoChange}
                    placeholder="your.email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <label htmlFor="phone" className="text-sm font-medium">
                      Phone Number
                    </label>
                  </div>
                  <Input
                    id="phone"
                    name="phone"
                    value={contactInfo.phone}
                    onChange={handleContactInfoChange}
                    placeholder="+1 (123) 456-7890"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <label htmlFor="location" className="text-sm font-medium">
                    Location
                  </label>
                </div>
                <Input
                  id="location"
                  name="location"
                  value={contactInfo.location}
                  onChange={handleContactInfoChange}
                  placeholder="City, State, Country"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">
                  Contact Section Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={contactInfo.description}
                  onChange={handleContactInfoChange}
                  placeholder="Description text for your contact section"
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="social-links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Social Media Links</CardTitle>
              <CardDescription>Update your social media profiles and online presence</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="github" className="text-sm font-medium">
                    GitHub
                  </label>
                  <Input
                    id="github"
                    name="github"
                    value={socialLinks.github}
                    onChange={handleSocialLinksChange}
                    placeholder="https://github.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm font-medium">
                    LinkedIn
                  </label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={socialLinks.linkedin}
                    onChange={handleSocialLinksChange}
                    placeholder="https://linkedin.com/in/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm font-medium">
                    Twitter
                  </label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={socialLinks.twitter}
                    onChange={handleSocialLinksChange}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="scholar" className="text-sm font-medium">
                    Google Scholar
                  </label>
                  <Input
                    id="scholar"
                    name="scholar"
                    value={socialLinks.scholar}
                    onChange={handleSocialLinksChange}
                    placeholder="https://scholar.google.com/citations?user=yourid"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="website" className="text-sm font-medium">
                    Personal Website
                  </label>
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      value={socialLinks.website}
                      onChange={handleSocialLinksChange}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="form-settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Contact Form Settings</CardTitle>
              <CardDescription>Configure how your contact form works</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="enableForm" className="text-sm font-medium">
                    Enable Contact Form
                  </label>
                  <p className="text-xs text-muted-foreground">Allow visitors to contact you through the form</p>
                </div>
                <input
                  type="checkbox"
                  id="enableForm"
                  name="enableForm"
                  checked={formSettings.enableForm}
                  onChange={handleFormSettingsChange}
                  className="h-4 w-4"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="notificationEmail" className="text-sm font-medium">
                  Notification Email
                </label>
                <p className="text-xs text-muted-foreground">Where to send form submissions</p>
                <Input
                  id="notificationEmail"
                  name="notificationEmail"
                  type="email"
                  value={formSettings.notificationEmail}
                  onChange={handleFormSettingsChange}
                  placeholder="your.email@example.com"
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="autoReply" className="text-sm font-medium">
                    Enable Auto-Reply
                  </label>
                  <p className="text-xs text-muted-foreground">Send an automatic response to form submissions</p>
                </div>
                <input
                  type="checkbox"
                  id="autoReply"
                  name="autoReply"
                  checked={formSettings.autoReply}
                  onChange={handleFormSettingsChange}
                  className="h-4 w-4"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="autoReplyMessage" className="text-sm font-medium">
                  Auto-Reply Message
                </label>
                <Textarea
                  id="autoReplyMessage"
                  name="autoReplyMessage"
                  value={formSettings.autoReplyMessage}
                  onChange={handleFormSettingsChange}
                  placeholder="Thank you for your message. I'll get back to you soon."
                  rows={3}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

