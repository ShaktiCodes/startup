import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to view pitch history" }, { status: 401 })
    }

    // Get pitch history with analysis scores
    const pitchHistory = await prisma.pitch.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            overallScore: true,
            clarityScore: true,
            persuasivenessScore: true,
            investorAppealScore: true,
            createdAt: true,
          },
        },
      },
    })

    // Transform the data to include improvement metrics
    const transformedHistory = pitchHistory.map((pitch) => {
      // Sort analyses by date (newest first)
      const sortedAnalyses = [...pitch.analyses].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

      // Get the latest and previous analysis if they exist
      const latestAnalysis = sortedAnalyses[0]
      const previousAnalysis = sortedAnalyses[1]

      // Calculate improvement if there are at least two analyses
      const improvement =
        latestAnalysis && previousAnalysis
          ? {
              overall: latestAnalysis.overallScore - previousAnalysis.overallScore,
              clarity: latestAnalysis.clarityScore - previousAnalysis.clarityScore,
              persuasiveness: latestAnalysis.persuasivenessScore - previousAnalysis.persuasivenessScore,
              investorAppeal: latestAnalysis.investorAppealScore - previousAnalysis.investorAppealScore,
            }
          : null

      return {
        id: pitch.id,
        title: pitch.title,
        createdAt: pitch.createdAt,
        updatedAt: pitch.updatedAt,
        latestAnalysis: latestAnalysis || null,
        improvement,
        analysisCount: sortedAnalyses.length,
      }
    })

    return NextResponse.json(transformedHistory)
  } catch (error) {
    console.error("Error fetching pitch history:", error)
    return NextResponse.json({ error: "Failed to fetch pitch history" }, { status: 500 })
  }
}

