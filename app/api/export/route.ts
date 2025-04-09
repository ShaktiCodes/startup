import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to export data" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const analysisId = searchParams.get("analysisId")
    const format = searchParams.get("format") || "json"

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
          },
        },
      },
    })

    if (!analysis) {
      return NextResponse.json({ error: "Analysis not found" }, { status: 404 })
    }

    if (analysis.pitch.userId !== session.user.id) {
      return NextResponse.json({ error: "You don't have permission to export this analysis" }, { status: 403 })
    }

    // Format the data based on the requested format
    if (format === "pdf") {
      // In a real implementation, you would generate a PDF here
      // For this example, we'll just return a message
      return NextResponse.json({
        message: "PDF export functionality would be implemented here",
      })
    } else if (format === "docx") {
      // In a real implementation, you would generate a DOCX here
      return NextResponse.json({
        message: "DOCX export functionality would be implemented here",
      })
    } else {
      // Default to JSON
      return NextResponse.json({
        title: analysis.pitch.title,
        originalPitch: analysis.pitch.content,
        improvedPitch: analysis.improvedPitch,
        elevatorPitch: analysis.elevatorPitch,
        scores: {
          overall: analysis.overallScore,
          clarity: analysis.clarityScore,
          persuasiveness: analysis.persuasivenessScore,
          investorAppeal: analysis.investorAppealScore,
        },
        feedback: analysis.feedback,
        createdAt: analysis.createdAt,
      })
    }
  } catch (error) {
    console.error("Error exporting analysis:", error)
    return NextResponse.json({ error: "Failed to export analysis" }, { status: 500 })
  }
}

