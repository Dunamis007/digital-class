import { Metadata } from "next"
import { 
  Users, 
  UserPlus,
  GraduationCap,
  ShieldCheck,
  Download,
  Filter,
  Search,
  MoreHorizontal,
  Mail,
  Ban
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
  title: "Users Management | Dunamis EdTech Admin",
  description: "Manage students, instructors, and admin users.",
}

const stats = [
  { label: "Total Users", value: "12,847", change: "+245 this week", icon: Users },
  { label: "Students", value: "11,892", change: "+220 this week", icon: GraduationCap },
  { label: "Instructors", value: "89", change: "+3 this week", icon: UserPlus },
  { label: "Admins", value: "12", change: "No change", icon: ShieldCheck },
]

const users = [
  { 
    id: "USR001",
    name: "Adebayo Johnson",
    email: "adebayo@email.com",
    role: "Student",
    courses: 3,
    status: "Active",
    joined: "Jan 15, 2024",
    lastActive: "2 hours ago"
  },
  { 
    id: "USR002",
    name: "Dr. Kemi Adebola",
    email: "kemi@email.com",
    role: "Instructor",
    courses: 4,
    status: "Active",
    joined: "Mar 20, 2023",
    lastActive: "1 hour ago"
  },
  { 
    id: "USR003",
    name: "Chioma Nwosu",
    email: "chioma@email.com",
    role: "Student",
    courses: 2,
    status: "Active",
    joined: "Feb 8, 2024",
    lastActive: "5 hours ago"
  },
  { 
    id: "USR004",
    name: "Emeka Obi",
    email: "emeka@email.com",
    role: "Instructor",
    courses: 6,
    status: "Active",
    joined: "Nov 12, 2022",
    lastActive: "30 min ago"
  },
  { 
    id: "USR005",
    name: "Fatima Abdullahi",
    email: "fatima@email.com",
    role: "Student",
    courses: 1,
    status: "Inactive",
    joined: "Apr 1, 2024",
    lastActive: "2 weeks ago"
  },
  { 
    id: "USR006",
    name: "Oluwaseun Adeyemi",
    email: "seun@email.com",
    role: "Student",
    courses: 4,
    status: "Active",
    joined: "Dec 5, 2023",
    lastActive: "1 day ago"
  },
  { 
    id: "USR007",
    name: "Ibrahim Musa",
    email: "ibrahim@email.com",
    role: "Admin",
    courses: 0,
    status: "Active",
    joined: "Jun 15, 2022",
    lastActive: "Online"
  },
  { 
    id: "USR008",
    name: "Ngozi Eze",
    email: "ngozi@email.com",
    role: "Student",
    courses: 2,
    status: "Suspended",
    joined: "Mar 10, 2024",
    lastActive: "1 month ago"
  },
]

const RoleBadge = ({ role }: { role: string }) => {
  const styles = {
    Student: "bg-blue-100 text-blue-700",
    Instructor: "bg-purple-100 text-purple-700",
    Admin: "bg-red-100 text-red-700",
  }
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[role as keyof typeof styles]}`}>
      {role}
    </span>
  )
}

const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    Active: "bg-green-100 text-green-700",
    Inactive: "bg-gray-100 text-gray-700",
    Suspended: "bg-red-100 text-red-700",
  }
  return (
    <span className={`rounded-full px-2 py-1 text-xs font-medium ${styles[status as keyof typeof styles]}`}>
      {status}
    </span>
  )
}

export default function UsersPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Users Management
          </h1>
          <p className="text-muted-foreground">
            Manage students, instructors, and administrators
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90">
            <UserPlus className="mr-2 h-4 w-4" /> Add User
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

      {/* Users Table */}
      <Card>
        <CardHeader>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>All Users</CardTitle>
              <CardDescription>View and manage all platform users</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search users..." className="w-64 pl-10" />
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
                  <th className="pb-3 font-medium">User</th>
                  <th className="pb-3 font-medium">Role</th>
                  <th className="pb-3 font-medium">Courses</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Joined</th>
                  <th className="pb-3 font-medium">Last Active</th>
                  <th className="pb-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-medium text-primary-foreground">
                          {user.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{user.name}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4">
                      <RoleBadge role={user.role} />
                    </td>
                    <td className="py-4">
                      <span className="text-sm">{user.courses}</span>
                    </td>
                    <td className="py-4">
                      <StatusBadge status={user.status} />
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-muted-foreground">{user.joined}</span>
                    </td>
                    <td className="py-4">
                      <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                    </td>
                    <td className="py-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>View Profile</DropdownMenuItem>
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" /> Send Email
                          </DropdownMenuItem>
                          {user.status !== 'Suspended' ? (
                            <DropdownMenuItem className="text-destructive">
                              <Ban className="mr-2 h-4 w-4" /> Suspend
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600">
                              Reactivate
                            </DropdownMenuItem>
                          )}
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
              Showing 1-8 of 12,847 users
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
