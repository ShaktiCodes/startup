"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, FileText, History, Home, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-full flex-col border-r bg-slate-50 dark:bg-slate-900">
      <div className="flex h-14 items-center border-b px-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <BarChart3 className="h-6 w-6 text-primary" />
          <span>AI-Pitch Polisher</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          <Link
            href="/dashboard"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard" && "bg-muted text-foreground",
            )}
          >
            <Home className="h-4 w-4" />
            Dashboard
          </Link>
          <Link
            href="/dashboard/pitches"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/pitches" && "bg-muted text-foreground",
            )}
          >
            <FileText className="h-4 w-4" />
            My Pitches
          </Link>
          <Link
            href="/dashboard/history"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/history" && "bg-muted text-foreground",
            )}
          >
            <History className="h-4 w-4" />
            History
          </Link>
          <Link
            href="/dashboard/investors"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/investors" && "bg-muted text-foreground",
            )}
          >
            <Users className="h-4 w-4" />
            Investor Profiles
          </Link>
          <Link
            href="/dashboard/settings"
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-foreground",
              pathname === "/dashboard/settings" && "bg-muted text-foreground",
            )}
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </nav>
      </div>
      <div className="mt-auto p-4">
        <Button className="w-full" variant="outline" size="sm">
          <Link href="/" className="flex w-full items-center justify-center">
            Log Out
          </Link>
        </Button>
      </div>
    </div>
  )
}

