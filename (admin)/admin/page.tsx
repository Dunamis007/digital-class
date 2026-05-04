import { Metadata } from "next"
import Link from "next/link"
import { 
  Users, 
  BookOpen, 
  DollarSign, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  ShoppingCart,
  UserPlus,
  ChevronRight
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export const metadata: Metadata = {
  title: "Admin Dashboard | Dunamis EdTech",
  description: "Manage users, courses, payments, and platform analytics.",
}

const stats = [
  { 
    label: "Total Revenue", 
    value: "₦42.8M", 
    change: "+12.5%", 
    trend: "up",
    icon: DollarSign,
    description: "vs last month"
  },
  { 
    label: "Total Users", 
    value: "12,847", 
    change: "+8.2%", 
    trend: "up",
    icon: Users,
    description: "vs last month"
  },
  { 
    label: "Course Enrollments", 
    value: "3,456", 
    change: "+15.3%", 
    trend: "up",
    icon: BookOpen,
    description: "this month"
  },
  { 
    label: "Conversion Rate", 
    value: "4.8%", 
    change: "-0.3%", 
    trend: "down",
    icon: TrendingUp,
    description: "vs last month"
  },
]

const recentTransactions = [
  { id: "TXN001", user: "Adebayo Johnson", course: "Agentic AI & GenAI", amount: "₦150,000", status: "Completed", date: "2 hours ago" },
  { id: "TXN002", user: "Chioma Nwosu", course: "Cybersecurity", amount: "₦120,000", status: "Completed", date: "3 hours ago" },
  { id: "TXN003", user: "Emeka Okonkwo", course: "Cloud Computing", amount: "₦135,000", status: "Pending", date: "4 hours ago" },
  { id: "TXN004", user: "Fatima Abdullahi", course: "IELTS Preparation", amount: "₦85,000", status: "Completed", date: "5 hours ago" },
  { id: "TXN005", user: "Oluwaseun Adeyemi", course: "Data Engineering", amount: "₦140,000", status: "Failed", date: "6 hours ago" },
]

const topCourses = [
  { name: "Agentic AI & GenAI Mastery", enrollments: 456, revenue: "₦68.4M", growth: "+23%" },
  { name: "Cybersecurity Fundamentals", enrollments: 312, revenue: "₦37.4M", growth: "+18%" },
  { name: "Cloud Computing with AWS", enrollments: 289, revenue: "₦39.0M", growth: "+15%" },
  { name: "Full Stack Development", enrollments: 267, revenue: "₦32.0M", growth: "+12%" },
  { name: "IELTS Preparation", enrollments: 234, revenue: "₦19.9M", growth: "+28%" },
]

const recentActivity = [
  { icon: UserPlus, message: "New user: Adebayo Johnson registered", time: "2 min ago" },
  { icon: ShoppingCart, message: "New enrollment in Agentic AI course", time: "5 min ago" },
  { icon: Eye, message: "Blog post \"AI in Nigeria\" got 1,200 views", time: "12 min ago" },
  { icon: DollarSign, message: "Payment of ₦150,000 received", time: "15 min ago" },
  { icon: UserPlus, message: "New instructor application: Dr. Kemi Ade", time: "25 min ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Overview of platform performance and metrics
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Download Report</Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            View Analytics
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {stat.change}
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="h-4 w-4" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4" />
                  )}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-xs text-muted-foreground">{stat.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Transactions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest payment activities</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/admin/payments">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left text-sm text-muted-foreground">
                      <th className="pb-3 font-medium">Transaction</th>
                      <th className="pb-3 font-medium">User</th>
                      <th className="pb-3 font-medium">Amount</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((txn) => (
                      <tr key={txn.id} className="border-b border-border last:border-0">
                        <td className="py-3">
                          <p className="text-sm font-medium">{txn.id}</p>
                          <p className="text-xs text-muted-foreground">{txn.course}</p>
                        </td>
                        <td className="py-3 text-sm">{txn.user}</td>
                        <td className="py-3 text-sm font-medium">{txn.amount}</td>
                        <td className="py-3">
                          <span className={`rounded-full px-2 py-1 text-xs font-medium ${
                            txn.status === 'Completed' 
                              ? 'bg-green-100 text-green-700'
                              : txn.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {txn.status}
                          </span>
                        </td>
                        <td className="py-3 text-sm text-muted-foreground">{txn.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                  <activity.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Top Courses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Top Performing Courses</CardTitle>
            <CardDescription>Courses with highest enrollments this month</CardDescription>
          </div>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/courses">
              Manage Courses <ChevronRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Enrollments</th>
                  <th className="pb-3 font-medium">Revenue</th>
                  <th className="pb-3 font-medium">Growth</th>
                </tr>
              </thead>
              <tbody>
                {topCourses.map((course, index) => (
                  <tr key={index} className="border-b border-border last:border-0">
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                          {index + 1}
                        </div>
                        <span className="font-medium">{course.name}</span>
                      </div>
                    </td>
                    <td className="py-3 text-sm">{course.enrollments}</td>
                    <td className="py-3 text-sm font-medium">{course.revenue}</td>
                    <td className="py-3">
                      <span className="flex items-center gap-1 text-sm font-medium text-green-600">
                        {course.growth}
                        <ArrowUpRight className="h-4 w-4" />
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
