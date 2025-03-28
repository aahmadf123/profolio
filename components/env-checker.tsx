"use client"

import { useEffect, useState } from "react"
import { AlertCircle } from "lucide-react"
import { SetupGuide } from "@/components/setup-guide"
import { env } from "@/lib/env"

interface MissingEnvVar {
  name: string
  description: string
  required: boolean
}

export function EnvChecker() {
  const [missingVars, setMissingVars] = useState<MissingEnvVar[]>([])
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const missing: MissingEnvVar[] = []

    // Check Supabase configuration
    if (!env.SUPABASE_URL) {
      missing.push({
        name: "NEXT_PUBLIC_SUPABASE_URL",
        description: "The URL of your Supabase project",
        required: true,
      })
    }

    if (!env.SUPABASE_ANON_KEY) {
      missing.push({
        name: "NEXT_PUBLIC_SUPABASE_ANON_KEY",
        description: "The anonymous key for your Supabase project",
        required: true,
      })
    }

    // Check Redis configuration (only if neither Upstash nor KV is configured)
    if (!env.hasRedisConfig) {
      missing.push({
        name: "UPSTASH_REDIS_REST_URL",
        description: "The URL for Upstash Redis REST API",
        required: false,
      })
      missing.push({
        name: "UPSTASH_REDIS_REST_TOKEN",
        description: "The token for Upstash Redis REST API",
        required: false,
      })
    }

    setMissingVars(missing)
    setChecked(true)
  }, [])

  if (!checked || missingVars.length === 0) {
    return null
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 p-4 bg-red-950 text-red-100 border-b border-red-800">
      <div className="container mx-auto">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-6 w-6 text-red-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-red-400 mb-2">Missing Environment Variables</h2>
            <p className="mb-3">The following environment variables are missing:</p>
            <ul className="list-disc list-inside space-y-1 mb-4">
              {missingVars.map((envVar) => (
                <li key={envVar.name} className="text-red-300">
                  <span className="font-mono">{envVar.name}</span>
                  <span className="text-red-400 ml-2">- {envVar.description}</span>
                </li>
              ))}
            </ul>
            <div className="text-sm">
              <p className="mb-2">
                Please add these to your <span className="font-mono">.env.local</span> file or Vercel project settings.
              </p>
              <p className="mb-2">
                <strong>For Supabase:</strong> Get these values from your Supabase project dashboard under Project
                Settings &gt; API.
              </p>
              <p>
                <strong>For Redis:</strong> You need either Upstash Redis or Vercel KV credentials, but not both.
              </p>
            </div>
          </div>
          <div className="flex-shrink-0">
            <SetupGuide />
          </div>
        </div>
      </div>
    </div>
  )
}
