import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component
import LiveEditorContent from "./live-editor-content"

export default function LiveEditorPage() {
  return (
    <Suspense fallback={<LiveEditorSkeleton />}>
      <LiveEditorContent />
    </Suspense>
  )
}

function LiveEditorSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Skeleton className="h-10 w-[250px] mb-2" />
          <Skeleton className="h-4 w-[350px]" />
        </div>
        <Skeleton className="h-10 w-[150px]" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-[600px] w-full rounded-md" />
        <Skeleton className="h-[600px] w-full rounded-md" />
      </div>
    </div>
  )
}

