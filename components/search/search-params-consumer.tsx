"use client"

import { Suspense, useSearchParams } from "next/navigation"
import type { ReactNode } from "react"

interface SearchParamsConsumerProps {
  children: (params: URLSearchParams) => ReactNode
  fallback?: ReactNode
}

function SearchParamsContent({ children }: SearchParamsConsumerProps) {
  const searchParams = useSearchParams()
  return <>{children(searchParams)}</>
}

export function SearchParamsConsumer({ children, fallback = <div>Loading...</div> }: SearchParamsConsumerProps) {
  return (
    <Suspense fallback={fallback}>
      <SearchParamsContent>{children}</SearchParamsContent>
    </Suspense>
  )
}

