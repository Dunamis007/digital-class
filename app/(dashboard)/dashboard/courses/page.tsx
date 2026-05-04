'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  Trophy,
  ChevronRight,
  Search,
  Filter,
  GraduationCap
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  useStudentStore, 
  EnrolledCourse 
} from "@/lib/stores/student-store"

function CourseCard({ course, onContinue }: { course: EnrolledCourse; onContinue?: () => void }) {
  const statusColors = {
    in_progress: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    completed: 'bg-green-500/10 text-green-500 border-green-500/20',
    not_started: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  }

  const statusLabels = {
    in_progress: 'In Progress',
    completed: 'Completed',
    not_started: 'Not Started',
  }

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardContent className="p-0">
        {/* Course Image Placeholder */}
        <div className="h-32 bg-gradient-to-br from-primary/20 to-accent/20 rounded-t-lg flex items-center justify-center">
          <BookOpen className="h-12 w-12 text-primary/50" />
        </div>
        
        <div className="p-4 space-y-3">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className={statusColors[course.status]}>
              {statusLabels[course.status]}
            </Badge>
            <span className="text-xs text-muted-foreground">{course.code}</span>
          </div>

          {/* Title & Instructor */}
          <div>
            <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{course.instructor}</p>
          </div>

          {/* Progress */}
          {course.status !== 'not_started' && (
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            </div>
          )}

          {/* Next Lesson */}
          {course.status === 'in_progress' && (
            <div className="rounded-lg bg-muted/50 p-2">
              <p className="text-xs text-muted-foreground">Next lesson:</p>
              <p className="text-sm font-medium line-clamp-1">{course.nextLesson}</p>
            </div>
          )}

          {/* Credit Units */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Credit Units</span>
            <span className="font-medium">{course.creditUnits}</span>
          </div>

          {/* Action Button */}
          <Button 
            className="w-full" 
            variant={course.status === 'completed' ? 'outline' : 'default'}
            asChild
          >
            <Link href={`/dashboard/courses/${course.id}`}>
              {course.status === 'completed' ? (
                <>
                  <Trophy className="mr-2 h-4 w-4" />
                  Review Course
                </>
              ) : course.status === 'in_progress' ? (
                <>
                  <Play className="mr-2 h-4 w-4" />
                  Continue
                </>
              ) : (
                <>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Start Course
                </>
              )}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function MyCoursesPage() {
  const { enrolledCourses, isOnboarded } = useStudentStore()
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCourses = enrolledCourses.filter(course =>
    course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const inProgressCourses = filteredCourses.filter(c => c.status === 'in_progress')
  const completedCourses = filteredCourses.filter(c => c.status === 'completed')
  const notStartedCourses = filteredCourses.filter(c => c.status === 'not_started')

  // Stats
  const totalCredits = enrolledCourses.reduce((acc, c) => acc + c.creditUnits, 0)
  const completedCredits = completedCourses.reduce((acc, c) => acc + c.creditUnits, 0)
  const overallProgress = enrolledCourses.length > 0
    ? Math.round(enrolledCourses.reduce((acc, c) => acc + c.progress, 0) / enrolledCourses.length)
    : 0

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <GraduationCap className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to access your courses.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/onboarding">Start Enrollment</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold md:text-3xl">My Courses</h1>
          <p className="text-muted-foreground mt-1">
            Manage and continue your enrolled courses
          </p>
        </div>
        <Button asChild>
          <Link href="/courses">
            Browse More Courses
            <ChevronRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <BookOpen className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledCourses.length}</p>
              <p className="text-sm text-muted-foreground">Total Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-500/10">
              <Clock className="h-5 w-5 text-yellow-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{inProgressCourses.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses.length}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Trophy className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCredits}/{totalCredits}</p>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search courses by title, code, or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Courses Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList>
          <TabsTrigger value="all">
            All ({filteredCourses.length})
          </TabsTrigger>
          <TabsTrigger value="in-progress">
            In Progress ({inProgressCourses.length})
          </TabsTrigger>
          <TabsTrigger value="completed">
            Completed ({completedCourses.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {filteredCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No courses found</h3>
                <p className="text-muted-foreground text-center mb-4">
                  {searchQuery ? 'Try a different search term' : 'You haven\'t enrolled in any courses yet'}
                </p>
                <Button asChild>
                  <Link href="/courses">Browse Courses</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="in-progress" className="space-y-6">
          {inProgressCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No courses in progress</h3>
                <p className="text-muted-foreground text-center">
                  Start a new course to see it here
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {inProgressCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-6">
          {completedCourses.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <CheckCircle2 className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="font-semibold mb-2">No completed courses yet</h3>
                <p className="text-muted-foreground text-center">
                  Keep learning to complete your first course!
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {completedCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
