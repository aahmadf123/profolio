"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, Mail, MapPin, Phone, ExternalLink, Calendar, CheckCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/components/ui/use-toast"
import { EditableText } from "@/components/editable-text"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const { toast } = useToast()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setIsSuccess(false)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Show success message
    toast({
      title: "Message sent!",
      description: "Thank you for your message. I'll get back to you soon.",
    })

    // Show success animation
    setIsSuccess(true)

    // Reset form after a delay
    setTimeout(() => {
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      })
      setIsSubmitting(false)

      // Reset success state after animation completes
      setTimeout(() => {
        setIsSuccess(false)
      }, 2000)
    }, 1000)
  }

  return (
    <section id="contact" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold mb-4">Get In Touch</h2>
          <EditableText
            id="contact-description"
            defaultValue="Have a question or want to work together? Feel free to reach out using the form below or through my contact information."
            className="text-muted-foreground max-w-3xl mx-auto"
          />
        </motion.div>

        <Tabs defaultValue="contact" className="max-w-5xl mx-auto">
          <TabsList className="w-full grid grid-cols-2 mb-8">
            <TabsTrigger value="contact" className="text-sm sm:text-base">
              <Mail className="h-4 w-4 mr-2" />
              Contact Form
            </TabsTrigger>
            <TabsTrigger value="schedule" className="text-sm sm:text-base">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule a Meeting
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
              >
                <Card className="dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)] overflow-hidden">
                  <CardContent className="p-6">
                    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="name" className="text-sm font-medium">
                            Name
                          </label>
                          <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Your name"
                            disabled={isSubmitting}
                            className="transition-all focus:border-primary"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="email" className="text-sm font-medium">
                            Email
                          </label>
                          <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Your email"
                            disabled={isSubmitting}
                            className="transition-all focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="subject" className="text-sm font-medium">
                          Subject
                        </label>
                        <Input
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          placeholder="Subject of your message"
                          disabled={isSubmitting}
                          className="transition-all focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="message" className="text-sm font-medium">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          required
                          placeholder="Your message"
                          rows={5}
                          disabled={isSubmitting}
                          className="transition-all focus:border-primary"
                        />
                      </div>
                      <AnimatePresence mode="wait">
                        {isSuccess ? (
                          <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="flex items-center justify-center p-2 bg-green-500/10 text-green-500 rounded-md"
                          >
                            <CheckCircle className="h-5 w-5 mr-2" />
                            Message sent successfully!
                          </motion.div>
                        ) : (
                          <motion.div
                            key="button"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                          >
                            <Button
                              type="submit"
                              className="w-full relative overflow-hidden group"
                              disabled={isSubmitting}
                            >
                              <span className="relative z-10 flex items-center justify-center">
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                  </>
                                ) : (
                                  <>
                                    <Send className="mr-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                                    Send Message
                                  </>
                                )}
                              </span>
                              <span className="absolute inset-0 bg-gradient-to-r from-primary to-[#3BB2F1] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                            </Button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </form>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Contact Information */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Card className="dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)] transform transition-all duration-300 hover:translate-y-[-5px]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Contact Information</h3>
                    <div className="space-y-4">
                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="p-2 rounded-full bg-primary/10 mr-4">
                          <Mail className="h-5 w-5 text-primary dark:text-[#3BB2F1]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Email</h4>
                          <EditableText
                            id="contact-email"
                            defaultValue="your.email@example.com"
                            className="text-muted-foreground hover:text-primary dark:hover:text-[#3BB2F1] transition-colors"
                          />
                        </div>
                      </motion.div>
                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="p-2 rounded-full bg-primary/10 mr-4">
                          <MapPin className="h-5 w-5 text-primary dark:text-[#3BB2F1]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Location</h4>
                          <EditableText
                            id="contact-location"
                            defaultValue="San Francisco, California, USA"
                            className="text-muted-foreground"
                          />
                        </div>
                      </motion.div>
                      <motion.div
                        className="flex items-start"
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <div className="p-2 rounded-full bg-primary/10 mr-4">
                          <Phone className="h-5 w-5 text-primary dark:text-[#3BB2F1]" />
                        </div>
                        <div>
                          <h4 className="font-medium">Phone</h4>
                          <EditableText
                            id="contact-phone"
                            defaultValue="+1 (123) 456-7890"
                            className="text-muted-foreground hover:text-primary dark:hover:text-[#3BB2F1] transition-colors"
                          />
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)] transform transition-all duration-300 hover:translate-y-[-5px]">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold mb-4">Connect Online</h3>
                    <EditableText
                      id="connect-online-description"
                      defaultValue="Follow me on social media or check out my profiles on these platforms:"
                      className="text-muted-foreground mb-4"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <motion.a
                        href="https://github.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-muted rounded-md hover:bg-primary/10 transition-colors"
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        <EditableText id="social-github" defaultValue="GitHub" className="" />
                      </motion.a>
                      <motion.a
                        href="https://linkedin.com/in/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-muted rounded-md hover:bg-primary/10 transition-colors"
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                        </svg>
                        <EditableText id="social-linkedin" defaultValue="LinkedIn" className="" />
                      </motion.a>
                      <motion.a
                        href="https://twitter.com/yourusername"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-muted rounded-md hover:bg-primary/10 transition-colors"
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                        </svg>
                        <EditableText id="social-twitter" defaultValue="Twitter" className="" />
                      </motion.a>
                      <motion.a
                        href="https://scholar.google.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center p-3 bg-muted rounded-md hover:bg-primary/10 transition-colors"
                        whileHover={{ scale: 1.03, x: 5 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        <ExternalLink className="h-5 w-5 mr-3" />
                        <EditableText id="social-scholar" defaultValue="Google Scholar" className="" />
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="schedule">
            <Card className="dark:bg-gradient-to-b dark:from-background dark:to-background/80 dark:hover:shadow-[0_10px_20px_-10px_rgba(59,178,241,0.3)]">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold mb-2">Schedule a Meeting</h3>
                  <p className="text-muted-foreground">
                    Choose a convenient time for us to discuss your project or collaboration opportunities.
                  </p>
                </div>

                <div className="aspect-video w-full rounded-md overflow-hidden border">
                  {/* Calendly integration */}
                  <iframe
                    src="https://calendly.com/yourusername/30min"
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    title="Schedule a meeting"
                  ></iframe>
                </div>

                <div className="mt-6 text-sm text-muted-foreground text-center">
                  <p>
                    Can't find a suitable time? Feel free to email me directly at{" "}
                    <a href="mailto:your.email@example.com" className="text-primary hover:underline">
                      your.email@example.com
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

