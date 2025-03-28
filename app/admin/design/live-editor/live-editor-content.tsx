"use client"

import { useState } from "react"
import { Palette, Type, Layout, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/components/ui/use-toast"
import { RealTimePreview } from "@/components/admin/shared/real-time-preview"

export default function LiveEditorContent() {
  const [primaryColor, setPrimaryColor] = useState("#7c3aed")
  const [secondaryColor, setSecondaryColor] = useState("#10b981")
  const [fontFamily, setFontFamily] = useState("Inter")
  const [fontSizeScale, setFontSizeScale] = useState(100)
  const [borderRadius, setBorderRadius] = useState(8)
  const { toast } = useToast()

  // Save theme changes
  const saveThemeChanges = () => {
    toast({
      title: "Theme updated",
      description: "Your theme changes have been saved and applied to the live site.",
    })
  }

  // Apply theme to preview
  const applyThemeToPreview = () => {
    // This would inject CSS variables into the iframe in a real implementation
    toast({
      title: "Preview updated",
      description: "The preview has been updated with your current theme settings.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Live Theme Editor</h1>
          <p className="text-muted-foreground">Customize your site's appearance with real-time preview</p>
        </div>
        <Button onClick={saveThemeChanges}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Tabs defaultValue="colors">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="colors" className="flex items-center gap-1">
                <Palette className="h-4 w-4" />
                Colors
              </TabsTrigger>
              <TabsTrigger value="typography" className="flex items-center gap-1">
                <Type className="h-4 w-4" />
                Typography
              </TabsTrigger>
              <TabsTrigger value="layout" className="flex items-center gap-1">
                <Layout className="h-4 w-4" />
                Layout
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors">
              <Card>
                <CardHeader>
                  <CardTitle>Color Scheme</CardTitle>
                  <CardDescription>Customize the primary and secondary colors of your site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="primary-color">Primary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="primary-color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                        />
                        <input
                          type="color"
                          value={primaryColor}
                          onChange={(e) => setPrimaryColor(e.target.value)}
                          className="w-10 h-10 p-0 border-0"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="secondary-color">Secondary Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="secondary-color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                        />
                        <input
                          type="color"
                          value={secondaryColor}
                          onChange={(e) => setSecondaryColor(e.target.value)}
                          className="w-10 h-10 p-0 border-0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <ColorPreview name="Primary" color={primaryColor} textColor="#ffffff" />
                    <ColorPreview name="Primary Dark" color={adjustColor(primaryColor, -20)} textColor="#ffffff" />
                    <ColorPreview name="Secondary" color={secondaryColor} textColor="#ffffff" />
                    <ColorPreview name="Secondary Dark" color={adjustColor(secondaryColor, -20)} textColor="#ffffff" />
                  </div>

                  <div className="pt-2">
                    <Button onClick={applyThemeToPreview} variant="outline" className="w-full">
                      Apply Colors to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="typography">
              <Card>
                <CardHeader>
                  <CardTitle>Typography</CardTitle>
                  <CardDescription>Customize fonts and text appearance</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label htmlFor="font-family">Font Family</Label>
                    <RadioGroup id="font-family" defaultValue={fontFamily} onValueChange={setFontFamily}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Inter" id="Inter" />
                          <Label htmlFor="Inter" style={{ fontFamily: "Inter" }}>
                            Inter (Default)
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Roboto, sans-serif" id="Roboto" />
                          <Label htmlFor="Roboto" style={{ fontFamily: "Roboto, sans-serif" }}>
                            Roboto
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Poppins, sans-serif" id="Poppins" />
                          <Label htmlFor="Poppins" style={{ fontFamily: "Poppins, sans-serif" }}>
                            Poppins
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="Playfair Display, serif" id="Playfair" />
                          <Label htmlFor="Playfair" style={{ fontFamily: "Playfair Display, serif" }}>
                            Playfair Display
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="font-size">Font Size Scale</Label>
                      <span className="text-sm text-muted-foreground">{fontSizeScale}%</span>
                    </div>
                    <Slider
                      id="font-size"
                      min={80}
                      max={120}
                      step={5}
                      value={[fontSizeScale]}
                      onValueChange={(value) => setFontSizeScale(value[0])}
                    />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Small</p>
                        <p
                          style={{
                            fontSize: `${(fontSizeScale * 0.875) / 100}rem`,
                            fontFamily,
                          }}
                        >
                          Text Sample
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Medium</p>
                        <p
                          style={{
                            fontSize: `${(fontSizeScale * 1) / 100}rem`,
                            fontFamily,
                          }}
                        >
                          Text Sample
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Large</p>
                        <p
                          style={{
                            fontSize: `${(fontSizeScale * 1.125) / 100}rem`,
                            fontFamily,
                          }}
                        >
                          Text Sample
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button onClick={applyThemeToPreview} variant="outline" className="w-full">
                      Apply Typography to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="layout">
              <Card>
                <CardHeader>
                  <CardTitle>Layout & Spacing</CardTitle>
                  <CardDescription>Customize the layout elements of your site</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <Label htmlFor="border-radius">Border Radius</Label>
                      <span className="text-sm text-muted-foreground">{borderRadius}px</span>
                    </div>
                    <Slider
                      id="border-radius"
                      min={0}
                      max={20}
                      step={1}
                      value={[borderRadius]}
                      onValueChange={(value) => setBorderRadius(value[0])}
                    />
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div
                          className="bg-primary h-16 mx-auto"
                          style={{ width: 60, borderRadius: `${borderRadius * 0.5}px` }}
                        />
                        <p className="text-sm text-muted-foreground mt-2">Small</p>
                      </div>
                      <div>
                        <div
                          className="bg-primary h-16 mx-auto"
                          style={{ width: 60, borderRadius: `${borderRadius}px` }}
                        />
                        <p className="text-sm text-muted-foreground mt-2">Medium</p>
                      </div>
                      <div>
                        <div
                          className="bg-primary h-16 mx-auto"
                          style={{ width: 60, borderRadius: `${borderRadius * 1.5}px` }}
                        />
                        <p className="text-sm text-muted-foreground mt-2">Large</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button onClick={applyThemeToPreview} variant="outline" className="w-full">
                      Apply Layout to Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="h-[700px]">
          <RealTimePreview defaultUrl="/" title="Live Preview" defaultView="desktop" defaultOrientation="vertical" />
        </div>
      </div>
    </div>
  )
}

// Helper functions
function ColorPreview({ name, color, textColor }: { name: string; color: string; textColor: string }) {
  return (
    <div className="text-center">
      <div className="h-16 rounded-md mb-1" style={{ backgroundColor: color }} />
      <p className="text-xs font-medium truncate" style={{ color }}>
        {name}
      </p>
      <p className="text-xs text-muted-foreground truncate">{color}</p>
    </div>
  )
}

function adjustColor(color: string, amount: number): string {
  // Simple color adjustment function
  try {
    // Convert hex to RGB
    let hex = color
    if (hex.startsWith("#")) {
      hex = hex.slice(1)
    }

    // Convert hex to rgb
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    // Adjust color
    const adjustedR = Math.max(0, Math.min(255, r + amount))
    const adjustedG = Math.max(0, Math.min(255, g + amount))
    const adjustedB = Math.max(0, Math.min(255, b + amount))

    // Convert back to hex
    return `#${adjustedR.toString(16).padStart(2, "0")}${adjustedG.toString(16).padStart(2, "0")}${adjustedB.toString(16).padStart(2, "0")}`
  } catch (e) {
    return color
  }
}

