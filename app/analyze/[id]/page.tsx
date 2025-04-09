import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import Link from "next/link"

export default function PitchAnalysisPage({ params }: { params: { id: string } }) {
  // In a real app, we would fetch the pitch analysis data based on the ID
  const pitchId = params.id

  // Mock data for the pitch analysis
  const analysis = {
    id: pitchId,
    title: "SaaS Platform Pitch",
    date: "April 5, 2025",
    originalPitch:
      "Our SaaS platform revolutionizes how businesses manage their customer relationships. With an intuitive interface and powerful analytics, we help companies increase retention and maximize customer lifetime value. Our solution integrates seamlessly with existing tools and provides actionable insights that drive growth.",
    improvedPitch:
      "Introducing RelationshipIQ: The AI-powered SaaS platform that transforms customer relationship management for mid-market B2B companies. Our solution has already helped 50+ businesses increase customer retention by an average of 27% and boost lifetime value by 35% within just 90 days of implementation. Unlike traditional CRMs that require extensive training, RelationshipIQ's intuitive interface reduces onboarding time by 60% and integrates seamlessly with your existing tech stack. With our proprietary predictive analytics engine, you'll identify at-risk accounts before they churn and uncover upsell opportunities worth $420K on average per customer. We're seeking $2M to scale our sales team and accelerate product development to capture our $8.5B addressable market.",
    elevatorPitch:
      "RelationshipIQ helps B2B companies retain customers and increase their value through AI-powered insights. Unlike traditional CRMs, our platform predicts customer behavior, preventing churn and identifying growth opportunities with minimal implementation effort. We've already proven a 27% retention increase across 50+ customers and are raising funds to scale.",
    scores: {
      overall: 78,
      clarity: 82,
      persuasiveness: 75,
      investorAppeal: 71,
    },
    feedback: {
      clarity: {
        score: 82,
        feedback:
          "Your value proposition is clear, but the market size description could be more specific with actual numbers.",
        suggestions: [
          "Add specific TAM/SAM/SOM figures",
          "Clarify your unique selling proposition in the first paragraph",
          "Use more concrete examples of customer problems",
        ],
      },
      persuasiveness: {
        score: 75,
        feedback: "Your pitch has compelling points but lacks strong evidence to back up claims.",
        suggestions: [
          "Include 2-3 data points that validate your market claims",
          "Add a brief customer testimonial or case study",
          "Strengthen your call to action at the end",
        ],
      },
      investorAppeal: {
        score: 71,
        feedback: "The business model is explained but the growth strategy and return potential need more emphasis.",
        suggestions: [
          "Clearly outline your monetization strategy",
          "Include projected growth metrics for the next 2-3 years",
          "Explain how funding will accelerate specific growth metrics",
        ],
      },
    },
  }

  return (
    <DashboardShell>
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <DashboardHeader heading={analysis.title} text={`Analysis from ${analysis.date}`}>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </DashboardHeader>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.scores.overall}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clarity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.scores.clarity}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Persuasiveness</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.scores.persuasiveness}/100</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Investor Appeal</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analysis.scores.investorAppeal}/100</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="comparison" className="space-y-4">
        <TabsList>
          <TabsTrigger value="comparison">Before & After</TabsTrigger>
          <TabsTrigger value="feedback">Detailed Feedback</TabsTrigger>
          <TabsTrigger value="elevator">Elevator Pitch</TabsTrigger>
        </TabsList>

        <TabsContent value="comparison" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Original Pitch</CardTitle>
                <CardDescription>Your submitted pitch</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md min-h-[200px]">
                  {analysis.originalPitch}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Improved Pitch</CardTitle>
                <CardDescription>AI-enhanced version</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-md min-h-[200px]">
                  {analysis.improvedPitch}
                </div>
                <div className="mt-4 flex justify-end">
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
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
                <Button variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button>
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

