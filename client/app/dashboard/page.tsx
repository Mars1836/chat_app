"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <div className="flex items-center gap-4">
          <span>Welcome, {user.username}!</span>
          <Button
            variant="outline"
            onClick={() => {
              logout()
              router.push("/")
            }}
          >
            Logout
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-xl font-semibold mb-4">Protected Content</h2>
        <p className="text-muted-foreground">This page is only accessible to authenticated users.</p>
      </div>
    </div>
  )
}

