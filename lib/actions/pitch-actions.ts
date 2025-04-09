"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { auth } from "@/lib/auth"
import { analyzePitchWithAI } from "@/lib/ai"

// Schema for pitch creation/update
const pitchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Pitch content must be at least 10 characters"),
  investorType: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export async function createPitch(formData: FormData) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to create a pitch")
  }

  const rawData = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    investorType: formData.get("investorType") as string,
    isPublic: formData.get("isPublic") === "on",
  }

  const validatedData = pitchSchema.parse(rawData)

  const pitch = await prisma.pitch.create({
    data: {
      ...validatedData,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  redirect(`/dashboard/pitches/${pitch.id}`)
}

export async function analyzePitch(pitchId: string) {
  const session = await auth()

  if (!session?.user?.id) {
    throw new Error("You must be logged in to analyze a pitch")
  }

  const pitch = await prisma.pitch.findUnique({
    where: { id: pitchId },
    include: { user: true },
  })

  if (!pitch) {
    throw new Error("Pitch not found")
  }

  if (pitch.userId !== session.user.id) {
    throw new Error("You don't have permission to analyze this pitch")
  }

  // Analyze the pitch using AI
  const analysis = await analyzePitchWithAI(pitch.content, pitch.investorType)

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

  revalidatePath(`/dashboard/pitches/${pitch.id}`)
  return savedAnalysis.id
}

export async function getPitchHistory(userId: string) {
  return prisma.pitch.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  })
}

export async function getPitchWithLatestAnalysis(pitchId: string) {
  return prisma.pitch.findUnique({
    where: { id: pitchId },
    include: {
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
        },
      },
    },
  })
}

