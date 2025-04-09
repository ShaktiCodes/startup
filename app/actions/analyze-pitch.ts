"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { analyzePitchWithAI } from "@/lib/ai"

export async function analyzePitchAction(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to analyze a pitch")
  }

  // Extract data from the form
  const title = formData.get("title") as string
  const content = formData.get("content") as string
  const investorType = (formData.get("investorType") as string) || undefined
  const isPublic = formData.get("isPublic") === "on"

  // Validate the input
  if (!title || !content) {
    throw new Error("Title and pitch content are required")
  }

  try {
    // First, create the pitch in the database
    const pitch = await prisma.pitch.create({
      data: {
        title,
        content,
        investorType,
        isPublic,
        userId: session.user.id,
      },
    })

    // Then, analyze the pitch using AI
    const analysis = await analyzePitchWithAI(content, investorType)

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

    // Revalidate the dashboard path to update the UI
    revalidatePath("/dashboard")

    // Redirect to the analysis page
    redirect(`/dashboard/analyze/${savedAnalysis.id}`)
  } catch (error) {
    console.error("Error analyzing pitch:", error)
    throw new Error(error instanceof Error ? error.message : "Failed to analyze pitch")
  }
}

