"use client"

import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component
import SettingsContent from "./settings-content"

export default function SettingsPage() {
  return (
    <Suspense fallback={<SettingsSkeleton />}>
      <SettingsContent />
    </Suspense>
  )
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[300px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    </div>
  )
}

// export default function SettingsPage() {
//   const { toast } = useToast()
//   const { userEmail } = useAuthContext()
//   const [isSaving, setIsSaving] = useState(false)

//   // Profile form state
//   const [profileForm, setProfileForm] = useState({
//     name: "Your Name",
//     email: userEmail || "",
//     bio: "Passionate about leveraging cutting-edge technologies to solve complex problems in robotics, artificial intelligence, and quantum computing.",
//     location: "San Francisco, CA",
//     website: "https://yourwebsite.com",
//   })

//   // Site settings form state
//   const [siteForm, setSiteForm] = useState({
//     siteTitle: "Personal Portfolio",
//     siteDescription: "My professional portfolio showcasing projects in robotics, AI, and quantum computing.",
//     enableBlog: true,
//     enableAchievements: true,
//     enableDarkMode: true,
//     enableParticles: true,
//   })

//   // Social links form state
//   const [socialForm, setSocialForm] = useState({
//     github: "https://github.com/yourusername",
//     linkedin: "https://linkedin.com/in/yourusername",
//     twitter: "https://twitter.com/yourusername",
//     email: "your.email@example.com",
//   })

//   // Handle profile form change
//   const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//     const { name, value } = e.target
//     setProfileForm((prev) => ({ ...prev, [name]: value }))
//   }

//   // Handle site form change
//   const handleSiteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value, type, checked } = e.target
//     setSiteForm((prev) => ({
//       ...prev,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }

//   // Handle toggle change
//   const handleToggleChange = (name: string, checked: boolean) => {
//     setSiteForm((prev) => ({ ...prev, [name]: checked }))
//   }

//   // Handle social form change
//   const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = e.target
//     setSocialForm((prev) => ({ ...prev, [name]: value }))
//   }

//   // Handle form submission
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setIsSaving(true)

//     // Simulate API call
//     await new Promise((resolve) => setTimeout(resolve, 1500))

//     toast({
//       title: "Settings saved",
//       description: "Your settings have been saved successfully.",
//     })

//     setIsSaving(false)
//   }

//   return (
//     <div className="space-y-6">
//       <div>
//         <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
//         <p className="text-muted-foreground">Manage your account and site settings</p>
//       </div>

//       <Tabs defaultValue="profile" className="space-y-6">
//         <TabsList>
//           <TabsTrigger value="profile">Profile</TabsTrigger>
//           <TabsTrigger value="picture">Picture</TabsTrigger>
//           <TabsTrigger value="site">Site</TabsTrigger>
//           <TabsTrigger value="social">Social Links</TabsTrigger>
//         </TabsList>

//         <TabsContent value="profile" className="space-y-6">
//           <Card>
//             <form onSubmit={handleSubmit}>
//               <CardHeader>
//                 <CardTitle>Profile Information</CardTitle>
//                 <CardDescription>Update your personal information</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="name">Name</Label>
//                     <Input id="name" name="name" value={profileForm.name} onChange={handleProfileChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Email</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={profileForm.email}
//                       onChange={handleProfileChange}
//                     />
//                   </div>
//                 </div>
//                 <div className="space-y-2">
//                   <Label htmlFor="bio">Bio</Label>
//                   <Textarea id="bio" name="bio" rows={4} value={profileForm.bio} onChange={handleProfileChange} />
//                 </div>
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="location">Location</Label>
//                     <Input id="location" name="location" value={profileForm.location} onChange={handleProfileChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="website">Website</Label>
//                     <Input id="website" name="website" value={profileForm.website} onChange={handleProfileChange} />
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" disabled={isSaving}>
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>

//         <TabsContent value="picture" className="space-y-6">
//           <ProfilePictureUpload
//             currentImageUrl="/placeholder.svg?height=200&width=200"
//             onImageUpload={(url) => {
//               // In a real app, you would save this URL to your database
//               console.log("Profile picture updated:", url)
//               // For now, we'll just show a toast
//               toast({
//                 title: "Profile picture updated",
//                 description: "Your profile picture has been successfully updated.",
//               })
//             }}
//           />
//         </TabsContent>

//         <TabsContent value="site" className="space-y-6">
//           <Card>
//             <form onSubmit={handleSubmit}>
//               <CardHeader>
//                 <CardTitle>Site Settings</CardTitle>
//                 <CardDescription>Customize your portfolio site</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 <div className="space-y-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="siteTitle">Site Title</Label>
//                     <Input id="siteTitle" name="siteTitle" value={siteForm.siteTitle} onChange={handleSiteChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="siteDescription">Site Description</Label>
//                     <Textarea
//                       id="siteDescription"
//                       name="siteDescription"
//                       rows={3}
//                       value={siteForm.siteDescription}
//                       onChange={handleSiteChange}
//                     />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   <h3 className="text-lg font-medium">Features</h3>
//                   <div className="space-y-3">
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label htmlFor="enableBlog" className="text-base">
//                           Enable Blog
//                         </Label>
//                         <p className="text-sm text-muted-foreground">Show the blog section on your portfolio</p>
//                       </div>
//                       <Switch
//                         id="enableBlog"
//                         checked={siteForm.enableBlog}
//                         onCheckedChange={(checked) => handleToggleChange("enableBlog", checked)}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label htmlFor="enableAchievements" className="text-base">
//                           Enable Achievements
//                         </Label>
//                         <p className="text-sm text-muted-foreground">Show achievement notifications to visitors</p>
//                       </div>
//                       <Switch
//                         id="enableAchievements"
//                         checked={siteForm.enableAchievements}
//                         onCheckedChange={(checked) => handleToggleChange("enableAchievements", checked)}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label htmlFor="enableDarkMode" className="text-base">
//                           Enable Dark Mode
//                         </Label>
//                         <p className="text-sm text-muted-foreground">
//                           Allow visitors to switch between light and dark mode
//                         </p>
//                       </div>
//                       <Switch
//                         id="enableDarkMode"
//                         checked={siteForm.enableDarkMode}
//                         onCheckedChange={(checked) => handleToggleChange("enableDarkMode", checked)}
//                       />
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <div>
//                         <Label htmlFor="enableParticles" className="text-base">
//                           Enable Particles
//                         </Label>
//                         <p className="text-sm text-muted-foreground">Show animated particle background</p>
//                       </div>
//                       <Switch
//                         id="enableParticles"
//                         checked={siteForm.enableParticles}
//                         onCheckedChange={(checked) => handleToggleChange("enableParticles", checked)}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" disabled={isSaving}>
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>

//         <TabsContent value="social" className="space-y-6">
//           <Card>
//             <form onSubmit={handleSubmit}>
//               <CardHeader>
//                 <CardTitle>Social Links</CardTitle>
//                 <CardDescription>Connect your social media accounts</CardDescription>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <Label htmlFor="github">GitHub</Label>
//                     <Input id="github" name="github" value={socialForm.github} onChange={handleSocialChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="linkedin">LinkedIn</Label>
//                     <Input id="linkedin" name="linkedin" value={socialForm.linkedin} onChange={handleSocialChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="twitter">Twitter</Label>
//                     <Input id="twitter" name="twitter" value={socialForm.twitter} onChange={handleSocialChange} />
//                   </div>
//                   <div className="space-y-2">
//                     <Label htmlFor="email">Contact Email</Label>
//                     <Input
//                       id="email"
//                       name="email"
//                       type="email"
//                       value={socialForm.email}
//                       onChange={handleSocialChange}
//                     />
//                   </div>
//                 </div>
//               </CardContent>
//               <CardFooter>
//                 <Button type="submit" disabled={isSaving}>
//                   {isSaving ? (
//                     <>
//                       <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     "Save Changes"
//                   )}
//                 </Button>
//               </CardFooter>
//             </form>
//           </Card>
//         </TabsContent>
//       </Tabs>
//     </div>
//   )
// }

