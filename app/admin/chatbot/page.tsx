"use client"

import { Suspense, useState, useEffect } from "react"
import {
  MessageSquare,
  Plus,
  Trash2,
  Save,
  RefreshCw,
  Upload,
  Download,
  Database,
  Brain,
  Settings,
  Code,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/components/ui/use-toast"

function ChatbotContent() {
  const [isTraining, setIsTraining] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [chatbotEnabled, setChatbotEnabled] = useState(true)
  const [selectedModel, setSelectedModel] = useState("gpt-4")
  const [webhookUrl, setWebhookUrl] = useState("")
  const [settings, setSettings] = useState({
    name: "Portfolio Assistant",
    welcomeMessage: "Hello! I'm your AI assistant for this portfolio. How can I help you today?",
    fallbackMessage:
      "I'm sorry, I don't have information about that. Please ask me about projects, skills, or background instead.",
    maxResponseLength: 300,
    responseTemperature: 0.7,
    enableCitations: true,
    enableFollowupQuestions: true,
  })
  const [systemPrompt, setSystemPrompt] = useState(
    `You are an AI assistant for a personal portfolio website. Your name is ${settings.name}. You should answer questions about the portfolio owner's projects, skills, experience, and background based on the training data provided. Be helpful, concise, and friendly. If you don't know the answer to a question, respond with: "${settings.fallbackMessage}"`,
  )
  const { toast } = useToast()

  // Sample training data
  const [trainingData, setTrainingData] = useState([
    {
      id: "1",
      question: "What projects have you worked on?",
      answer:
        "I've worked on several projects including an Autonomous Drone Swarm, Quantum Optimization for Robotics, and Reinforcement Learning for Robotic Manipulation. You can find details about these projects in the Projects section of my portfolio.",
    },
    {
      id: "2",
      question: "What are your skills?",
      answer:
        "My skills include Machine Learning, Robotics, Quantum Computing, Computer Vision, Drone Technology, Reinforcement Learning, MLOps, and Space Technologies. Each of these skills is detailed in the Skills section with proficiency levels and related tools.",
    },
    {
      id: "3",
      question: "Tell me about your background",
      answer:
        "I have a background in Robotics Engineering and Artificial Intelligence. I completed my Bachelor's at MIT and Master's at Stanford, focusing on autonomous systems and reinforcement learning. I've worked at companies like Boston Dynamics and currently work as an AI Research Scientist at Quantum AI Labs.",
    },
    {
      id: "4",
      question: "How can I contact you?",
      answer:
        "You can contact me through the contact form on my website, or directly via email at your.email@example.com. I'm also available on LinkedIn, GitHub, and Twitter - links to these platforms are in the footer of my website.",
    },
  ])

  // Sample chatbot settings

  // Sample conversation logs
  const conversationLogs = [
    {
      id: "conv1",
      date: "2023-11-15T14:30:00",
      userQuestion: "What kind of projects have you worked on?",
      botResponse:
        "I've worked on several projects including an Autonomous Drone Swarm, Quantum Optimization for Robotics, and Reinforcement Learning for Robotic Manipulation.",
      duration: "2.3s",
    },
    {
      id: "conv2",
      date: "2023-11-15T10:15:00",
      userQuestion: "Do you have experience with machine learning?",
      botResponse:
        "Yes, I have extensive experience with Machine Learning, particularly in the areas of reinforcement learning, computer vision, and quantum machine learning applications.",
      duration: "1.8s",
    },
    {
      id: "conv3",
      date: "2023-11-14T16:45:00",
      userQuestion: "What's your educational background?",
      botResponse:
        "I completed my Bachelor's in Robotics Engineering at MIT and my Master's in Artificial Intelligence at Stanford University.",
      duration: "1.5s",
    },
  ]

  // Handle adding new training data
  const [newQuestion, setNewQuestion] = useState("")
  const [newAnswer, setNewAnswer] = useState("")

  const addTrainingData = () => {
    if (!newQuestion.trim() || !newAnswer.trim()) {
      toast({
        title: "Error",
        description: "Both question and answer are required.",
        variant: "destructive",
      })
      return
    }

    const newData = {
      id: Date.now().toString(),
      question: newQuestion,
      answer: newAnswer,
    }

    setTrainingData([...trainingData, newData])
    setNewQuestion("")
    setNewAnswer("")

    toast({
      title: "Success",
      description: "New training data added successfully.",
    })
  }

  // Handle deleting training data
  const deleteTrainingData = (id: string) => {
    setTrainingData(trainingData.filter((item) => item.id !== id))

    toast({
      title: "Success",
      description: "Training data deleted successfully.",
    })
  }

  // Handle saving settings
  const saveSettings = async () => {
    setIsSaving(true)

    try {
      const response = await fetch("/api/chatbot/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(settings),
      })

      if (!response.ok) {
        throw new Error("Failed to save settings")
      }

      toast({
        title: "Settings Saved",
        description: "Your chatbot settings have been updated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle training the model
  const trainModel = async () => {
    setIsTraining(true)

    try {
      const response = await fetch("/api/chatbot/train", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ trainingData }),
      })

      if (!response.ok) {
        throw new Error("Failed to train model")
      }

      toast({
        title: "Training Complete",
        description: "Your chatbot has been trained with the latest data.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsTraining(false)
    }
  }

  useEffect(() => {
    setSystemPrompt(
      `You are an AI assistant for a personal portfolio website. Your name is ${settings.name}. You should answer questions about the portfolio owner's projects, skills, experience, and background based on the training data provided. Be helpful, concise, and friendly. If you don't know the answer to a question, respond with: "${settings.fallbackMessage}"`,
    )
  }, [settings.name, settings.fallbackMessage])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Chatbot Management</h1>
          <p className="text-muted-foreground">Configure and train your portfolio AI assistant</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch checked={chatbotEnabled} onCheckedChange={setChatbotEnabled} id="chatbot-status" />
            <Label htmlFor="chatbot-status" className="text-sm font-medium">
              {chatbotEnabled ? "Enabled" : "Disabled"}
            </Label>
          </div>

          <Button onClick={trainModel} disabled={isTraining}>
            {isTraining ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Training...
              </>
            ) : (
              <>
                <Brain className="mr-2 h-4 w-4" />
                Train Model
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="training">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="training" className="flex items-center gap-1">
            <Database className="h-4 w-4" />
            Training Data
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1">
            <Settings className="h-4 w-4" />
            Settings
          </TabsTrigger>
          <TabsTrigger value="logs" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            Conversation Logs
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex items-center gap-1">
            <Code className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        <TabsContent value="training" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Training Data</CardTitle>
              <CardDescription>Add question-answer pairs to train your chatbot about your portfolio</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="question">Question</Label>
                  <Input
                    id="question"
                    placeholder="Enter a potential user question"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="answer">Answer</Label>
                  <Textarea
                    id="answer"
                    placeholder="Enter the answer to the question"
                    className="min-h-[100px]"
                    value={newAnswer}
                    onChange={(e) => setNewAnswer(e.target.value)}
                  />
                </div>
                <Button onClick={addTrainingData} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Training Data
                </Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Existing Training Data</h3>
                  <Badge variant="secondary">{trainingData.length} Items</Badge>
                </div>

                {trainingData.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="absolute top-3 right-3">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteTrainingData(item.id)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="space-y-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            Question
                          </Badge>
                          <p className="text-sm">{item.question}</p>
                        </div>
                        <div>
                          <Badge variant="outline" className="mb-2">
                            Answer
                          </Badge>
                          <p className="text-sm text-muted-foreground">{item.answer}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Upload className="mr-2 h-4 w-4" />
                  Import
                </Button>
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
              </div>
              <Button onClick={trainModel} disabled={isTraining}>
                {isTraining ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Training...
                  </>
                ) : (
                  <>
                    <Brain className="mr-2 h-4 w-4" />
                    Train Model
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Chatbot Settings</CardTitle>
              <CardDescription>Configure how your chatbot behaves and responds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="bot-name">Chatbot Name</Label>
                  <Input
                    id="bot-name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="welcome-message">Welcome Message</Label>
                  <Textarea
                    id="welcome-message"
                    value={settings.welcomeMessage}
                    onChange={(e) => setSettings({ ...settings, welcomeMessage: e.target.value })}
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="fallback-message">Fallback Message</Label>
                  <Textarea
                    id="fallback-message"
                    value={settings.fallbackMessage}
                    onChange={(e) => setSettings({ ...settings, fallbackMessage: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="max-length">Maximum Response Length</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="max-length"
                        type="number"
                        value={settings.maxResponseLength}
                        onChange={(e) =>
                          setSettings({ ...settings, maxResponseLength: Number.parseInt(e.target.value) })
                        }
                      />
                      <span className="text-sm text-muted-foreground">characters</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Response Temperature</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="temperature"
                        type="number"
                        min="0"
                        max="1"
                        step="0.1"
                        value={settings.responseTemperature}
                        onChange={(e) =>
                          setSettings({ ...settings, responseTemperature: Number.parseFloat(e.target.value) })
                        }
                      />
                      <span className="text-sm text-muted-foreground">(0-1)</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Higher values make responses more creative, lower values make them more deterministic.
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Advanced Features</h3>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="citations">Enable Citations</Label>
                      <p className="text-xs text-muted-foreground">
                        Allow the chatbot to cite sources for its responses
                      </p>
                    </div>
                    <Switch
                      id="citations"
                      checked={settings.enableCitations}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableCitations: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="followup">Suggest Follow-up Questions</Label>
                      <p className="text-xs text-muted-foreground">Chatbot will suggest relevant follow-up questions</p>
                    </div>
                    <Switch
                      id="followup"
                      checked={settings.enableFollowupQuestions}
                      onCheckedChange={(checked) => setSettings({ ...settings, enableFollowupQuestions: checked })}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={saveSettings} disabled={isSaving} className="ml-auto">
                {isSaving ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Settings
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="logs" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Conversation Logs</CardTitle>
              <CardDescription>Review recent conversations with your chatbot</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {conversationLogs.map((log) => (
                  <Card key={log.id} className="bg-muted/40">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center">
                          <Badge variant="outline" className="mr-2">
                            {new Date(log.date).toLocaleString()}
                          </Badge>
                          <Badge variant="secondary">{log.duration}</Badge>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <div className="bg-background p-3 rounded-md">
                          <div className="flex items-center mb-1">
                            <Badge className="bg-primary text-primary-foreground">User</Badge>
                          </div>
                          <p className="text-sm">{log.userQuestion}</p>
                        </div>

                        <div className="bg-background p-3 rounded-md">
                          <div className="flex items-center mb-1">
                            <Badge className="bg-secondary text-secondary-foreground">Bot</Badge>
                          </div>
                          <p className="text-sm">{log.botResponse}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full">
                Load More Logs
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Configuration</CardTitle>
              <CardDescription>Technical settings for developers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex">
                    <Input
                      id="api-key"
                      type="password"
                      defaultValue="sk-••••••••••••••••••••••••••••••"
                      readOnly
                      className="rounded-r-none"
                    />
                    <Button variant="secondary" className="rounded-l-none">
                      Reveal
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">Your API key for the AI service</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="model">AI Model</Label>
                  <select
                    id="model"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={selectedModel}
                    onChange={(e) => setSelectedModel(e.target.value)}
                  >
                    <option value="gpt-4">GPT-4 (Recommended)</option>
                    <option value="gpt-3.5-turbo">GPT-3.5 Turbo</option>
                    <option value="claude-2">Claude 2</option>
                  </select>
                  <p className="text-xs text-muted-foreground">Select the AI model to power your chatbot</p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="system-prompt">System Prompt</Label>
                  <Textarea
                    id="system-prompt"
                    className="min-h-[150px] font-mono text-xs"
                    value={systemPrompt}
                    onChange={(e) => setSystemPrompt(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">
                    The system prompt that defines your chatbot's behavior
                  </p>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="webhook">Webhook URL (Optional)</Label>
                  <Input
                    id="webhook"
                    placeholder="https://your-service.com/webhook"
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Receive notifications for new conversations</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline">Reset to Defaults</Button>
              <Button>
                <Save className="mr-2 h-4 w-4" />
                Save Configuration
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default function ChatbotPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ChatbotContent />
    </Suspense>
  )
}
