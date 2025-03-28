"use client"

import type React from "react"
import { Suspense, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthContext } from "@/components/auth-provider"
import { BarChart, Users, FileText, Image, Settings, Calendar, TrendingUp } from "lucide-react"

function DashboardContent() {
  const { userEmail } = useAuthContext()
  const [lastLogin, setLastLogin] = useState<string>("")

  useEffect(() => {
    // Set last login time
    setLastLogin(new Date().toLocaleString())
  }, [])

  // Dashboard stats
  const stats = [
    {
      title: "Total Projects",
      value: "12",
      change: "+2 this month",
      icon: FileText,
    },
    {
      title: "Page Views",
      value: "2,845",
      change: "+14% from last month",
      icon: TrendingUp,
    },
    {
      title: "Media Files",
      value: "48",
      change: "6 new uploads",
      icon: Image,
    },
    {
      title: "Skills",
      value: "24",
      change: "Last updated 3 days ago",
      icon: Users,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {userEmail}. Last login: {lastLogin}
        </p>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between space-x-4">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                    </div>
                    <div className="p-2 bg-primary/10 rounded-full">
                      <stat.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and shortcuts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <QuickActionButton icon={FileText} label="Add New Project" href="/admin/projects/new" />
                <QuickActionButton icon={Image} label="Upload Media" href="/admin/media" />
                <QuickActionButton icon={Settings} label="Edit Profile" href="/admin/settings" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Updates */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Updates</CardTitle>
              <CardDescription>Latest changes to your portfolio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <FileText className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Project Updated: Quantum Optimization</p>
                    <p className="text-sm text-muted-foreground">Updated description and added new screenshots</p>
                    <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Skill Added: Reinforcement Learning</p>
                    <p className="text-sm text-muted-foreground">Added new skill with 85% proficiency</p>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Timeline Updated</p>
                    <p className="text-sm text-muted-foreground">Added new work experience at Quantum AI Labs</p>
                    <p className="text-xs text-muted-foreground mt-1">3 days ago</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>View detailed analytics about your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <div className="text-center">
                <BarChart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">Analytics data will be displayed here</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your recent actions and changes</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-center py-8">Activity log will be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DashboardContent />
    </Suspense>
  )
}

interface QuickActionButtonProps {
  icon: React.ElementType
  label: string
  href: string
}

function QuickActionButton({ icon: Icon, label, href }: QuickActionButtonProps) {
  return (
    <a href={href} className="flex items-center p-4 border rounded-lg hover:bg-muted transition-colors">
      <div className="p-2 bg-primary/10 rounded-full mr-4">
        <Icon className="h-5 w-5 text-primary" />
      </div>
      <span>{label}</span>
    </a>
  )
}

