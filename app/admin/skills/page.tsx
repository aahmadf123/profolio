"use client"

import { Suspense, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  ArrowUpDown,
  Brain,
  Cpu,
  Atom,
  Eye,
  Plane,
  Zap,
  GitBranch,
  Rocket,
} from "lucide-react"

function SkillsPageContent() {
  const [searchQuery, setSearchQuery] = useState("")

  // Sample skills data
  const skills = [
    {
      id: "skill-1",
      name: "Machine Learning",
      category: "Artificial Intelligence",
      proficiency: 90,
      icon: "Brain",
      tools: ["TensorFlow", "PyTorch", "Scikit-learn", "Keras"],
    },
    {
      id: "skill-2",
      name: "Robotics",
      category: "Robotics",
      proficiency: 85,
      icon: "Cpu",
      tools: ["ROS", "Gazebo", "MATLAB", "Arduino"],
    },
    {
      id: "skill-3",
      name: "Quantum Computing",
      category: "Quantum Optimization",
      proficiency: 80,
      icon: "Atom",
      tools: ["Qiskit", "D-Wave Ocean", "Cirq", "Pennylane"],
    },
    {
      id: "skill-4",
      name: "Computer Vision",
      category: "Artificial Intelligence",
      proficiency: 85,
      icon: "Eye",
      tools: ["OpenCV", "YOLO", "MediaPipe", "TensorFlow Vision"],
    },
    {
      id: "skill-5",
      name: "Drone Technology",
      category: "Aviation",
      proficiency: 90,
      icon: "Plane",
      tools: ["PX4", "ArduPilot", "DJI SDK", "Mission Planner"],
    },
    {
      id: "skill-6",
      name: "Reinforcement Learning",
      category: "Artificial Intelligence",
      proficiency: 80,
      icon: "Zap",
      tools: ["OpenAI Gym", "Stable Baselines", "RLlib", "TensorFlow Agents"],
    },
    {
      id: "skill-7",
      name: "MLOps",
      category: "MLOps",
      proficiency: 75,
      icon: "GitBranch",
      tools: ["Docker", "Kubernetes", "MLflow", "Kubeflow"],
    },
    {
      id: "skill-8",
      name: "Space Technologies",
      category: "Space Technologies",
      proficiency: 70,
      icon: "Rocket",
      tools: ["GMAT", "STK", "NASA SPICE", "Orekit"],
    },
  ]

  // Filter skills based on search query
  const filteredSkills = skills.filter(
    (skill) =>
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      skill.tools.some((tool) => tool.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  // Get icon component based on icon name
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case "Brain":
        return <Brain className="h-5 w-5" />
      case "Cpu":
        return <Cpu className="h-5 w-5" />
      case "Atom":
        return <Atom className="h-5 w-5" />
      case "Eye":
        return <Eye className="h-5 w-5" />
      case "Plane":
        return <Plane className="h-5 w-5" />
      case "Zap":
        return <Zap className="h-5 w-5" />
      case "GitBranch":
        return <GitBranch className="h-5 w-5" />
      case "Rocket":
        return <Rocket className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Skills</h1>
          <p className="text-muted-foreground">Manage your skills and technologies</p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Skill
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>All Skills</CardTitle>
          <CardDescription>You have {skills.length} skills in total</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search skills or tools..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowUpDown className="h-4 w-4" />
              Sort
            </Button>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Skill</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Proficiency</TableHead>
                  <TableHead>Tools</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredSkills.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                      No skills found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredSkills.map((skill) => (
                    <TableRow key={skill.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-full bg-primary/10">{getIconComponent(skill.icon)}</div>
                          <span className="font-medium">{skill.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{skill.category}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${skill.proficiency}%` }}
                            />
                          </div>
                          <span className="text-sm">{skill.proficiency}%</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {skill.tools.map((tool) => (
                            <Badge key={tool} variant="secondary" className="text-xs">
                              {tool}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">Actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Create a wrapper component that uses Suspense
function SkillsWrapper() {
  return (
    <Suspense fallback={<div>Loading skills...</div>}>
      <SkillsPageContent />
    </Suspense>
  )
}

export default function SkillsPage() {
  return <SkillsWrapper />
}

