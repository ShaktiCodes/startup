"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Share2, Copy, Check } from "lucide-react"

interface AnalysisResultProps {
  analysis: {
    id: string
    overallScore: number
    clarityScore: number
    persuasivenessScore: number
    investorAppealScore: number
    feedback: {
      clarity: {
        score: number
        feedback: string
        suggestions: string[]
      }
      persuasiveness: {
        score: number
        feedback: string
        suggestions: string[]
      }
      investorAppeal: {
        score: number
        feedback: string
        suggestions: string[]
      }
    }
    improvedPitch: string
    elevatorPitch: string
    createdAt: string
  }
  originalPitch: string
  pitchTitle: string
}

export function AnalysisResult({ analysis, originalPitch, pitchTitle }: AnalysisResultProps) {
  const [copiedImproved, setCopiedImproved] = useState(false)
  const [copiedElevator, setCopiedElevator] = useState(false)

  const copyToClipboard = async (text: string, type: "improved" | "elevator") => {
    try {
      await navigator.clipboard.writeText(text)
      if (type === "improved") {
        setCopiedImproved(true)
        setTimeout(() => setCopiedImproved(false), 2000)
      } else {
        setCopiedElevator(true)
        setTimeout(() => setCopiedElevator(false), 2000)
      }
    } catch (err) {
      console.error("Failed to copy text: ", err)
    }
  }

  const handleShare = async () => {
    // In a real implementation, this would call an API to generate a share link
    alert("Share functionality would be implemented here")
  }

  const handleDownload = async () => {
    // In a real implementation, this would call an API to generate a downloadable file
    alert("Download functionality would be implemented here")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{pitchTitle} Analysis</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
            <Badge variant={analysis.overallScore >= 80 ? "default" : "outline"}>
              {analysis.overallScore >= 80 ? "Excellent" : analysis.overallScore >= 60 ? "Good" : "Needs Work"}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.overallScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clarity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.clarityScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persuasiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.persuasivenessScore}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investor Appeal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.investorAppealScore}/100</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="comparison">Before & After</TabsTrigger>
          <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="elevator">Elevator Pitch</TabsTrigger>
          <TabsTrigger value="scores">Scores</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Pitch</CardTitle>
                <CardDescription>Your submitted pitch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md min-h-[200px] whitespace-pre-line">
                  {originalPitch}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Improved Pitch</CardTitle>
                <CardDescription>AI-enhanced version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md min-h-[200px] whitespace-pre-line">
                  {analysis.improvedPitch}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(analysis.improvedPitch, "improved")}
                  >
                    {copiedImproved ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy to Clipboard
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="feedback" className="space-y-4">
          {Object.entries(analysis.feedback).map(([category, data]: [string, any]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">
                  {category} ({data.score}/100)
                </CardTitle>
                <CardDescription>{data.feedback}</CardDescription>
              </CardHeader>
              <CardContent>
                <h4 className="font-medium mb-2">Improvement Suggestions:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {data.suggestions.map((suggestion: string, i: number) => (
                    <li key={i}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="elevator" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>30-Second Elevator Pitch</CardTitle>
              <CardDescription>Concise version for quick presentations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-md text-lg font-medium">
                {analysis.elevatorPitch}
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <Button variant="outline" onClick={() => copyToClipboard(analysis.elevatorPitch, "elevator")}>
                  {copiedElevator ? (
                    <>
                      <Check className="mr-2 h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="mr-2 h-4 w-4" />
                      Copy to Clipboard
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scores" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4">Pitch Scores</h3>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Overall Score</span>
                    <span className="font-bold">{analysis.overallScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${analysis.overallScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Clarity</span>
                    <span>{analysis.clarityScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div className="bg-primary h-2.5 rounded-full" style={{ width: `${analysis.clarityScore}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Persuasiveness</span>
                    <span>{analysis.persuasivenessScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${analysis.persuasivenessScore}%` }}
                    ></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between mb-2">
                    <span className="font-medium">Investor Appeal</span>
                    <span>{analysis.investorAppealScore}/100</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
                    <div
                      className="bg-primary h-2.5 rounded-full"
                      style={{ width: `${analysis.investorAppealScore}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

