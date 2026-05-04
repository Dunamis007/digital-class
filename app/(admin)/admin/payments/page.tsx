import { Metadata } from "next"
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  AlertCircle,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  XCircle
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export const metadata: Metadata = {
  title: "Payments Management | Dunamis EdTech Admin",
  description: "Manage all platform payments, transactions, and payouts.",
}

const stats = [
  { label: "Total Revenue", value: "₦42.8M", change: "+12.5%", icon: DollarSign },
  { label: "This Month", value: "₦8.4M", change: "+8.2%", icon: TrendingUp },
  { label: "Pending Payouts", value: "₦1.2M", change: "5 instructors", icon: CreditCard },
  { label: "Failed Transactions", value: "12", change: "Needs attention", icon: AlertCircle },
]

const transactions = [
  { 
    id: "TXN-2024-001", 
    user: "Adebayo Johnson",
    email: "adebayo@email.com",
    course: "Agentic AI & GenAI Mastery", 
    amount: "₦150,000",
    method: "Card",
    status: "Completed",
    date: "Apr 10, 2024 - 2:30 PM"
  },
  { 
    id: "TXN-2024-002", 
    user: "Chioma Nwosu",
    email: "chioma@email.com",
    course: "Cybersecurity Fundamentals", 
    amount: "₦120,000",
    method: "Bank Transfer",
    status: "Completed",
    date: "Apr 10, 2024 - 1:45 PM"
  },
  { 
    id: "TXN-2024-003", 
    user: "Emeka Okonkwo",
    email: "emeka@email.com",
    course: "Cloud Computing with AWS", 
    amount: "₦135,000",
    method: "Card",
    status: "Pending",
    date: "Apr 10, 2024 - 12:15 PM"
  },
  { 
    id: "TXN-2024-004", 
    user: "Fatima Abdullahi",
    email: "fatima@email.com",
    course: "IELTS Preparation", 
    amount: "₦85,000",
    method: "USSD",
    status: "Completed",
    date: "Apr 10, 2024 - 11:30 AM"
  },
  { 
    id: "TXN-2024-005", 
    user: "Oluwaseun Adeyemi",
    email: "seun@email.com",
    course: "Data Engineering", 
    amount: "₦140,000",
    method: "Card",
    status: "Failed",
    date: "Apr 10, 2024 - 10:00 AM"
  },
  { 
    id: "TXN-2024-006", 
    user: "Ngozi Eze",
    email: "ngozi@email.com",
    course: "Full Stack Development", 
    amount: "₦160,000",
    method: "Card",
    status: "Completed",
    date: "Apr 9, 2024 - 4:20 PM"
  },
  { 
    id: "TXN-2024-007", 
    user: "Ibrahim Musa",
    email: "ibrahim@email.com",
    course: "DevOps & Automation", 
    amount: "₦145,000",
    method: "Bank Transfer",
    status: "Completed",
    date: "Apr 9, 2024 - 3:15 PM"
  },
  { 
    id: "TXN-2024-008", 
    user: "Blessing Okafor",
    email: "blessing@email.com",
    course: "Mobile App Development", 
    amount: "₦130,000",
    method: "Card",
    status: "Pending",
    date: "Apr 9, 2024 - 2:00 PM"
  },
]

const StatusIcon = ({ status }: { status: string }) => {
  switch (status) {
    case 'Completed':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />
    case 'Pending':
      return <Clock className="h-4 w-4 text-yellow-600" />
    case 'Failed':
      return <XCircle className="h-4 w-4 text-red-600" />
    default:
      return null
  }
}

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Payments Management
          </h1>
          <p className="text-muted-foreground">
            Monitor transactions, manage payouts, and track revenue
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            Process Payouts
          </Button>
        </div>
      </div>

      {/* Stats */}
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
                <p className="text-xs text-accent">{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Transactions</CardTitle>
              <CardDescription>View and manage all payment transactions</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search transactions..." className="w-64 pl-10" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left text-sm text-muted-foreground">
                  <th className="pb-3 font-medium">Transaction ID</th>
                  <th className="pb-3 font-medium">Customer</th>
                  <th className="pb-3 font-medium">Course</th>
                  <th className="pb-3 font-medium">Amount</th>
                  <th className="pb-3 font-medium">Method</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <span className="font-mono text-sm">{txn.id}</span>
                    </td>
                    <td className="py-4">
                      <div>
                        <p className="text-sm font-medium">{txn.user}</p>
                        <p className="text-xs text-muted-foreground">{txn.email}</p>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm">{txn.course}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm font-semibold">{txn.amount}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm">{txn.method}</span>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={txn.status} />
                        <span className={`text-sm font-medium ${
                          txn.status === 'Completed' 
                            ? 'text-green-600'
                            : txn.status === 'Pending'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                        }`}>
                          {txn.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-muted-foreground">{txn.date}</span>
                    </td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Send Receipt</DropdownMenuItem>
                          {txn.status === 'Pending' && (
                            <DropdownMenuItem>Verify Payment</DropdownMenuItem>
                          )}
                          {txn.status === 'Failed' && (
                            <DropdownMenuItem>Retry Payment</DropdownMenuItem>
                          )}
                          <DropdownMenuItem className="text-destructive">
                            Refund
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing 1-8 of 156 transactions
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
