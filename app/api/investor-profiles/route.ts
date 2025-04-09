import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to view investor profiles" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const profileId = searchParams.get("id")

    if (profileId) {
      // Get a specific investor profile
      const profile = await prisma.investorProfile.findUnique({
        where: { id: profileId },
      })

      if (!profile) {
        return NextResponse.json({ error: "Investor profile not found" }, { status: 404 })
      }

      return NextResponse.json(profile)
    } else {
      // Get all investor profiles
      const profiles = await prisma.investorProfile.findMany({
        orderBy: { name: "asc" },
      })

      return NextResponse.json(profiles)
    }
  } catch (error) {
    console.error("Error fetching investor profiles:", error)
    return NextResponse.json({ error: "Failed to fetch investor profiles" }, { status: 500 })
  }
}

