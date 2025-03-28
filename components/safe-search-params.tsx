"use client"

import { Suspense, type ReactNode } from "react"

interface SafeSearchParamsProps {
  children: ReactNode
}

export function SafeSearchParams({ children }: SafeSearchParamsProps) {
  return <Suspense fallback={null}>{children}</Suspense>
}

