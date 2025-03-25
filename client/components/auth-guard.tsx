"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"

const publicPaths = ["/", "/register"]

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading) {
      const isPublicPath = publicPaths.includes(pathname)

      if (!user && !isPublicPath) {
        // Redirect to login if trying to access protected route while not authenticated
        router.push("/")
      } else if (user && isPublicPath) {
        // Redirect to dashboard if trying to access login/register while authenticated
        router.push("/dashboard")
      }
    }
  }, [user, isLoading, router, pathname])

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render protected content until auth check is complete
  if (!isLoading && !user && !publicPaths.includes(pathname)) {
    return null
  }

  return <>{children}</>
}

