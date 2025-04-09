import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, ArrowUpRight, Calendar } from "lucide-react"

export function PitchHistory() {
  // Mock data for pitch history
  const pitchHistory = [
    {
      id: 1,
      title: "SaaS Platform Pitch",
      date: "April 5, 2025",
      score: 78,
      previousScore: 66,
      improvement: 12,
    },
    {
      id: 2,
      title: "Mobile App Pitch",
      date: "March 28, 2025",
      score: 72,
      previousScore: 65,
      improvement: 7,
    },
    {
      id: 3,
      title: "E-commerce Solution Pitch",
      date: "March 15, 2025",
      score: 66,
      previousScore: 58,
      improvement: 8,
    },
    {
      id: 4,
      title: "Initial Pitch Draft",
      date: "March 1, 2025",
      score: 58,
      previousScore: null,
      improvement: null,
    },
  ]

  return (
    <div className="space-y-4">
      {pitchHistory.map((pitch) => (
        <Card key={pitch.id}>
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-4">
                <div className="rounded-md bg-primary/10 p-2">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{pitch.title}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mt-1">
                    <Calendar className="mr-1 h-3 w-3" />
                    {pitch.date}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-lg">{pitch.score}/100</span>
                  {pitch.improvement && (
                    <Badge
                      variant="outline"
                      className="text-green-600 border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800"
                    >
                      +{pitch.improvement}%
                    </Badge>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="mt-2">
                  View Details <ArrowUpRight className="ml-1 h-3 w-3" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

