import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component
import GamificationContent from "./gamification-content"

export default function GamificationPage() {
  return (
    <Suspense fallback={<GamificationSkeleton />}>
      <GamificationContent />
    </Suspense>
  )
}

function GamificationSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[300px] mb-2" />
        <Skeleton className="h-4 w-[400px]" />
      </div>

      <Skeleton className="h-[150px] w-full rounded-md" />

      <div className="space-y-2">
        <Skeleton className="h-10 w-[200px]" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    </div>
  )
}

