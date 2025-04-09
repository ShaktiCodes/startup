import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"
import { analyzePitchWithAI } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to analyze a pitch" }, { status: 401 })
    }

    const { pitchId } = await req.json()

    if (!pitchId) {
      return NextResponse.json({ error: "Pitch ID is required" }, { status: 400 })
    }

    const pitch = await prisma.pitch.findUnique({
      where: { id: pitchId },
    })

    if (!pitch) {
      return NextResponse.json({ error: "Pitch not found" }, { status: 404 })
    }

    if (pitch.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to analyze this pitch" }, { status: 403 })
    }

    // Analyze the pitch using AI
    const analysis = await analyzePitchWithAI(pitch.content, pitch.investorType || undefined)

    // Save the analysis to the database
    const savedAnalysis = await prisma.pitchAnalysis.create({
      data: {
        pitchId: pitch.id,
        overallScore: analysis.overallScore,
        clarityScore: analysis.categories.clarity.score,
        persuasivenessScore: analysis.categories.persuasiveness.score,
        investorAppealScore: analysis.categories.investorAppeal.score,
        feedback: analysis.categories,
        improvedPitch: analysis.improvedPitch,
        elevatorPitch: analysis.elevatorPitch,
      },
    })

    return NextResponse.json({ analysisId: savedAnalysis.id })
  } catch (error) {
    console.error("Error analyzing pitch:", error)
    return NextResponse.json({ error: "Failed to analyze pitch" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to view analyses" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const analysisId = searchParams.get("id")

    if (!analysisId) {
      return NextResponse.json({ error: "Analysis ID is required" }, { status: 400 })
    }

    const analysis = await prisma.pitchAnalysis.findUnique({
      where: { id: analysisId },
      include: {
        pitch: {
          select: {
            id: true,
            title: true,
            content: true,
            userId: true,
            investorType: true,
            isPublic: true,
          },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    if (analysis.pitch.userId !== session.user.id && !analysis.pitch.isPublic) {
      return NextResponse.json({ error: "You don't have permission to view this analysis" }, { status: 403 })
    }

    return NextResponse.json(analysis)
  } catch (error) {
    console.error("Error fetching analysis:", error)
    return NextResponse.json({ error: "Failed to fetch analysis" }, { status: 500 })
  }
}

