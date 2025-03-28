"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Award, X, Trophy, Star, CheckCircle, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useAchievements } from "@/lib/use-achievements"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function AchievementsOverlay() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<"unlocked" | "locked">("unlocked")
  const { achievements, unlockedAchievements, achievementProgress } = useAchievements()
  const [showButton, setShowButton] = useState(false)

  // Show the button after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 3000)

    return () => clearTimeout(timer)
  }, [])

  // Get locked achievements
  const lockedAchievements = achievements.filter((a) => !a.unlocked)

  return (
    <>
      {/* Achievements Button */}
      <AnimatePresence>
        {showButton && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed bottom-20 right-4 z-40"
          >
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => setIsOpen(true)}
                    size="icon"
                    className="h-12 w-12 rounded-full shadow-lg bg-primary hover:bg-primary/90 relative"
                  >
                    <Trophy className="h-6 w-6 text-white" />
                    {unlockedAchievements.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-secondary text-secondary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unlockedAchievements.length}
                      </span>
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left">
                  <p>View your achievements</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Achievements Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-2xl bg-card rounded-lg shadow-lg overflow-hidden border"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h2 className="text-xl font-bold">Achievements</h2>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="p-4">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-5 w-5 text-primary" />
                      <span className="font-medium">Your Progress</span>
                    </div>
                    <Badge variant="outline">
                      {unlockedAchievements.length} / {achievements.length}
                    </Badge>
                  </div>
                  <Progress value={achievementProgress.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1">{achievementProgress.percentage}% complete</p>
                </div>

                <div className="flex space-x-1 mb-4">
                  <Button
                    variant={activeTab === "unlocked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("unlocked")}
                    className="flex-1"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Unlocked ({unlockedAchievements.length})
                  </Button>
                  <Button
                    variant={activeTab === "locked" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("locked")}
                    className="flex-1"
                  >
                    <Info className="h-4 w-4 mr-2" />
                    Available ({lockedAchievements.length})
                  </Button>
                </div>

                <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3">
                  <AnimatePresence mode="wait">
                    {activeTab === "unlocked" ? (
                      <motion.div
                        key="unlocked"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {unlockedAchievements.length > 0 ? (
                          unlockedAchievements.map((achievement) => (
                            <AchievementCard key={achievement.id} achievement={achievement} unlocked={true} />
                          ))
                        ) : (
                          <div className="text-center py-8 text-muted-foreground">
                            <Trophy className="h-12 w-12 mx-auto mb-2 opacity-20" />
                            <p>No achievements unlocked yet.</p>
                            <p className="text-sm">Explore the site to earn achievements!</p>
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        key="locked"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                      >
                        {lockedAchievements.map((achievement) => (
                          <AchievementCard key={achievement.id} achievement={achievement} unlocked={false} />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

interface AchievementCardProps {
  achievement: {
    id: string
    title: string
    description: string
    icon?: string
    unlocked: boolean
    unlockedAt?: string
  }
  unlocked: boolean
}

function AchievementCard({ achievement, unlocked }: AchievementCardProps) {
  return (
    <Card className={`transition-all ${unlocked ? "bg-primary/5 border-primary/20" : "bg-muted/30"}`}>
      <CardContent className="p-3 flex items-center gap-3">
        <div className={`p-2 rounded-full ${unlocked ? "bg-primary/20" : "bg-muted"}`}>
          {achievement.icon ? (
            <span className="text-xl">{achievement.icon}</span>
          ) : (
            <Award className={`h-5 w-5 ${unlocked ? "text-primary" : "text-muted-foreground"}`} />
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{achievement.title}</h3>
            {unlocked && (
              <Badge variant="secondary" className="text-xs">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Unlocked
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">{achievement.description}</p>
          {unlocked && achievement.unlockedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Unlocked on {new Date(achievement.unlockedAt).toLocaleDateString()}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

