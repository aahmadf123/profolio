"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  AlertCircle,
  Info,
  CheckCircle,
  Clock,
  Search,
  Download,
  Trash2,
  RefreshCw,
  Filter,
  AlertTriangle,
} from "lucide-react"
import { fetchLogs, logActivity, type LogLevel } from "@/lib/logging-service"
import { useSafeSupabase } from "@/lib/safe-supabase"

interface LogEntry {
  id: string
  timestamp: Date
  level: LogLevel
  message: string
  source: string
  user?: string
  details?: string
}

export default function LogsContent() {
  // Get user email directly from localStorage instead of context
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Check Supabase status
  const { isReady: isSupabaseReady, error: supabaseError } = useSafeSupabase()

  const [logs, setLogs] = useState<LogEntry[]>([])
  const [filteredLogs, setFilteredLogs] = useState<LogEntry[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [levelFilter, setLevelFilter] = useState<string>("all")
  const [sourceFilter, setSourceFilter] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)
  const [timeRange, setTimeRange] = useState<string>("7d")
  const [uniqueSources, setUniqueSources] = useState<string[]>([])

  // Initialize client-side state
  useEffect(() => {
    setIsMounted(true)
    if (typeof window !== "undefined") {
      const email = localStorage.getItem("userEmail")
      setUserEmail(email)
    }
  }, [])

  // Load logs on component mount and when filters change
  useEffect(() => {
    // Don't run if not mounted yet or if Supabase is not ready
    if (!isMounted || !isSupabaseReady) return

    const loadLogs = async () => {
      setIsLoading(true)
      setLoadError(null)

      try {
        // Log that admin is viewing logs
        await logActivity("info", "Admin viewed logs", "admin", userEmail || undefined)

        // Fetch logs with filters
        const data = await fetchLogs({
          level: levelFilter !== "all" ? (levelFilter as LogLevel) : undefined,
          source: sourceFilter !== "all" ? sourceFilter : undefined,
          timeRange: timeRange !== "all" ? timeRange : undefined,
          searchTerm: searchQuery || undefined,
        })

        // Check if data is an array
        if (!Array.isArray(data)) {
          console.error("Unexpected data format:", data)
          setLoadError("Received invalid data format from the server")
          setLogs([])
          setFilteredLogs([])
          return
        }

        // Extract unique sources for filter dropdown
        const sources = Array.from(new Set(data.map((log) => log.source)))
        setUniqueSources(sources)

        setLogs(data)
        setFilteredLogs(data)
      } catch (error) {
        console.error("Error loading logs:", error)
        setLoadError("Failed to load logs. Please try again.")
        setLogs([])
        setFilteredLogs([])
      } finally {
        setIsLoading(false)
      }
    }

    // Only run on the client side
    if (typeof window !== "undefined") {
      loadLogs()
    }
  }, [isMounted, isSupabaseReady, userEmail, levelFilter, sourceFilter, timeRange, searchQuery])

  // Don't render anything during SSR
  if (!isMounted) {
    return <div className="p-6">Loading logs...</div>
  }

  // Show error if Supabase is not ready
  if (!isSupabaseReady) {
    return (
      <div className="p-6">
        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
              <div>
                <h3 className="text-lg font-semibold text-amber-800">Supabase Connection Error</h3>
                <p className="text-amber-700">{supabaseError || "Could not connect to Supabase"}</p>
                <p className="text-amber-600 mt-2 text-sm">
                  Please check your environment variables and make sure Supabase is properly configured.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Handle log selection for details view
  const handleLogSelect = (log: LogEntry) => {
    setSelectedLog(log === selectedLog ? null : log)
  }

  // Handle refresh
  const handleRefresh = () => {
    // Reset filters and reload
    setSearchQuery("")
    setLevelFilter("all")
    setSourceFilter("all")
    setTimeRange("7d")
  }

  // Handle clear logs
  const handleClearLogs = async () => {
    if (confirm("Are you sure you want to clear all logs? This action cannot be undone.")) {
      setIsLoading(true)

      try {
        // In a real app, you would call an API to delete logs
        const response = await fetch("/api/logs/clear", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "x-user-email": userEmail || "",
          },
        })

        if (!response.ok) {
          throw new Error("Failed to clear logs")
        }

        setLogs([])
        setFilteredLogs([])
        setSelectedLog(null)
      } catch (error) {
        console.error("Error clearing logs:", error)
        alert("Failed to clear logs. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }
  }

  // Handle export logs
  const handleExportLogs = () => {
    const exportData = filteredLogs.map((log) => ({
      timestamp: formatDate(log.timestamp),
      level: log.level,
      source: log.source,
      message: log.message,
      user: log.user || "N/A",
      details: log.details || "N/A",
    }))

    const jsonString = JSON.stringify(exportData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = `logs-export-${new Date().toISOString().slice(0, 10)}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    // Log the export action
    logActivity("info", "Admin exported logs", "admin", userEmail || undefined)
  }

  // Format date for display - with null check to prevent prerender errors
  const formatDate = (date: Date | undefined) => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "Invalid date"
    }

    try {
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    } catch (error) {
      console.error("Date formatting error:", error)
      return "Error formatting date"
    }
  }

  // Render log level badge
  const renderLevelBadge = (level: LogLevel) => {
    switch (level) {
      case "info":
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Info className="h-3 w-3 mr-1" /> Info
          </Badge>
        )
      case "warning":
        return (
          <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Warning
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <AlertCircle className="h-3 w-3 mr-1" /> Error
          </Badge>
        )
      case "success":
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" /> Success
          </Badge>
        )
    }
  }

  // Show error if logs failed to load
  if (loadError) {
    return (
      <div className="p-6">
        <Card className="bg-red-50 border-red-200">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error Loading Logs</h3>
                <p className="text-red-700">{loadError}</p>
                <Button
                  variant="outline"
                  className="mt-4 bg-white hover:bg-red-50 border-red-300 text-red-700"
                  onClick={handleRefresh}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">System Logs</h1>

      <div className="bg-card rounded-lg shadow p-4">
        <div className="space-y-6 animate-in fade-in duration-500">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">System Logs</h1>
              <p className="text-muted-foreground">View and manage system activity logs</p>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportLogs} disabled={filteredLogs.length === 0}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="text-red-500 hover:text-red-700"
                onClick={handleClearLogs}
                disabled={logs.length === 0}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear
              </Button>
            </div>
          </div>

          <Tabs defaultValue="all-logs" className="space-y-4">
            <TabsList>
              <TabsTrigger value="all-logs">All Logs</TabsTrigger>
              <TabsTrigger value="error-logs">Errors</TabsTrigger>
              <TabsTrigger value="system-logs">System</TabsTrigger>
              <TabsTrigger value="user-logs">User Activity</TabsTrigger>
            </TabsList>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="flex gap-2">
                <Select value={levelFilter} onValueChange={setLevelFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    <SelectItem value="info">Info</SelectItem>
                    <SelectItem value="warning">Warning</SelectItem>
                    <SelectItem value="error">Error</SelectItem>
                    <SelectItem value="success">Success</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sourceFilter} onValueChange={setSourceFilter}>
                  <SelectTrigger className="w-[130px]">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Sources</SelectItem>
                    {uniqueSources.map((source) => (
                      <SelectItem key={source} value={source}>
                        {source}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-[130px]">
                    <Clock className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Time Range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="24h">Last 24 Hours</SelectItem>
                    <SelectItem value="7d">Last 7 Days</SelectItem>
                    <SelectItem value="30d">Last 30 Days</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <TabsContent value="all-logs" className="space-y-4">
              <Card>
                <CardContent className="p-0">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="flex flex-col items-center">
                        <RefreshCw className="h-8 w-8 animate-spin text-primary mb-2" />
                        <p>Loading logs...</p>
                      </div>
                    </div>
                  ) : filteredLogs.length === 0 ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="flex flex-col items-center">
                        <Info className="h-8 w-8 text-muted-foreground mb-2" />
                        <p>No logs found</p>
                        <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-md border">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[180px]">Timestamp</TableHead>
                            <TableHead className="w-[100px]">Level</TableHead>
                            <TableHead className="w-[100px]">Source</TableHead>
                            <TableHead>Message</TableHead>
                            <TableHead className="w-[150px]">User</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredLogs.map((log) => (
                            <TableRow
                              key={log.id}
                              className={`cursor-pointer transition-colors ${selectedLog?.id === log.id ? "bg-muted" : ""}`}
                              onClick={() => handleLogSelect(log)}
                            >
                              <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                              <TableCell>{renderLevelBadge(log.level)}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{log.source}</Badge>
                              </TableCell>
                              <TableCell>{log.message}</TableCell>
                              <TableCell>{log.user || "-"}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>

              {selectedLog && (
                <Card className="animate-in fade-in slide-in-from-top-4 duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">Log Details</CardTitle>
                    <CardDescription>{formatDate(selectedLog.timestamp)}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Level</p>
                        <p>{renderLevelBadge(selectedLog.level)}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Source</p>
                        <p>
                          <Badge variant="outline">{selectedLog.source}</Badge>
                        </p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">User</p>
                        <p>{selectedLog.user || "N/A"}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ID</p>
                        <p className="font-mono text-xs">{selectedLog.id}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Message</p>
                      <p>{selectedLog.message}</p>
                    </div>

                    {selectedLog.details && (
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">Details</p>
                        <pre className="mt-1 rounded-md bg-muted p-4 overflow-x-auto text-sm">
                          {selectedLog.details}
                        </pre>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="error-logs">
              <Card>
                <CardHeader>
                  <CardTitle>Error Logs</CardTitle>
                  <CardDescription>Critical issues that require attention</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-[100px]">Source</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs
                        .filter((log) => log.level === "error")
                        .map((log) => (
                          <TableRow key={log.id} className="cursor-pointer" onClick={() => handleLogSelect(log)}>
                            <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                            <TableCell>{log.message}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{log.source}</Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system-logs">
              <Card>
                <CardHeader>
                  <CardTitle>System Logs</CardTitle>
                  <CardDescription>System-level events and operations</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Message</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs
                        .filter((log) => log.source === "system")
                        .map((log) => (
                          <TableRow key={log.id} className="cursor-pointer" onClick={() => handleLogSelect(log)}>
                            <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                            <TableCell>{renderLevelBadge(log.level)}</TableCell>
                            <TableCell>{log.message}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="user-logs">
              <Card>
                <CardHeader>
                  <CardTitle>User Activity</CardTitle>
                  <CardDescription>User login, registration, and other activities</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Timestamp</TableHead>
                        <TableHead className="w-[100px]">Level</TableHead>
                        <TableHead>Activity</TableHead>
                        <TableHead className="w-[150px]">User</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredLogs
                        .filter((log) => log.user)
                        .map((log) => (
                          <TableRow key={log.id} className="cursor-pointer" onClick={() => handleLogSelect(log)}>
                            <TableCell className="font-mono text-xs">{formatDate(log.timestamp)}</TableCell>
                            <TableCell>{renderLevelBadge(log.level)}</TableCell>
                            <TableCell>{log.message}</TableCell>
                            <TableCell>{log.user}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

