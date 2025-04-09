import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { z } from "zod"
import { prisma } from "@/lib/db"
import { authOptions } from "@/lib/auth"

const pitchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(10, "Pitch content must be at least 10 characters"),
  investorType: z.string().optional(),
  isPublic: z.boolean().default(false),
})

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to create a pitch" }, { status: 401 })
    }

    const formData = await req.formData()

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

    return NextResponse.json({ pitchId: pitch.id }, { status: 201 })
  } catch (error) {
    console.error("Error creating pitch:", error)

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 })
    }

    return NextResponse.json({ error: "Failed to create pitch" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "You must be logged in to view pitches" }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const pitchId = searchParams.get("id")

    if (pitchId) {
      // Get a specific pitch
      const pitch = await prisma.pitch.findUnique({
        where: { id: pitchId },
        include: {
          analyses: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      })

      if (!pitch) {
        return NextResponse.json({ error: "Pitch not found" }, { status: 404 })
      }

      if (pitch.userId !== session.user.id && !pitch.isPublic) {
        return NextResponse.json({ error: "You don't have permission to view this pitch" }, { status: 403 })
      }

      return NextResponse.json(pitch)
    } else {
      // Get all pitches for the user
      const pitches = await prisma.pitch.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          analyses: {
            orderBy: { createdAt: "desc" },
            take: 1,
          },
        },
      })

      return NextResponse.json(pitches)
    }
  } catch (error) {
    console.error("Error fetching pitches:", error)
    return NextResponse.json({ error: "Failed to fetch pitches" }, { status: 500 })
  }
}

