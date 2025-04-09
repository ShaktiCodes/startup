import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { AnalysisResult } from "@/components/analysis-result"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { formatDate } from "@/lib/utils"

export default async function AnalysisPage({ params }: { params: { id: string } }) {
  const session = await auth()

  if (!session?.user?.id) {
    return notFound()
  }

  const analysisId = params.id

  // Fetch the analysis from the database
  const analysis = await prisma.pitchAnalysis.findUnique({
    where: { id: analysisId },
    include: {
      pitch: {
        select: {
          id: true,
          title: true,
          content: true,
          userId: true,
          createdAt: true,
        },
      },
    },
  })

  if (!analysis || analysis.pitch.userId !== session.user.id) {
    return notFound()
  }

  return (
    <DashboardShell>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader heading={analysis.pitch.title} text={`Analysis from ${formatDate(analysis.createdAt)}`} />
      </div>

      <AnalysisResult
        analysis={{
          id: analysis.id,
          overallScore: analysis.overallScore,
          clarityScore: analysis.clarityScore,
          persuasivenessScore: analysis.persuasivenessScore,
          investorAppealScore: analysis.investorAppealScore,
          feedback: analysis.feedback as any,
          improvedPitch: analysis.improvedPitch,
          elevatorPitch: analysis.elevatorPitch,
          createdAt: analysis.createdAt.toISOString(),
        }}
        originalPitch={analysis.pitch.content}
        pitchTitle={analysis.pitch.title}
      />
    </DashboardShell>
  )
}

