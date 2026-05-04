'use client'

import { useState } from "react"
import Link from "next/link"
import { 
  Award, 
  TrendingUp, 
  Coins,
  Flame,
  BookOpen,
  CheckCircle2,
  Trophy,
  Target,
  Zap,
  Star,
  Users,
  Crown,
  Sparkles,
  Calendar,
  BarChart3,
  ArrowUp,
  ArrowDown
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  useStudentStore, 
  getTokenLevelDisplay, 
  getProgressToNextLevel,
  MOCK_FACULTIES,
  MOCK_DEPARTMENTS 
} from "@/lib/stores/student-store"
import { TOKEN_LEVEL_NAMES } from "@/lib/types/school-system"

// Achievement icons mapping
const achievementIcons: Record<string, React.ElementType> = {
  zap: Zap,
  brain: BookOpen,
  sunrise: Calendar,
  flame: Flame,
  star: Star,
  trophy: Trophy,
  users: Users,
  gem: Sparkles,
}

// Mock semester grades for CGPA
const MOCK_SEMESTERS = [
  { id: 's1', name: '100 Level - 1st Semester', gpa: 3.75, credits: 18, year: '2023/2024' },
  { id: 's2', name: '100 Level - 2nd Semester', gpa: 3.50, credits: 20, year: '2023/2024' },
  { id: 's3', name: '200 Level - 1st Semester', gpa: 3.85, credits: 21, year: '2024/2025' },
]

// Mock leaderboard data
const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Adaeze Okonkwo', tokens: 12500, level: 'campus_champion', dept: 'Computer Science', avatar: 'AO' },
  { rank: 2, name: 'Chukwuemeka Eze', tokens: 11200, level: 'campus_champion', dept: 'Software Engineering', avatar: 'CE' },
  { rank: 3, name: 'Ngozi Adeyemi', tokens: 9800, level: 'campus_champion', dept: 'Cybersecurity', avatar: 'NA' },
  { rank: 4, name: 'Olumide Bakare', tokens: 8500, level: 'campus_champion', dept: 'Data Science', avatar: 'OB' },
  { rank: 5, name: 'Fatima Mohammed', tokens: 7200, level: 'campus_champion', dept: 'AI', avatar: 'FM' },
  { rank: 6, name: 'Emeka Obi', tokens: 6100, level: 'campus_champion', dept: 'Computer Science', avatar: 'EO' },
  { rank: 7, name: 'Blessing Nwankwo', tokens: 5500, level: 'campus_champion', dept: 'Software Engineering', avatar: 'BN' },
  { rank: 8, name: 'Ibrahim Yusuf', tokens: 4800, level: 'rising_scholar', dept: 'Cybersecurity', avatar: 'IY' },
  { rank: 9, name: 'Chidinma Okoli', tokens: 4200, level: 'rising_scholar', dept: 'Data Science', avatar: 'CO' },
  { rank: 10, name: 'Tunde Afolabi', tokens: 3800, level: 'rising_scholar', dept: 'AI', avatar: 'TA' },
]

export default function ProgressPage() {
  const [leaderboardFilter, setLeaderboardFilter] = useState<'global' | 'faculty' | 'department'>('global')
  
  const {
    isOnboarded,
    fullName,
    currentTokens,
    tokenLevel,
    currentCgpa,
    totalLessonsCompleted,
    totalQuizzesPassed,
    loginStreak,
    longestStreak,
    tokensEarnedAllTime,
    tokensLostAllTime,
    tokenTransactions,
    achievements,
    enrolledCourses,
    facultyId,
    departmentId,
  } = useStudentStore()

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to track your progress.
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

  const faculty = MOCK_FACULTIES.find(f => f.id === facultyId)
  const department = MOCK_DEPARTMENTS.find(d => d.id === departmentId)
  const levelDisplay = getTokenLevelDisplay(tokenLevel)
  const levelProgress = getProgressToNextLevel(currentTokens)

  // Calculate CGPA from mock semesters
  const totalQualityPoints = MOCK_SEMESTERS.reduce((acc, s) => acc + (s.gpa * s.credits), 0)
  const totalCredits = MOCK_SEMESTERS.reduce((acc, s) => acc + s.credits, 0)
  const calculatedCgpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0

  // Get user's rank in leaderboard (mock)
  const userRank = Math.floor(Math.random() * 50) + 15 // Random rank between 15-65

  const unlockedAchievements = achievements.filter(a => !a.isLocked)
  const lockedAchievements = achievements.filter(a => a.isLocked)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Progress</h1>
        <p className="text-muted-foreground mt-1">
          Track your academic journey and achievements
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-full ${levelDisplay.bgColor}`}>
                <Coins className={`h-6 w-6 ${levelDisplay.color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{currentTokens.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">Total Tokens</p>
                <Badge variant="outline" className={`mt-1 ${levelDisplay.color} ${levelDisplay.bgColor} border-0 text-xs`}>
                  {levelDisplay.name}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500/10">
                <Award className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{calculatedCgpa.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Current CGPA</p>
                <p className="text-xs text-purple-500">{totalCredits} credits earned</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500/10">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{loginStreak}</p>
                <p className="text-sm text-muted-foreground">Day Streak</p>
                <p className="text-xs text-orange-500">Best: {longestStreak} days</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalLessonsCompleted}</p>
                <p className="text-sm text-muted-foreground">Lessons Done</p>
                <p className="text-xs text-green-500">{totalQuizzesPassed} quizzes passed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Token Level Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-accent" />
            Token Level Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className={`flex h-16 w-16 items-center justify-center rounded-full ${levelDisplay.bgColor}`}>
                <Crown className={`h-8 w-8 ${levelDisplay.color}`} />
              </div>
              <div>
                <p className="font-semibold text-lg">{levelDisplay.name}</p>
                <p className="text-sm text-muted-foreground">Current Level</p>
              </div>
            </div>
            
            {levelProgress.nextLevel && (
              <div className="flex-1">
                <div className="flex justify-between mb-2 text-sm">
                  <span>{levelDisplay.name}</span>
                  <span className="text-muted-foreground">
                    {levelProgress.tokensToNext.toLocaleString()} tokens to {TOKEN_LEVEL_NAMES[levelProgress.nextLevel]}
                  </span>
                </div>
                <Progress value={levelProgress.progress} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  {levelProgress.progress}% progress to next level
                </p>
              </div>
            )}

            {!levelProgress.nextLevel && (
              <div className="flex-1 text-center py-4">
                <Sparkles className="h-8 w-8 text-accent mx-auto mb-2" />
                <p className="font-medium">You&apos;ve reached the highest level!</p>
                <p className="text-sm text-muted-foreground">Dunamis Legend - Maximum Achievement</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Academic Analytics Unit Weekly Report */}
      <Card className="border-teal-500/30 bg-gradient-to-r from-teal-500/5 to-background">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-teal-500" />
            Academic Analytics Unit Weekly Report
          </CardTitle>
          <CardDescription>
            Your performance analytics from the Performance Analyst
          </CardDescription>
        </CardHeader>
        <CardContent>
          {totalLessonsCompleted === 0 && totalQuizzesPassed === 0 ? (
            <div className="text-center py-6">
              <BarChart3 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="font-medium text-muted-foreground">
                Academic Analytics Unit is monitoring.
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Complete your first quiz to unlock your performance intelligence report.
              </p>
              <Button variant="outline" className="mt-4" asChild>
                <Link href="/dashboard/messages">
                  Visit Analytics Office
                </Link>
              </Button>
            </div>
          ) : (
            <div className="font-mono text-sm bg-muted/50 rounded-lg p-4 border">
              <div className="border-b pb-2 mb-2">
                <span className="text-teal-500 font-bold">ACADEMIC ANALYTICS UNIT WEEKLY REPORT</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Courses Active:</span>
                  <span className="font-semibold">{enrolledCourses.filter(c => c.status === 'in_progress').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Completed:</span>
                  <span className="font-semibold">{enrolledCourses.filter(c => c.status === 'completed').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Average Score This Week:</span>
                  <span className="font-semibold text-green-500">{totalQuizzesPassed > 0 ? '78%' : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Strongest Area:</span>
                  <span className="font-semibold text-green-500">
                    {enrolledCourses.length > 0 
                      ? `${enrolledCourses[0]?.title?.slice(0, 15)}...` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weakest Area:</span>
                  <span className="font-semibold text-yellow-500">
                    {enrolledCourses.length > 1 
                      ? `${enrolledCourses[1]?.title?.slice(0, 15)}...` 
                      : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CGPA Projection:</span>
                  <span className="font-semibold">
                    {calculatedCgpa.toFixed(2)} {'->'} Target: 4.00
                  </span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <span className="text-muted-foreground">Recommendation: </span>
                  <span className="text-teal-500">
                    {loginStreak < 3 
                      ? 'Improve your login consistency for streak bonuses!'
                      : totalLessonsCompleted < 5
                        ? 'Complete more lessons to boost your CGPA projection.'
                        : 'Keep up the excellent work! You are on track.'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* CGPA Tracker */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-500" />
              CGPA Tracker
            </CardTitle>
            <CardDescription>
              Your academic performance across semesters
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* CGPA Summary */}
            <div className="rounded-lg bg-gradient-to-r from-primary/10 to-accent/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Cumulative GPA</p>
                  <p className="text-3xl font-bold">{totalLessonsCompleted > 0 ? calculatedCgpa.toFixed(2) : '—'}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Credits</p>
                  <p className="text-2xl font-bold">{totalLessonsCompleted > 0 ? totalCredits : 0}</p>
                </div>
              </div>
              {totalLessonsCompleted > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <Badge className="bg-green-500/10 text-green-600 border-0">
                    <ArrowUp className="h-3 w-3 mr-1" />
                    On Track
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    Token bonus: +{((calculatedCgpa >= 3.5 ? 0.2 : calculatedCgpa >= 3.0 ? 0.1 : 0) * 100).toFixed(0)}%
                  </span>
                </div>
              )}
            </div>

            {/* Semester Breakdown */}
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Semester Performance</h4>
              {totalLessonsCompleted === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Complete courses to see semester breakdown
                </p>
              ) : (
                MOCK_SEMESTERS.map((semester) => (
                  <div key={semester.id} className="flex items-center gap-3 p-3 rounded-lg border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{semester.name}</p>
                      <p className="text-xs text-muted-foreground">{semester.year}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{semester.gpa.toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{semester.credits} credits</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Leaderboard
              </CardTitle>
              <div className="flex gap-1">
                {(['global', 'faculty', 'department'] as const).map((filter) => (
                  <Button
                    key={filter}
                    size="sm"
                    variant={leaderboardFilter === filter ? 'default' : 'ghost'}
                    onClick={() => setLeaderboardFilter(filter)}
                    className="text-xs px-2 h-7"
                  >
                    {filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
            <CardDescription>
              {leaderboardFilter === 'global' && 'Top students across all faculties'}
              {leaderboardFilter === 'faculty' && `Top students in ${faculty?.name || 'your faculty'}`}
              {leaderboardFilter === 'department' && `Top students in ${department?.name || 'your department'}`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px]">
              <div className="space-y-2">
                {MOCK_LEADERBOARD.slice(0, leaderboardFilter === 'department' ? 5 : leaderboardFilter === 'faculty' ? 7 : 10).map((entry) => {
                  const entryLevel = getTokenLevelDisplay(entry.level as any)
                  return (
                    <div 
                      key={entry.rank}
                      className={`flex items-center gap-3 p-2 rounded-lg ${
                        entry.rank <= 3 ? 'bg-accent/5' : ''
                      }`}
                    >
                      <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold ${
                        entry.rank === 1 ? 'bg-yellow-500 text-white' :
                        entry.rank === 2 ? 'bg-gray-400 text-white' :
                        entry.rank === 3 ? 'bg-orange-600 text-white' :
                        'bg-muted text-muted-foreground'
                      }`}>
                        {entry.rank}
                      </div>
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-xs font-medium">
                        {entry.avatar}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{entry.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{entry.dept}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-sm">{entry.tokens.toLocaleString()}</p>
                        <p className={`text-xs ${entryLevel.color}`}>{entryLevel.name.split(' ')[0]}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
            
            {/* User's Position */}
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold">
                  {userRank}
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-medium">
                  {fullName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">You</p>
                  <p className="text-xs text-muted-foreground">{department?.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm">{currentTokens.toLocaleString()}</p>
                  <p className={`text-xs ${levelDisplay.color}`}>{levelDisplay.name.split(' ')[0]}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            {unlockedAchievements.length} of {achievements.length} achievements unlocked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="unlocked">
            <TabsList>
              <TabsTrigger value="unlocked">Unlocked ({unlockedAchievements.length})</TabsTrigger>
              <TabsTrigger value="locked">Locked ({lockedAchievements.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="unlocked" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {unlockedAchievements.map((achievement) => {
                  const Icon = achievementIcons[achievement.icon] || Award
                  return (
                    <div 
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg border bg-gradient-to-b from-accent/5 to-transparent text-center"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 mb-3">
                        <Icon className="h-7 w-7 text-accent" />
                      </div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      {achievement.earnedAt && (
                        <p className="text-xs text-accent mt-2">
                          Earned {new Date(achievement.earnedAt).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="locked" className="mt-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {lockedAchievements.map((achievement) => {
                  const Icon = achievementIcons[achievement.icon] || Award
                  return (
                    <div 
                      key={achievement.id}
                      className="flex flex-col items-center p-4 rounded-lg border bg-muted/30 text-center opacity-60"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-3">
                        <Icon className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <h4 className="font-semibold text-sm">{achievement.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
                      <Badge variant="outline" className="mt-2 text-xs">Locked</Badge>
                    </div>
                  )
                })}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Token History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Token History
          </CardTitle>
          <CardDescription>
            Your recent token transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tokenTransactions.length === 0 ? (
            <div className="text-center py-8">
              <Coins className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-muted-foreground">No transactions yet</p>
            </div>
          ) : (
            <ScrollArea className="h-[200px]">
              <div className="space-y-2">
                {tokenTransactions.slice(0, 20).map((tx) => (
                  <div key={tx.id} className="flex items-center gap-3 p-2 rounded-lg border">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                      tx.type === 'earn' ? 'bg-green-500/10' : 'bg-red-500/10'
                    }`}>
                      {tx.type === 'earn' ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">{tx.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(tx.timestamp).toLocaleDateString()} - {tx.category}
                      </p>
                    </div>
                    <div className={`font-bold ${tx.type === 'earn' ? 'text-green-500' : 'text-red-500'}`}>
                      {tx.type === 'earn' ? '+' : '-'}{tx.amount}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
