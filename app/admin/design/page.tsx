import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Eye } from "lucide-react"

const DesignPage = () => {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-semibold mb-5">Design</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Color Scheme</CardTitle>
              <Button variant="outline" size="sm" asChild>
                <a href="/admin/design/live-editor">
                  <Eye className="h-4 w-4 mr-2" />
                  Live Editor
                </a>
              </Button>
            </div>
            <CardDescription>Customize the primary and secondary colors of your site</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Color scheme customization options will go here */}
            <p>Coming Soon!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Typography</CardTitle>
            <CardDescription>Choose the fonts for your headings and body text</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Typography customization options will go here */}
            <p>Coming Soon!</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Logo</CardTitle>
            <CardDescription>Upload and manage your site logo</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Logo upload and management options will go here */}
            <p>Coming Soon!</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default DesignPage

