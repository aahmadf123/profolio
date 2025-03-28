import { Suspense } from "react"
import { Skeleton } from "@/components/ui/skeleton"

// Import the client component
import ContactSettingsContent from "./contact-settings-content"

export default function ContactSettingsPage() {
  return (
    <Suspense fallback={<ContactSettingsSkeleton />}>
      <ContactSettingsContent />
    </Suspense>
  )
}

function ContactSettingsSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-10 w-[250px] mb-2" />
        <Skeleton className="h-4 w-[350px]" />
      </div>

      <div className="space-y-2">
        <Skeleton className="h-10 w-[300px]" />
        <Skeleton className="h-[400px] w-full rounded-md" />
      </div>
    </div>
  )
}

