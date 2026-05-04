'use client'

import { useEffect, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { 
  BookOpen, 
  Award, 
  TrendingUp, 
  Play, 
  ChevronRight,
  Calendar,
  CheckCircle2,
  Loader2,
  Coins,
  Flame,
  GraduationCap,
  Zap,
  Trophy
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  useStudentStore, 
  getTokenLevelDisplay, 
  getProgressToNextLevel,
  MOCK_FACULTIES,
  MOCK_DEPARTMENTS 
} from "@/lib/stores/student-store"
import { TOKEN_LEVEL_NAMES } from "@/lib/types/school-system"
import { TalkingAvatarFace } from "@/components/learning/TalkingAvatarFace"

export default function StudentDashboard() {
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [missionsText, setMissionsText] = useState('')
  
  const {
    isOnboarded,
    fullName,
    studentId,
    currentTokens,
    tokenLevel,
    currentCgpa,
    loginStreak,
    totalLessonsCompleted,
    enrolledCourses,
    todaySchedule,
    achievements,
    facultyId,
    departmentId,
    updateLoginStreak,
  } = useStudentStore()

  const levelDisplay = getTokenLevelDisplay(tokenLevel)
  const levelProgress = getProgressToNextLevel(currentTokens)
  const inProgressCourses = enrolledCourses.filter(c => c.status === 'in_progress')
  const unlockedAchievements = achievements.filter(a => !a.isLocked)

  const learningEnergy = useMemo(() => {
    const base = Math.min(3, totalLessonsCompleted % 10) * 22
    const streak = loginStreak > 0 ? 24 : 0
    return Math.min(100, base + streak + (currentCgpa >= 3 ? 20 : 0))
  }, [totalLessonsCompleted, loginStreak, currentCgpa])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && isOnboarded) {
      updateLoginStreak()
    }
  }, [mounted, isOnboarded, updateLoginStreak])

  useEffect(() => {
    const c = inProgressCourses[0]
    if (!c) return
    fetch('/api/ollama/daily-missions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ course: c.title, department: MOCK_DEPARTMENTS.find(d => d.id === departmentId)?.name || 'General' }),
    })
      .then((r) => r.json())
      .then(data => setMissionsText(data.missions || ''))
      .catch(() => {})
  }, [inProgressCourses, departmentId])

  // Show loading while hydrating
  if (!mounted) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  // Redirect to onboarding if not onboarded
  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <GraduationCap className="h-8 w-8 text-primary" />
            </div>
            <CardTitle className="text-2xl">Welcome to Dunamis EdTech!</CardTitle>
            <CardDescription>
              Complete your enrollment to access your personalized learning dashboard and start earning tokens.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button size="lg" className="w-full" onClick={() => router.push('/dashboard/onboarding')}>
              Start Enrollment
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              You&apos;ll receive 100 welcome tokens upon completion!
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const faculty = MOCK_FACULTIES.find(f => f.id === facultyId)
  const department = MOCK_DEPARTMENTS.find(d => d.id === departmentId)

  const stats = [
    { 
      label: "EduCoin balance", 
      value: currentTokens.toLocaleString(), 
      icon: Coins, 
      change: levelDisplay.name,
      color: levelDisplay.color,
    },
    { 
      label: "CGPA", 
      value: currentCgpa > 0 ? currentCgpa.toFixed(2) : "—", 
      icon: Award, 
      change: currentCgpa > 0 ? "All semesters" : "Complete assessments",
      color: "text-purple-500",
    },
    { 
      label: "Lessons Completed", 
      value: totalLessonsCompleted.toString(), 
      icon: CheckCircle2, 
      change: "Keep it up!",
      color: "text-green-500",
    },
    { 
      label: "Login Streak", 
      value: loginStreak.toString(), 
      icon: Flame, 
      change: `${loginStreak} day${loginStreak !== 1 ? 's' : ''} streak`,
      color: "text-orange-500",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">
            Welcome back, {fullName.split(' ')[0]}!
          </h1>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">NeuroPulse Hub</p>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <span>{studentId}</span>
            <span className="text-border">|</span>
            <span>{department?.name || 'Department'}</span>
            <span className="text-border">|</span>
            <Badge variant="outline" className={`${levelDisplay.color} ${levelDisplay.bgColor} border-0`}>
              {levelDisplay.name}
            </Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/dashboard/messages">
              Visit Student Council
            </Link>
          </Button>
          <Button className="bg-accent text-accent-foreground hover:bg-accent/90" asChild>
            <Link href="/courses">
              Explore Courses
            </Link>
          </Button>
        </div>
      </div>

      {/* Token Level Progress */}
      {levelProgress.nextLevel && (
        <Card className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/20">
          <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${levelDisplay.bgColor}`}>
                <Trophy className={`h-6 w-6 ${levelDisplay.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium">Progress to {TOKEN_LEVEL_NAMES[levelProgress.nextLevel]}</p>
                <p className="text-xs text-muted-foreground">
                  {levelProgress.tokensToNext.toLocaleString()} EduCoins to go
                </p>
              </div>
            </div>
            <div className="flex flex-1 items-center gap-3 sm:max-w-xs">
              <Progress value={levelProgress.progress} className="flex-1" />
              <span className="text-sm font-medium">{levelProgress.progress}%</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${stat.color.replace('text-', 'bg-')}/10`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className={`text-xs ${stat.color}`}>{stat.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-accent" />
            NeuroPulse — today
          </CardTitle>
          <CardDescription>Dopamine-friendly pacing; missions from local Ollama when online.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Learning energy</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span aria-hidden>🔋</span>
              <Progress value={learningEnergy} className="h-2 flex-1" />
              <span className="tabular-nums">{learningEnergy}%</span>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Daily missions</p>
            <div className="space-y-2 text-xs text-muted-foreground whitespace-pre-wrap">
              {missionsText ? (
                missionsText.split('\n').slice(0, 5).map((line) => (
                  <p key={line} className="rounded-md border border-border bg-muted/20 p-2 text-foreground">
                    {line}
                  </p>
                ))
              ) : (
                <p>Open a course to generate missions, or start Ollama for live suggestions.</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm font-medium">Knowledge matrix</p>
            <div className="flex flex-wrap gap-3">
              {inProgressCourses.slice(0, 3).map((course) => (
                <Link
                  key={course.id}
                  href={`/dashboard/courses/${course.id}`}
                  className="group flex flex-col items-center gap-1 rounded-lg border border-border p-2 text-center text-xs w-[100px]"
                >
                  <div className="scale-[0.45] origin-center transition group-hover:scale-[0.48]">
                    <TalkingAvatarFace variant="dr_amara" asStatic />
                  </div>
                  <span className="line-clamp-2 font-medium">{course.title}</span>
                  <span className="text-muted-foreground">{course.progress}%</span>
                </Link>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Continue Learning */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Continue Learning</CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/courses">
                  View All <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {inProgressCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                  <h3 className="font-semibold text-lg mb-2">No Courses Yet!</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Every legend started somewhere. Explore our courses and begin your Dunamis journey today!
                  </p>
                  <Button className="mt-4" asChild>
                    <Link href="/courses">
                      Explore Courses
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              ) : (
                inProgressCourses.slice(0, 3).map((course) => (
                  <div
                    key={course.id}
                    className="flex flex-col gap-4 rounded-lg border border-border p-4 sm:flex-row sm:items-center"
                  >
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <BookOpen className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold">{course.title}</h3>
                          <p className="text-xs text-muted-foreground">{course.code} - {course.instructor}</p>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          {course.completedLessons}/{course.totalLessons} lessons
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Next: {course.nextLesson}
                      </p>
                      <div className="flex items-center gap-3">
                        <Progress value={course.progress} className="flex-1" />
                        <span className="text-sm font-medium">{course.progress}%</span>
                      </div>
                    </div>
                    <Button size="sm" className="shrink-0" asChild>
                      <Link href={`/dashboard/courses/${course.id}`}>
                        <Play className="mr-1 h-4 w-4" /> Continue
                      </Link>
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Today's Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Today&apos;s Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {todaySchedule.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">No events scheduled for today</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enroll in courses to see your schedule
                  </p>
                </div>
              ) : (
                todaySchedule.map((item) => (
                  <div key={item.id} className="flex gap-3 rounded-lg border border-border p-3">
                    <div className="text-sm font-medium text-accent">{item.time}</div>
                    <div>
                      <p className="text-sm font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">{item.course}</p>
                    </div>
                  </div>
                ))
              )}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/schedule">
                  View Full Schedule
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Recent Achievements */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {unlockedAchievements.slice(0, 3).map((achievement) => (
                <div key={achievement.id} className="flex items-start gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10">
                    <Zap className="h-4 w-4 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{achievement.title}</p>
                    <p className="text-xs text-muted-foreground">{achievement.description}</p>
                  </div>
                </div>
              ))}
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link href="/dashboard/progress">
                  View All Achievements
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
