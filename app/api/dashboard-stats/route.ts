import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to view dashboard stats" }, { status: 401 })
    }

    // Get pitch count
    const pitchCount = await prisma.pitch.count({
      where: { userId: session.user.id },
    })

    // Get analysis count
    const analysisCount = await prisma.pitchAnalysis.count({
      where: {
        pitch: {
          userId: session.user.id,
        },
      },
    })

    // Get latest scores
    const latestPitch = await prisma.pitch.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        analyses: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            overallScore: true,
            clarityScore: true,
            persuasivenessScore: true,
            investorAppealScore: true,
          },
        },
      },
    })

    // Get score evolution over time
    const scoreEvolution = await prisma.pitchAnalysis.findMany({
      where: {
        pitch: {
          userId: session.user.id,
        },
      },
      orderBy: { createdAt: "asc" },
      select: {
        createdAt: true,
        overallScore: true,
        pitch: {
          select: {
            title: true,
          },
        },
      },
    })

    // Format score evolution data for charting
    const formattedScoreEvolution = scoreEvolution.map((analysis) => ({
      date: analysis.createdAt.toISOString().split("T")[0],
      score: analysis.overallScore,
      pitch: analysis.pitch.title,
    }))

    // Get recent activity
    const recentActivity = await prisma.pitchAnalysis.findMany({
      where: {
        pitch: {
          userId: session.user.id,
        },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        createdAt: true,
        overallScore: true,
        pitch: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    // Format recent activity
    const formattedRecentActivity = recentActivity.map((activity) => ({
      id: activity.id,
      type: "analysis",
      title: `${activity.pitch.title} analyzed`,
      time: activity.createdAt,
      score: activity.overallScore,
      pitchId: activity.pitch.id,
    }))

    // Get latest scores
    const latestScores = latestPitch?.analyses[0] || {
      overallScore: 0,
      clarityScore: 0,
      persuasivenessScore: 0,
      investorAppealScore: 0,
    }

    return NextResponse.json({
      pitchCount,
      analysisCount,
      latestScores,
      scoreEvolution: formattedScoreEvolution,
      recentActivity: formattedRecentActivity,
    })
  } catch (error) {
    console.error("Error fetching dashboard stats:", error)
    return NextResponse.json({ error: "Failed to fetch dashboard stats" }, { status: 500 })
  }
}

