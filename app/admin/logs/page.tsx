import { Suspense } from "react"
import LogsContent from "./logs-content"

export const dynamic = "force-dynamic"

export default function LogsPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading logs...</div>}>
      <LogsContent />
    </Suspense>
  )
}

