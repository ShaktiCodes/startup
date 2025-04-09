import Link from "next/link"
import { ArrowRight, BarChart3, FileText, MessageSquare, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2 font-bold">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>AI-Pitch Polisher</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/login">Login</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="container py-12 md:py-24 lg:py-32">
          <div className="mx-auto flex max-w-[980px] flex-col items-center gap-4 text-center">
            <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:text-6xl lg:leading-[1.1]">
              Transform Your Startup Pitch with AI-Powered Analysis
            </h1>
            <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
              Get instant feedback, optimize your messaging, and increase your chances of securing investment.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/dashboard">
                  Try It Now <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/how-it-works">How It Works</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="container py-12 md:py-24 lg:py-32 bg-slate-50 dark:bg-slate-900">
          <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Pitch Analysis</CardTitle>
                <CardDescription>
                  Submit your pitch and get detailed AI analysis on clarity, persuasiveness, and investor appeal.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Smart Rewrites</CardTitle>
                <CardDescription>
                  Get AI-powered suggestions to improve your pitch and make it more compelling.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Track Progress</CardTitle>
                <CardDescription>
                  Monitor how your pitch improves over time with detailed metrics and scoring.
                </CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-primary mb-4" />
                <CardTitle>Investor Matching</CardTitle>
                <CardDescription>Tailor your pitch to specific investor profiles and preferences.</CardDescription>
              </CardHeader>
            </Card>
            <Card className="md:col-span-2 lg:col-span-2">
              <CardHeader>
                <CardTitle>Ready to perfect your pitch?</CardTitle>
                <CardDescription>
                  Join thousands of founders who have improved their pitches and secured funding.
                </CardDescription>
              </CardHeader>
              <CardFooter>
                <Button asChild>
                  <Link href="/dashboard">Get Started</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} AI-Pitch Polisher. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/terms" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Terms
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

