'use client'

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Play, 
  Pause, 
  RotateCcw,
  Bell,
  Users,
  GraduationCap,
  FileText,
  Bot,
  Plus,
  ChevronLeft,
  ChevronRight,
  Timer,
  Coffee,
  Coins
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { useStudentStore, ScheduleItem } from "@/lib/stores/student-store"

// Session type configuration
const SESSION_TYPES = {
  live_session: { 
    label: 'Live Session', 
    color: 'bg-blue-500', 
    textColor: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
    icon: GraduationCap,
    description: 'Virtual classroom session'
  },
  group_discussion: { 
    label: 'Group Discussion', 
    color: 'bg-purple-500', 
    textColor: 'text-purple-500',
    bgColor: 'bg-purple-500/10',
    icon: Users,
    description: 'Study circle with peers'
  },
  office_hours: { 
    label: 'Office Hours', 
    color: 'bg-green-500', 
    textColor: 'text-green-500',
    bgColor: 'bg-green-500/10',
    icon: Clock,
    description: 'Instructor Q&A time'
  },
  deadline: { 
    label: 'Deadline', 
    color: 'bg-red-500', 
    textColor: 'text-red-500',
    bgColor: 'bg-red-500/10',
    icon: FileText,
    description: 'Assignment or exam deadline'
  },
  pomodoro: { 
    label: 'Study Session', 
    color: 'bg-yellow-500', 
    textColor: 'text-yellow-500',
    bgColor: 'bg-yellow-500/10',
    icon: Timer,
    description: 'Student Success & Wellness Center study session'
  },
  bot_session: { 
    label: 'Mentorship Office', 
    color: 'bg-teal-500', 
    textColor: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    icon: Bot,
    description: 'Faculty Mentorship Office session'
  },
}

// Days of the week
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const FULL_DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

// Generate week dates
function getWeekDates(date: Date) {
  const startOfWeek = new Date(date)
  startOfWeek.setDate(date.getDate() - date.getDay())
  
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })
}

// Pomodoro Timer Component
function PomodoroTimer({ onComplete }: { onComplete: () => void }) {
  const [isRunning, setIsRunning] = useState(false)
  const [isBreak, setIsBreak] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60) // 25 minutes in seconds
  const [sessionsCompleted, setSessionsCompleted] = useState(0)

  const WORK_TIME = 25 * 60
  const BREAK_TIME = 5 * 60

  const toggleTimer = () => {
    setIsRunning(!isRunning)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setIsBreak(false)
    setTimeLeft(WORK_TIME)
  }

  const skipToBreak = () => {
    setIsBreak(true)
    setTimeLeft(BREAK_TIME)
    setIsRunning(true)
  }

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1)
      }, 1000)
    } else if (timeLeft === 0) {
      if (!isBreak) {
        // Work session completed
        setSessionsCompleted((s) => s + 1)
        onComplete()
        setIsBreak(true)
        setTimeLeft(BREAK_TIME)
      } else {
        // Break completed
        setIsBreak(false)
        setTimeLeft(WORK_TIME)
        setIsRunning(false)
      }
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, timeLeft, isBreak, onComplete])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const progress = isBreak 
    ? ((BREAK_TIME - timeLeft) / BREAK_TIME) * 100
    : ((WORK_TIME - timeLeft) / WORK_TIME) * 100

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-lg">
          {isBreak ? <Coffee className="h-5 w-5 text-green-500" /> : <Timer className="h-5 w-5 text-primary" />}
          Focus Advisor Pomodoro
        </CardTitle>
        <CardDescription>
          {isBreak 
            ? "Take a short break. You deserve it, my dear!" 
            : "Focus time! No dulling, keep your eyes on the prize!"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Timer Display */}
        <div className="flex flex-col items-center">
          <div className={`text-5xl font-bold font-mono ${isBreak ? 'text-green-500' : 'text-primary'}`}>
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <Badge variant="outline" className={`mt-2 ${isBreak ? 'bg-green-500/10 text-green-600' : 'bg-primary/10 text-primary'}`}>
            {isBreak ? 'Break Time' : 'Focus Time'}
          </Badge>
        </div>

        {/* Progress */}
        <Progress value={progress} className="h-2" />

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={resetTimer}
            className="h-10 w-10"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <Button
            size="lg"
            onClick={toggleTimer}
            className={`h-12 w-24 ${isBreak ? 'bg-green-500 hover:bg-green-600' : ''}`}
          >
            {isRunning ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </Button>
          {!isBreak && isRunning && (
            <Button
              variant="outline"
              size="icon"
              onClick={skipToBreak}
              className="h-10 w-10"
            >
              <Coffee className="h-4 w-4" />
            </Button>
          )}
        </div>

        {/* Sessions Counter */}
        <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
          <Coins className="h-4 w-4 text-accent" />
          <span>{sessionsCompleted} Pomodoro{sessionsCompleted !== 1 ? 's' : ''} completed (+{sessionsCompleted * 5} tokens)</span>
        </div>
      </CardContent>
    </Card>
  )
}

// Session Card Component
function SessionCard({ session, showDate = false }: { session: ScheduleItem & { date?: Date }; showDate?: boolean }) {
  const config = SESSION_TYPES[session.type] || SESSION_TYPES.live_session
  const Icon = config.icon

  return (
    <div className={`flex gap-3 p-3 rounded-lg border ${config.bgColor}`}>
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${config.color} text-white`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4 className="font-medium text-sm">{session.title}</h4>
            <p className="text-xs text-muted-foreground">{session.course}</p>
          </div>
          <Badge variant="outline" className={`${config.textColor} border-0 ${config.bgColor} text-xs shrink-0`}>
            {config.label}
          </Badge>
        </div>
        <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {session.time}
          </span>
          <span>{session.duration} min</span>
          {showDate && session.date && (
            <span>{FULL_DAYS[session.date.getDay()]}</span>
          )}
        </div>
      </div>
      <Button size="sm" variant="outline" className="shrink-0 self-center">
        <Bell className="h-3 w-3 mr-1" />
        Remind
      </Button>
    </div>
  )
}

export default function SchedulePage() {
  const { isOnboarded, todaySchedule, earnTokens } = useStudentStore()
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'week' | 'day' | 'list'>('week')

  const weekDates = getWeekDates(currentDate)
  const today = new Date()

  const handlePomodoroComplete = useCallback(() => {
    earnTokens(5, 'Completed a Pomodoro session with Focus Advisor', 'Pomodoro')
  }, [earnTokens])

  const navigateWeek = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setDate(currentDate.getDate() + (direction === 'next' ? 7 : -7))
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  // Generate some mock schedule for the week
  const generateWeekSchedule = (): (ScheduleItem & { date: Date })[] => {
    if (todaySchedule.length === 0) return []
    
    // Spread today's schedule across the week for demo
    return weekDates.flatMap((date, dayIndex) => {
      if (dayIndex === 0 || dayIndex === 6) return [] // Skip weekends
      if (dayIndex === today.getDay()) {
        return todaySchedule.map(s => ({ ...s, date }))
      }
      // Add some variety for other days
      if (dayIndex % 2 === 0 && todaySchedule[0]) {
        return [{ ...todaySchedule[0], date, id: `${todaySchedule[0].id}-${dayIndex}` }]
      }
      return []
    })
  }

  const weekSchedule = generateWeekSchedule()

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <CalendarIcon className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to view your schedule.
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
          <h1 className="text-2xl font-bold md:text-3xl">My Schedule</h1>
          <p className="text-muted-foreground mt-1">
            Manage your learning sessions and study time
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Session
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Calendar Area */}
        <div className="lg:col-span-2 space-y-6">
          {/* Session Type Legend */}
          <Card>
            <CardContent className="p-3">
              <div className="flex flex-wrap gap-3">
                {Object.entries(SESSION_TYPES).slice(0, 5).map(([key, config]) => (
                  <div key={key} className="flex items-center gap-2 text-xs">
                    <div className={`h-3 w-3 rounded-full ${config.color}`} />
                    <span className="text-muted-foreground">{config.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Calendar View */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle>
                  {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={goToToday}>
                    Today
                  </Button>
                  <div className="flex">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek('prev')}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigateWeek('next')}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as typeof viewMode)}>
                <TabsList className="mb-4">
                  <TabsTrigger value="week">Week</TabsTrigger>
                  <TabsTrigger value="day">Day</TabsTrigger>
                  <TabsTrigger value="list">List</TabsTrigger>
                </TabsList>

                <TabsContent value="week">
                  {/* Week Header */}
                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {weekDates.map((date, i) => {
                      const isToday = date.toDateString() === today.toDateString()
                      const hasEvents = weekSchedule.some(s => s.date.toDateString() === date.toDateString())
                      
                      return (
                        <div 
                          key={i} 
                          className={`text-center p-2 rounded-lg cursor-pointer transition-colors ${
                            isToday 
                              ? 'bg-primary text-primary-foreground' 
                              : hasEvents 
                                ? 'bg-accent/10 hover:bg-accent/20'
                                : 'hover:bg-muted'
                          }`}
                          onClick={() => {
                            setCurrentDate(date)
                            setViewMode('day')
                          }}
                        >
                          <p className="text-xs font-medium">{DAYS[i]}</p>
                          <p className={`text-lg font-bold ${isToday ? '' : 'text-foreground'}`}>
                            {date.getDate()}
                          </p>
                          {hasEvents && !isToday && (
                            <div className="flex justify-center gap-0.5 mt-1">
                              <div className="h-1 w-1 rounded-full bg-primary" />
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>

                  {/* Week Events */}
                  <div className="space-y-2 mt-4">
                    {weekSchedule.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No sessions scheduled this week</p>
                        <p className="text-sm">Enroll in courses to see your schedule</p>
                      </div>
                    ) : (
                      weekSchedule.map((session) => (
                        <SessionCard key={session.id} session={session} showDate />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="day">
                  <div className="text-center mb-4">
                    <p className="text-lg font-semibold">
                      {currentDate.toLocaleDateString('en-US', { 
                        weekday: 'long', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                  <div className="space-y-2">
                    {todaySchedule.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No sessions scheduled for today</p>
                        <p className="text-sm">Use Focus Advisor Pomodoro to study!</p>
                      </div>
                    ) : (
                      todaySchedule.map((session) => (
                        <SessionCard key={session.id} session={session} />
                      ))
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="list">
                  <div className="space-y-2">
                    {weekSchedule.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground">
                        <CalendarIcon className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>No upcoming sessions</p>
                      </div>
                    ) : (
                      weekSchedule
                        .sort((a, b) => a.date.getTime() - b.date.getTime())
                        .map((session) => (
                          <SessionCard key={session.id} session={session} showDate />
                        ))
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pomodoro Timer */}
          <PomodoroTimer onComplete={handlePomodoroComplete} />

          {/* Today's Summary */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Today&apos;s Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Sessions</span>
                <span className="font-bold">{todaySchedule.length}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Total Duration</span>
                <span className="font-bold">
                  {todaySchedule.reduce((acc, s) => acc + s.duration, 0)} min
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <span className="text-sm">Live Sessions</span>
                <span className="font-bold">
                  {todaySchedule.filter(s => s.type === 'live_session').length}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Focus Advisor Tips */}
          <Card className="bg-teal-500/5 border-teal-500/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5 text-teal-500" />
                Focus Advisor Says
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground italic">
                &ldquo;My dear, use the Pomodoro timer well well! 25 minutes of focus, 
                then 5 minutes rest. Every completed session earns you 5 tokens. 
                No dulling today!&rdquo;
              </p>
              <Button variant="outline" size="sm" className="w-full mt-3" asChild>
                <Link href="/dashboard/messages">
                  Visit Wellness Center
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
