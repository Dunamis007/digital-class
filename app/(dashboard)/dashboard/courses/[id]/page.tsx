'use client'

import { useState, use, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { 
  BookOpen, 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft,
  Video,
  FileText,
  Lock,
  Coins,
  Award,
  MessageSquare,
  AlertTriangle,
  Timer
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useStudentStore } from "@/lib/stores/student-store"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// Mock lessons for the course
const MOCK_LESSONS = [
  { id: 'l1', title: 'Introduction to the Course', duration: '15 min', type: 'video', completed: true },
  { id: 'l2', title: 'Setting Up Your Environment', duration: '25 min', type: 'video', completed: true },
  { id: 'l3', title: 'Core Concepts Overview', duration: '30 min', type: 'video', completed: true },
  { id: 'l4', title: 'Hands-on Practice Session 1', duration: '45 min', type: 'video', completed: false },
  { id: 'l5', title: 'Understanding Key Principles', duration: '35 min', type: 'video', completed: false },
  { id: 'l6', title: 'Advanced Techniques', duration: '40 min', type: 'video', completed: false },
  { id: 'l7', title: 'Project: Building Your First App', duration: '60 min', type: 'project', completed: false },
  { id: 'l8', title: 'Quiz: Module 1 Assessment', duration: '20 min', type: 'quiz', completed: false },
]

interface TrialInfo {
  courseId: string
  courseTitle: string
  trialStart: string
  trialEnd: string
  status: string
}

export default function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const { enrolledCourses, completeLesson, earnTokens } = useStudentStore()
  const [activeLesson, setActiveLesson] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [trialInfo, setTrialInfo] = useState<TrialInfo | null>(null)
  const [daysRemaining, setDaysRemaining] = useState<number>(0)
  const [hoursRemaining, setHoursRemaining] = useState<number>(0)

  const course = enrolledCourses.find(c => c.id === resolvedParams.id)

  // Check for trial status
  useEffect(() => {
    const storedTrial = localStorage.getItem('trial_course')
    if (storedTrial) {
      try {
        const trial = JSON.parse(storedTrial) as TrialInfo
        if (trial.courseId === resolvedParams.id) {
          setTrialInfo(trial)
          
          // Calculate remaining time
          const now = new Date()
          const trialEnd = new Date(trial.trialEnd)
          const diffMs = trialEnd.getTime() - now.getTime()
          
          if (diffMs > 0) {
            const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
            const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
            setDaysRemaining(diffDays)
            setHoursRemaining(diffHours)
          } else {
            // Trial expired
            setTrialInfo({ ...trial, status: 'trial_expired' })
          }
        }
      } catch (err) {
        console.error('[v0] Error parsing trial info:', err)
      }
    }
  }, [resolvedParams.id])

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>
              This course doesn&apos;t exist or you&apos;re not enrolled.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" asChild>
              <Link href="/dashboard/courses">Back to My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const completedCount = MOCK_LESSONS.filter(l => l.completed).length
  const currentLesson = MOCK_LESSONS.find(l => !l.completed) || MOCK_LESSONS[0]

  const handleCompleteLesson = () => {
    completeLesson(course.id)
    setIsPlaying(false)
    setActiveLesson(null)
  }

  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/courses">
            <ChevronLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="outline">{course.code}</Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {course.creditUnits} Credits
            </Badge>
          </div>
          <h1 className="text-2xl font-bold">{course.title}</h1>
          <p className="text-muted-foreground">{course.instructor}</p>
        </div>
      </div>

      {/* Progress Card */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Course Progress</span>
                <span className="text-sm font-bold">{course.progress}%</span>
              </div>
              <Progress value={course.progress} className="h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {course.completedLessons} of {course.totalLessons} lessons completed
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link href="/dashboard/messages">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Visit Student Council
                </Link>
              </Button>
              <Button onClick={() => setActiveLesson(currentLesson.id)}>
                <Play className="mr-2 h-4 w-4" />
                Continue Learning
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content Area */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="lessons" className="space-y-4">
            <TabsList>
              <TabsTrigger value="lessons">Lessons</TabsTrigger>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
            </TabsList>

            <TabsContent value="lessons">
              {activeLesson ? (
                // Lesson Player
                <Card>
                  <CardContent className="p-0">
                    {/* Video Player Placeholder */}
                    <div className="aspect-video bg-black rounded-t-lg flex items-center justify-center">
                      {isPlaying ? (
                        <div className="text-white text-center">
                          <Video className="h-16 w-16 mx-auto mb-4 animate-pulse" />
                          <p className="text-lg font-medium">Lesson Playing...</p>
                          <p className="text-sm text-white/70">
                            {MOCK_LESSONS.find(l => l.id === activeLesson)?.title}
                          </p>
                        </div>
                      ) : (
                        <Button 
                          size="lg" 
                          className="gap-2"
                          onClick={() => setIsPlaying(true)}
                        >
                          <Play className="h-6 w-6" />
                          Start Lesson
                        </Button>
                      )}
                    </div>
                    <div className="p-4 space-y-4">
                      <h3 className="font-semibold text-lg">
                        {MOCK_LESSONS.find(l => l.id === activeLesson)?.title}
                      </h3>
                      <div className="flex gap-2">
                        <Button variant="outline" onClick={() => {
                          setActiveLesson(null)
                          setIsPlaying(false)
                        }}>
                          Back to Lessons
                        </Button>
                        {isPlaying && (
                          <Button onClick={handleCompleteLesson} className="bg-green-600 hover:bg-green-700">
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Complete (+15 tokens)
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                // Lessons List
                <Card>
                  <CardHeader>
                    <CardTitle>Course Lessons</CardTitle>
                    <CardDescription>
                      Complete lessons to earn tokens and progress
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[400px] pr-4">
                      <div className="space-y-2">
                        {MOCK_LESSONS.map((lesson, index) => {
                          const isLocked = index > 0 && !MOCK_LESSONS[index - 1].completed && !lesson.completed
                          const isCurrent = !lesson.completed && (index === 0 || MOCK_LESSONS[index - 1].completed)
                          
                          return (
                            <div
                              key={lesson.id}
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                                lesson.completed 
                                  ? 'bg-green-500/5 border-green-500/20' 
                                  : isCurrent
                                    ? 'bg-primary/5 border-primary/20'
                                    : isLocked
                                      ? 'bg-muted/50 border-muted'
                                      : 'border-border hover:bg-muted/50'
                              }`}
                            >
                              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                                lesson.completed
                                  ? 'bg-green-500 text-white'
                                  : isCurrent
                                    ? 'bg-primary text-primary-foreground'
                                    : 'bg-muted text-muted-foreground'
                              }`}>
                                {lesson.completed ? (
                                  <CheckCircle2 className="h-4 w-4" />
                                ) : isLocked ? (
                                  <Lock className="h-4 w-4" />
                                ) : (
                                  index + 1
                                )}
                              </div>
                              <div className="flex-1">
                                <p className={`font-medium ${isLocked ? 'text-muted-foreground' : ''}`}>
                                  {lesson.title}
                                </p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {lesson.type === 'video' && <Video className="h-3 w-3" />}
                                  {lesson.type === 'quiz' && <FileText className="h-3 w-3" />}
                                  {lesson.type === 'project' && <BookOpen className="h-3 w-3" />}
                                  <span>{lesson.duration}</span>
                                  {lesson.completed && (
                                    <Badge variant="outline" className="text-[10px] px-1 py-0 bg-green-500/10 text-green-600 border-0">
                                      Completed
                                    </Badge>
                                  )}
                                </div>
                              </div>
                              {!isLocked && !lesson.completed && (
                                <Button 
                                  size="sm" 
                                  variant={isCurrent ? 'default' : 'outline'}
                                  onClick={() => setActiveLesson(lesson.id)}
                                >
                                  {isCurrent ? 'Start' : 'Preview'}
                                </Button>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="overview">
              <Card>
                <CardHeader>
                  <CardTitle>Course Overview</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">About this course</h4>
                    <p className="text-muted-foreground">
                      This comprehensive course covers all the essential concepts and practical skills 
                      you need to master {course.title}. Through hands-on projects and real-world examples, 
                      you&apos;ll gain the knowledge and confidence to apply what you&apos;ve learned.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">What you&apos;ll learn</h4>
                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                      <li>Core concepts and fundamentals</li>
                      <li>Practical implementation techniques</li>
                      <li>Industry best practices</li>
                      <li>Real-world project experience</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Instructor</h4>
                    <p className="text-muted-foreground">{course.instructor}</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="resources">
              <Card>
                <CardHeader>
                  <CardTitle>Course Resources</CardTitle>
                  <CardDescription>Download materials and supplementary content</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Course Slides</p>
                        <p className="text-xs text-muted-foreground">PDF - 2.5 MB</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Practice Exercises</p>
                        <p className="text-xs text-muted-foreground">PDF - 1.2 MB</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg border">
                      <FileText className="h-5 w-5 text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">Additional Reading</p>
                        <p className="text-xs text-muted-foreground">PDF - 800 KB</p>
                      </div>
                      <Button variant="outline" size="sm">Download</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Token Rewards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="h-5 w-5 text-accent" />
                Token Rewards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Per Lesson</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">+15</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Quiz Pass</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">+25</Badge>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Course Completion</span>
                <Badge variant="outline" className="bg-green-500/10 text-green-600 border-0">+100</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Course Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Course Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Lessons</span>
                <span className="font-medium">{course.totalLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Completed</span>
                <span className="font-medium">{course.completedLessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Credit Units</span>
                <span className="font-medium">{course.creditUnits}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Status</span>
                <Badge variant="outline">
                  {course.status === 'completed' ? 'Completed' : 'In Progress'}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Certificate */}
          {course.status === 'completed' && (
            <Card className="bg-gradient-to-br from-accent/10 to-primary/10 border-accent/20">
              <CardContent className="p-4 text-center">
                <Award className="h-12 w-12 mx-auto text-accent mb-3" />
                <h3 className="font-semibold mb-1">Certificate Earned!</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  You&apos;ve completed this course
                </p>
                <Button className="w-full" asChild>
                  <Link href="/dashboard/certificates">View Certificate</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
