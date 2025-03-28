import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component
import ResumeContent from "./resume-content"

export default function ResumePage() {
  return (
    <Suspense fallback={<ResumeSkeleton />}>
      <ResumeContent />
    </Suspense>
  )
}

function ResumeSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Skeleton className="h-[500px] w-full rounded-md" />
        <Skeleton className="h-[500px] w-full rounded-md" />
      </div>
    </div>
  )
}

