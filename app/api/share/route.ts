import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import crypto from "crypto"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to share an analysis" }, { status: 401 })
    }

    const { analysisId, expiresIn } = await req.json()

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    const analysis = await prisma.pitchAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        pitch: {
          select: {
            userId: true,
          },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    if (analysis.pitch.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to share this analysis" }, { status: 403 })
    }

    // Generate a unique share token
    const shareToken = crypto.randomBytes(32).toString("hex")

    // Calculate expiration date (default to 7 days if not specified)
    const expirationDays = expiresIn ? Number.parseInt(expiresIn) : 7
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + expirationDays)

    // In a real implementation, you would store this token in the database
    // For this example, we'll just return the share URL
    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shared/${shareToken}`

    return NextResponse.json({
      shareUrl,
      expiresAt,
    })
  } catch (error) {
    console.error("Error sharing analysis:", error)
    return NextResponse.json({ error: "Failed to share analysis" }, { status: 500 })
  }
}

