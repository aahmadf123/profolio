'use client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ServiceStatusPanel } from '@/components/admin/service-status'

export default function AdminDashboardContent() {
  return (
    <div className='p-6'>
      <div className='flex flex-col space-y-6'>
        <h1 className='text-3xl font-bold'>Admin Dashboard</h1>

        <ServiceStatusPanel />

        <Tabs defaultValue='overview'>
          <TabsList>
            <TabsTrigger value='overview'>Overview</TabsTrigger>
            <TabsTrigger value='activity'>Recent Activity</TabsTrigger>
          </TabsList>

          <TabsContent value='overview' className='space-y-4'>
            <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Total Page Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>--</div>
                  <p className='text-xs text-muted-foreground'>+-- from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Blog Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>--</div>
                  <p className='text-xs text-muted-foreground'>-- published, -- drafts</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
                  <CardTitle className='text-sm font-medium'>Projects</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className='text-2xl font-bold'>--</div>
                  <p className='text-xs text-muted-foreground'>-- featured projects</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value='activity'>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Recent actions and events on your website</CardDescription>
              </CardHeader>
              <CardContent>
                <p className='text-sm text-muted-foreground'>No recent activity to display</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
