"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Loader2, AlertCircle } from "lucide-react"
import { analyzePitchAction } from "@/app/actions/analyze-pitch"
import { useFormState } from "react-dom"

// Initial state for the form
const initialState = {
  error: null,
  success: false,
}

// Wrapper for the server action to handle form state
const analyzePitchWithState = async (prevState: any, formData: FormData) => {
  try {
    await analyzePitchAction(formData)
    return { ...prevState, success: true, error: null }
  } catch (error) {
    return {
      ...prevState,
      error: error instanceof Error ? error.message : "An unexpected error occurred",
      success: false,
    }
  }
}

export function PitchForm() {
  const [state, formAction] = useFormState(analyzePitchWithState, initialState)
  const [title, setTitle] = useState("")
  const [pitchText, setPitchText] = useState("")
  const [investorType, setInvestorType] = useState("")
  const [isPublic, setIsPublic] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Create a FormData object
    const formData = new FormData(e.currentTarget)

    // Submit the form using the form action
    await formAction(formData)

    // Reset submission state
    setIsSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Pitch Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="E.g., SaaS Platform Pitch, Seed Round Deck"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Your Pitch</Label>
        <Textarea
          id="content"
          name="content"
          placeholder="Enter your startup pitch here..."
          className="min-h-[200px]"
          value={pitchText}
          onChange={(e) => setPitchText(e.target.value)}
          required
        />
        <p className="text-xs text-muted-foreground">
          For best results, include your value proposition, target market, problem you're solving, your solution,
          business model, and any traction or metrics.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investorType">Optimize for Investor Type (Optional)</Label>
        <Select value={investorType} onValueChange={setInvestorType} name="investorType">
          <SelectTrigger id="investorType">
            <SelectValue placeholder="Select investor type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No specific type</SelectItem>
            <SelectItem value="angel">Angel Investor</SelectItem>
            <SelectItem value="vc">Venture Capital</SelectItem>
            <SelectItem value="corporate">Corporate Investor</SelectItem>
            <SelectItem value="impact">Impact Investor</SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Selecting an investor type will tailor the analysis and suggestions to that specific audience.
        </p>
      </div>

      <div className="flex items-center space-x-2">
        <Switch id="isPublic" name="isPublic" checked={isPublic} onCheckedChange={setIsPublic} />
        <Label htmlFor="isPublic">Make this pitch public (anonymized)</Label>
      </div>

      {state.error && (
        <p className="text-sm text-red-500 flex items-center gap-1">
          <AlertCircle className="h-4 w-4" /> {state.error}
        </p>
      )}

      <Button type="submit" disabled={isSubmitting || !pitchText.trim() || !title.trim()} className="w-full">
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing...
          </>
        ) : (
          "Analyze Pitch"
        )}
      </Button>

      <p className="text-xs text-center text-muted-foreground">Analysis typically takes 15-30 seconds to complete.</p>
    </form>
  )
}

