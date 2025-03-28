"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, Send, X, Minimize2, Maximize2, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Update the component to use dark mode styling
export function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your AI assistant for this portfolio. How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle sending a message
  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot response after a delay
    setTimeout(() => {
      const botResponses: Record<string, string> = {
        project:
          "I've worked on several projects including an Autonomous Drone Swarm, Quantum Optimization for Robotics, and Reinforcement Learning for Robotic Manipulation. You can find details about these in the Projects section.",
        skill:
          "My skills include Machine Learning, Robotics, Quantum Computing, Computer Vision, Drone Technology, and more. Each skill is detailed with proficiency levels in the Skills section.",
        background:
          "I have a background in Robotics Engineering and Artificial Intelligence. I completed my Bachelor's at MIT and Master's at Stanford, focusing on autonomous systems and reinforcement learning.",
        contact:
          "You can contact me through the contact form on my website, or directly via email. I'm also available on LinkedIn, GitHub, and Twitter.",
        hello:
          "Hello! I'm the portfolio assistant. I can tell you about projects, skills, background, or how to get in touch.",
        hi: "Hi there! How can I help you today? I can provide information about projects, skills, background, or contact details.",
      }

      // Find a matching response or use default
      const lowerInput = input.toLowerCase()
      let responseContent =
        "I'm not sure how to answer that. Feel free to ask about projects, skills, background, or contact information."

      for (const [key, response] of Object.entries(botResponses)) {
        if (lowerInput.includes(key)) {
          responseContent = response
          break
        }
      }

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responseContent,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])
      setIsTyping(false)
    }, 1500)
  }

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Toggle chat widget
  const toggleChat = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setIsMinimized(false)
    }
  }

  // Toggle minimize
  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button onClick={toggleChat} className="h-12 w-12 rounded-full shadow-lg bg-gray-800 hover:bg-gray-700">
          <MessageSquare className="h-6 w-6 text-white" />
        </Button>
      ) : (
        <Card
          className={`w-80 sm:w-96 shadow-lg transition-all duration-300 ${isMinimized ? "h-16" : "h-[500px]"} dark bg-gray-900 border-gray-800 text-gray-100`}
        >
          <CardHeader className="p-3 flex flex-row items-center justify-between space-y-0 border-b border-gray-800">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8 bg-gray-800">
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback className="bg-gray-700">
                  <Bot className="h-4 w-4 text-gray-300" />
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm text-gray-100">Portfolio Assistant</h3>
                <Badge variant="outline" className="text-xs text-gray-300 border-gray-700">
                  Online
                </Badge>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={toggleMinimize}
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-gray-300 hover:text-white hover:bg-gray-800"
                onClick={toggleChat}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          {!isMinimized && (
            <>
              <CardContent className="p-3 overflow-y-auto h-[calc(100%-110px)] bg-gray-900">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-gray-800 text-gray-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1 text-right text-gray-400">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}

                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="max-w-[80%] rounded-lg p-3 bg-gray-800">
                        <div className="flex space-x-1">
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "0ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "150ms" }}
                          ></div>
                          <div
                            className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"
                            style={{ animationDelay: "300ms" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </CardContent>

              <CardFooter className="p-3 border-t border-gray-800 bg-gray-900">
                <div className="flex w-full items-center space-x-2">
                  <Input
                    placeholder="Type your message..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="flex-1 bg-gray-800 border-gray-700 text-gray-100 placeholder:text-gray-500 focus:border-primary"
                  />
                  <Button
                    size="icon"
                    onClick={handleSendMessage}
                    disabled={!input.trim() || isTyping}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </>
          )}
        </Card>
      )}
    </div>
  )
}

