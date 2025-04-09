import { FileText, MessageSquare, Users, ArrowUp } from "lucide-react"

export function RecentActivity() {
  // Mock data for recent activity
  const activities = [
    {
      id: 1,
      type: "analysis",
      title: "SaaS Platform Pitch analyzed",
      time: "2 hours ago",
      icon: FileText,
      score: 78,
    },
    {
      id: 2,
      type: "improvement",
      title: "Pitch score improved",
      time: "2 hours ago",
      icon: ArrowUp,
      details: "+12% from previous version",
    },
    {
      id: 3,
      type: "feedback",
      title: "AI feedback generated",
      time: "2 hours ago",
      icon: MessageSquare,
      details: "3 key improvement areas identified",
    },
    {
      id: 4,
      type: "investor",
      title: "Investor profile matched",
      time: "1 day ago",
      icon: Users,
      details: "Optimized for Venture Capital",
    },
    {
      id: 5,
      type: "analysis",
      title: "Mobile App Pitch analyzed",
      time: "1 week ago",
      icon: FileText,
      score: 72,
    },
  ]

  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.id} className="flex items-start space-x-3">
          <div className="rounded-full bg-primary/10 p-1">
            <activity.icon className="h-4 w-4 text-primary" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-medium">{activity.title}</p>
            <div className="flex items-center text-xs text-muted-foreground">
              <span>{activity.time}</span>
              {activity.score && <span className="ml-2 font-medium">Score: {activity.score}/100</span>}
              {activity.details && <span className="ml-2">{activity.details}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

