import { Metadata } from "next"
import Link from "next/link"
import { 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Star,
  ChevronRight,
  Calendar,
  MessageSquare,
  Plus
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

export const metadata: Metadata = {
  title: "Instructor Dashboard | Dunamis EdTech",
  description: "Manage your courses, track student progress, and grow your teaching impact.",
}

const stats = [
  { label: "Total Students", value: "1,247", icon: Users, change: "+89 this month", trend: "up" },
  { label: "Active Courses", value: "6", icon: BookOpen, change: "2 in review", trend: "neutral" },
  { label: "Total Earnings", value: "₦4.2M", icon: DollarSign, change: "+₦380K this month", trend: "up" },
  { label: "Avg. Rating", value: "4.8", icon: Star, change: "Based on 892 reviews", trend: "up" },
]

const courses = [
  {
    id: 1,
    title: "Agentic AI & GenAI Mastery",
    students: 456,
    rating: 4.9,
    revenue: "₦1.8M",
    completionRate: 78,
    status: "Published",
  },
  {
    id: 2,
    title: "Advanced Prompt Engineering",
    students: 312,
    rating: 4.7,
    revenue: "₦980K",
    completionRate: 65,
    status: "Published",
  },
  {
    id: 3,
    title: "AI for Business Leaders",
    students: 189,
    rating: 4.8,
    revenue: "₦620K",
    completionRate: 82,
    status: "Published",
  },
  {
    id: 4,
    title: "Machine Learning Operations",
    students: 0,
    rating: 0,
    revenue: "₦0",
    completionRate: 0,
    status: "Draft",
  },
]

const recentActivity = [
  { type: "enrollment", message: "15 new students enrolled in Agentic AI", time: "2 hours ago" },
  { type: "review", message: "New 5-star review on Prompt Engineering", time: "4 hours ago" },
  { type: "question", message: "3 new questions in AI for Business Leaders", time: "5 hours ago" },
  { type: "payout", message: "Monthly payout of ₦380,000 processed", time: "Yesterday" },
]

const upcomingSessions = [
  { time: "10:00 AM", title: "Live Q&A: Agentic AI Module 5", students: 124 },
  { time: "2:00 PM", title: "Workshop: Building AI Agents", students: 89 },
  { time: "4:00 PM", title: "Office Hours", students: 23 },
]

export default function InstructorDashboard() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, Dr. Ogunlesi!
          </h1>
          <p className="text-muted-foreground">
            Your courses are performing great. Keep up the excellent work!
          </p>
        </div>
        <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" /> Create New Course
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <stat.icon className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs ${stat.trend === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {stat.change}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Courses Performance */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Course Performance</CardTitle>
                <CardDescription>Overview of your published courses</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/instructor/courses">
                  Manage Courses <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{course.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          course.status === 'Published' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <div className="mt-1 flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" /> {course.students} students
                        </span>
                        {course.rating > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500" /> {course.rating}
                          </span>
                        )}
                        <span>{course.revenue}</span>
                      </div>
                      {course.completionRate > 0 && (
                        <div className="mt-2 flex items-center gap-2">
                          <Progress value={course.completionRate} className="h-2 flex-1" />
                          <span className="text-xs text-muted-foreground">
                            {course.completionRate}% completion
                          </span>
                        </div>
                      )}
                    </div>
                    <Button variant="outline" size="sm">
                      {course.status === 'Draft' ? 'Edit' : 'View'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Sessions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today&apos;s Sessions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {upcomingSessions.map((session, index) => (
                <div key={index} className="rounded-lg border border-border p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-accent">{session.time}</span>
                    <span className="text-xs text-muted-foreground">
                      {session.students} registered
                    </span>
                  </div>
                  <p className="mt-1 text-sm font-medium">{session.title}</p>
                </div>
              ))}
              <Button variant="outline" className="w-full">
                View Full Schedule
              </Button>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <div>
                    <p className="text-sm">{activity.message}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
