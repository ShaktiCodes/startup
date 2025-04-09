import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardHeader } from "@/components/dashboard-header"
import { DashboardShell } from "@/components/dashboard-shell"
import { PitchForm } from "@/components/pitch-form"
import { PitchHistory } from "@/components/pitch-history"
import { RecentActivity } from "@/components/recent-activity"
import { PitchScoreChart } from "@/components/pitch-score-chart"

export default function DashboardPage() {
  return (
    <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Submit your pitch for analysis and track your progress." />
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Pitch</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
          <TabsTrigger value="investor-match">Investor Match</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pitch Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">78/100</div>
                <p className="text-xs text-muted-foreground">+12% from last pitch</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Clarity Rating</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">82/100</div>
                <p className="text-xs text-muted-foreground">+5% from last pitch</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Persuasiveness</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">75/100</div>
                <p className="text-xs text-muted-foreground">+8% from last pitch</p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Investor Appeal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">71/100</div>
                <p className="text-xs text-muted-foreground">+15% from last pitch</p>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Pitch Score Evolution</CardTitle>
                <CardDescription>Track how your pitch has improved over time</CardDescription>
              </CardHeader>
              <CardContent className="pl-2">
                <PitchScoreChart />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent pitch analyses and updates</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentActivity />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analyze" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analyze Your Pitch</CardTitle>
              <CardDescription>Submit your pitch for AI analysis and get detailed feedback</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <PitchForm />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pitch History</CardTitle>
              <CardDescription>View and compare your previous pitch analyses</CardDescription>
            </CardHeader>
            <CardContent>
              <PitchHistory />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="investor-match" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investor Profile Matcher</CardTitle>
              <CardDescription>Tailor your pitch to specific investor types</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <p>Select an investor profile to optimize your pitch for:</p>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <span className="font-semibold">Angel Investor</span>
                    <span className="text-xs text-muted-foreground">Early-stage, vision-focused</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <span className="font-semibold">Venture Capital</span>
                    <span className="text-xs text-muted-foreground">Growth-oriented, metrics-driven</span>
                  </Button>
                  <Button variant="outline" className="h-24 flex flex-col items-center justify-center gap-2">
                    <span className="font-semibold">Corporate Investor</span>
                    <span className="text-xs text-muted-foreground">Strategic fit, market position</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardShell>
  )
}

