'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { 
  GraduationCap, 
  Building2, 
  User, 
  ChevronRight, 
  ChevronLeft,
  BookOpen,
  Laptop,
  Users,
  Sparkles,
  CheckCircle2,
  Bot,
  Clock,
  Play,
  Coins
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { 
  useStudentStore, 
  MOCK_FACULTIES, 
  MOCK_DEPARTMENTS,
  EnrolledCourse
} from "@/lib/stores/student-store"
import { BOT_DEFINITIONS } from "@/lib/types/bot-system"

// Available trial courses
const TRIAL_COURSES = [
  {
    id: 'trial-ai',
    title: 'Agentic AI & GenAI Mastery',
    code: 'AI301',
    description: 'Build intelligent AI agents using LangChain, OpenAI, and modern GenAI frameworks',
    instructor: 'Dr. Adebayo Ogunlesi',
    duration: '12 weeks',
    lessons: 48,
    creditUnits: 4,
    category: 'Technology',
    color: '#8B5CF6',
  },
  {
    id: 'trial-cyber',
    title: 'Cybersecurity Fundamentals',
    code: 'CY201',
    description: 'Master network security, ethical hacking, and security protocols',
    instructor: 'Engr. Chioma Nwosu',
    duration: '10 weeks',
    lessons: 36,
    creditUnits: 3,
    category: 'Technology',
    color: '#DC2626',
  },
  {
    id: 'trial-cloud',
    title: 'Cloud Computing with AWS',
    code: 'CC301',
    description: 'Learn cloud architecture, AWS services, and deployment strategies',
    instructor: 'Mr. Emeka Obi',
    duration: '10 weeks',
    lessons: 42,
    creditUnits: 4,
    category: 'Technology',
    color: '#F59E0B',
  },
  {
    id: 'trial-fullstack',
    title: 'Full Stack Web Development',
    code: 'FS401',
    description: 'Build modern web applications with React, Node.js, and databases',
    instructor: 'Mrs. Ngozi Eze',
    duration: '14 weeks',
    lessons: 56,
    creditUnits: 4,
    category: 'Technology',
    color: '#10B981',
  },
  {
    id: 'trial-data',
    title: 'Data Engineering & Analytics',
    code: 'DE301',
    description: 'Master data pipelines, ETL processes, and big data technologies',
    instructor: 'Dr. Olumide Adeyemi',
    duration: '12 weeks',
    lessons: 44,
    creditUnits: 4,
    category: 'Technology',
    color: '#3B82F6',
  },
  {
    id: 'trial-mobile',
    title: 'Mobile App Development',
    code: 'MD301',
    description: 'Create cross-platform mobile apps with React Native and Flutter',
    instructor: 'Mr. Tunde Bakare',
    duration: '10 weeks',
    lessons: 40,
    creditUnits: 3,
    category: 'Technology',
    color: '#EC4899',
  },
]

const STEPS = [
  { id: 1, title: 'Personal Info', icon: User },
  { id: 2, title: 'Faculty', icon: Building2 },
  { id: 3, title: 'Department', icon: BookOpen },
  { id: 4, title: 'Study Mode', icon: Laptop },
  { id: 5, title: 'Student Council', icon: Bot },
  { id: 6, title: 'Choose Course', icon: GraduationCap },
  { id: 7, title: 'Trial Activated', icon: Sparkles },
]

export default function OnboardingPage() {
  const router = useRouter()
  const { completeOnboarding, earnTokens, setProfile, enrolledCourses } = useStudentStore()
  
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    fullName: '',
    facultyId: '',
    departmentId: '',
    studyMode: 'online' as 'online' | 'physical' | 'hybrid',
    selectedCourseId: '',
  })
  const [trialActivated, setTrialActivated] = useState(false)
  const [showActivationModal, setShowActivationModal] = useState(false)

  const progress = (step / STEPS.length) * 100

  const filteredDepartments = MOCK_DEPARTMENTS.filter(
    d => d.faculty_id === formData.facultyId
  )

  const selectedFaculty = MOCK_FACULTIES.find(f => f.id === formData.facultyId)
  const selectedDepartment = MOCK_DEPARTMENTS.find(d => d.id === formData.departmentId)
  const selectedCourse = TRIAL_COURSES.find(c => c.id === formData.selectedCourseId)

  const canProceed = () => {
    switch (step) {
      case 1: return formData.fullName.trim().length >= 2
      case 2: return formData.facultyId !== ''
      case 3: return formData.departmentId !== ''
      case 4: return formData.studyMode !== ''
      case 5: return true // Bot council intro - always can proceed
      case 6: return formData.selectedCourseId !== ''
      default: return true
    }
  }

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1)
    } else if (step === 6) {
      // Step 6 -> Activate trial and show modal
      activateTrial()
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const activateTrial = async () => {
    if (!selectedCourse) return
    
    // Calculate trial dates
    const now = new Date()
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 days
    
    // Create the enrollment record
    const trialEnrollment: EnrolledCourse = {
      id: selectedCourse.id,
      title: selectedCourse.title,
      code: selectedCourse.code,
      instructor: selectedCourse.instructor,
      progress: 0,
      totalLessons: selectedCourse.lessons,
      completedLessons: 0,
      nextLesson: 'Introduction to ' + selectedCourse.title.split(' ')[0],
      creditUnits: selectedCourse.creditUnits,
      status: 'in_progress',
    }
    
    // Complete onboarding first
    completeOnboarding({
      fullName: formData.fullName,
      facultyId: formData.facultyId,
      departmentId: formData.departmentId,
      studyMode: formData.studyMode,
    })
    
    // Add the trial enrollment to local store
    setProfile({
      enrolledCourses: [trialEnrollment, ...enrolledCourses],
    })
    
    // Award 15 tokens for starting trial (from Bursary office)
    earnTokens(15, 'Trial enrollment bonus - You started your learning journey!', 'Trial')
    
    // Store trial metadata in localStorage for tracking
    localStorage.setItem('trial_course', JSON.stringify({
      courseId: selectedCourse.id,
      courseTitle: selectedCourse.title,
      trialStart: now.toISOString(),
      trialEnd: trialEnd.toISOString(),
      status: 'trial_active',
    }))
    
    // Also persist to database (fire and forget - don't block UI)
    try {
      fetch('/api/enrollments/trial', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: localStorage.getItem('student_id') || `temp-${Date.now()}`,
          course_id: selectedCourse.id,
          course_title: selectedCourse.title,
          course_code: selectedCourse.code,
        }),
      }).catch(err => console.error('[v0] Trial enrollment API error:', err))
    } catch (err) {
      console.error('[v0] Trial enrollment error:', err)
    }
    
    // Show activation modal (step 7)
    setTrialActivated(true)
    setShowActivationModal(true)
    setStep(7)
  }

  const handleBeginLearning = () => {
    // Navigate directly to the course player
    router.push(`/dashboard/courses/${selectedCourse?.id}`)
  }

  // Featured bots to introduce
  const featuredBots = [
    BOT_DEFINITIONS.mr_timekeeper,
    BOT_DEFINITIONS.mama_token,
    BOT_DEFINITIONS.prof_brain,
    BOT_DEFINITIONS.sharp_guy,
  ]

  // Full-screen trial activation modal (Step 7)
  if (showActivationModal && step === 7) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-accent/10 to-background" />
        
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-accent/20 blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-primary/20 blur-3xl animate-pulse delay-1000" />
          <div className="absolute top-1/2 left-1/4 w-24 h-24 rounded-full bg-green-500/10 blur-2xl animate-pulse delay-500" />
        </div>
        
        <div className="relative z-10 max-w-lg w-full mx-4 text-center">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="relative inline-flex">
              <div className="absolute inset-0 rounded-full bg-accent/30 blur-xl animate-pulse" />
              <div className="relative w-24 h-24 rounded-full bg-accent flex items-center justify-center">
                <GraduationCap className="h-12 w-12 text-accent-foreground" />
              </div>
            </div>
          </div>
          
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            TRIAL ACTIVATED!
          </h1>
          
          {/* Course Info */}
          <Card className="mb-6 border-accent/50 bg-card/80 backdrop-blur">
            <CardContent className="p-6">
              <Badge 
                className="mb-3"
                style={{ backgroundColor: selectedCourse?.color, color: '#fff' }}
              >
                {selectedCourse?.code}
              </Badge>
              <h2 className="text-xl font-semibold text-foreground mb-2">
                {selectedCourse?.title}
              </h2>
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  7-Day Free Access
                </span>
                <span className="flex items-center gap-1">
                  <BookOpen className="h-4 w-4" />
                  {selectedCourse?.lessons} Lessons
                </span>
              </div>
              <p className="text-muted-foreground">
                Your learning journey starts <span className="text-accent font-semibold">RIGHT NOW</span>.
              </p>
            </CardContent>
          </Card>
          
          {/* Academic Scheduling Unit message */}
          <div className="mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-xl">
                {BOT_DEFINITIONS.mr_timekeeper.metadata?.emoji}
              </span>
              <span className="font-semibold text-foreground">
                {BOT_DEFINITIONS.mr_timekeeper.name}
              </span>
            </div>
            <p className="text-sm text-muted-foreground italic">
              &ldquo;Your start time has been logged. Don&apos;t waste a minute, my friend!&rdquo;
            </p>
          </div>
          
          {/* Token Award Notification */}
          <div className="mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="h-5 w-5 text-green-500" />
              <span className="font-semibold text-green-500">+15 Tokens Earned!</span>
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">{BOT_DEFINITIONS.mama_token.name}</span>: 
              &ldquo;You earned 15 tokens for beginning your learning journey!&rdquo;
            </p>
          </div>
          
          {/* CTA Button */}
          <Button 
            size="lg" 
            className="w-full h-14 text-lg bg-accent text-accent-foreground hover:bg-accent/90 group"
            onClick={handleBeginLearning}
          >
            <Play className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform" />
            BEGIN LEARNING NOW
            <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          {/* Trial countdown hint */}
          <p className="mt-4 text-sm text-muted-foreground">
            Your 7-day trial expires on{' '}
            <span className="font-medium text-foreground">
              {new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-NG', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {step} of {STEPS.length}</span>
            <span className="text-sm text-muted-foreground">{STEPS[step - 1].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {STEPS.map((s) => (
              <div 
                key={s.id} 
                className={`flex flex-col items-center ${
                  s.id <= step ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs ${
                  s.id < step 
                    ? 'bg-primary text-primary-foreground' 
                    : s.id === step 
                      ? 'bg-primary/20 text-primary border-2 border-primary'
                      : 'bg-muted'
                }`}>
                  {s.id < step ? <CheckCircle2 className="h-3 w-3 md:h-4 md:w-4" /> : s.id}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              {(() => {
                const StepIcon = STEPS[step - 1].icon
                return <StepIcon className="h-8 w-8 text-primary" />
              })()}
            </div>
            <CardTitle className="text-2xl">
              {step === 1 && "What's your name?"}
              {step === 2 && "Choose Your Faculty"}
              {step === 3 && "Select Your Department"}
              {step === 4 && "How will you study?"}
              {step === 5 && "Meet Your Student Council!"}
              {step === 6 && "Choose Your Trial Course"}
            </CardTitle>
            <CardDescription>
              {step === 1 && "Enter your full name as it will appear on your certificates"}
              {step === 2 && "Select the faculty that matches your area of study"}
              {step === 3 && "Choose your specific department within " + (selectedFaculty?.name || 'your faculty')}
              {step === 4 && "Select your preferred learning mode"}
              {step === 5 && "These AI office assistants will guide you through your learning journey"}
              {step === 6 && "Start with a 7-day free trial of any course below"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Step 1: Name */}
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    placeholder="e.g., Adaeze Chidinma Okonkwo"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="text-lg"
                    autoFocus
                  />
                </div>
              </div>
            )}

            {/* Step 2: Faculty */}
            {step === 2 && (
              <RadioGroup
                value={formData.facultyId}
                onValueChange={(value) => setFormData({ ...formData, facultyId: value, departmentId: '' })}
                className="grid gap-3"
              >
                {MOCK_FACULTIES.map((faculty) => (
                  <div key={faculty.id}>
                    <RadioGroupItem
                      value={faculty.id}
                      id={faculty.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={faculty.id}
                      className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                    >
                      <div 
                        className="flex h-12 w-12 items-center justify-center rounded-lg"
                        style={{ backgroundColor: `${faculty.color}20` }}
                      >
                        <Building2 className="h-6 w-6" style={{ color: faculty.color }} />
                      </div>
                      <div>
                        <p className="font-semibold">{faculty.name}</p>
                        <p className="text-sm text-muted-foreground">{faculty.description}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 3: Department */}
            {step === 3 && (
              <RadioGroup
                value={formData.departmentId}
                onValueChange={(value) => setFormData({ ...formData, departmentId: value })}
                className="grid gap-3 sm:grid-cols-2"
              >
                {filteredDepartments.map((dept) => (
                  <div key={dept.id}>
                    <RadioGroupItem
                      value={dept.id}
                      id={dept.id}
                      className="peer sr-only"
                    />
                    <Label
                      htmlFor={dept.id}
                      className="flex items-center gap-3 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <BookOpen className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{dept.name}</p>
                        <p className="text-xs text-muted-foreground">{dept.code}</p>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {/* Step 4: Study Mode */}
            {step === 4 && (
              <RadioGroup
                value={formData.studyMode}
                onValueChange={(value: 'online' | 'physical' | 'hybrid') => setFormData({ ...formData, studyMode: value })}
                className="grid gap-4"
              >
                <div>
                  <RadioGroupItem value="online" id="online" className="peer sr-only" />
                  <Label
                    htmlFor="online"
                    className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
                      <Laptop className="h-6 w-6 text-blue-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Online</p>
                      <p className="text-sm text-muted-foreground">Learn from anywhere with full digital access</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="physical" id="physical" className="peer sr-only" />
                  <Label
                    htmlFor="physical"
                    className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
                      <Building2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Physical</p>
                      <p className="text-sm text-muted-foreground">Attend classes at our learning centers</p>
                    </div>
                  </Label>
                </div>
                <div>
                  <RadioGroupItem value="hybrid" id="hybrid" className="peer sr-only" />
                  <Label
                    htmlFor="hybrid"
                    className="flex items-center gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500/10">
                      <Users className="h-6 w-6 text-purple-500" />
                    </div>
                    <div>
                      <p className="font-semibold">Hybrid</p>
                      <p className="text-sm text-muted-foreground">Combine online and physical learning</p>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            )}

            {/* Step 5: Meet Bots */}
            {step === 5 && (
              <div className="grid gap-4 sm:grid-cols-2">
                {featuredBots.map((bot) => (
                  <div 
                    key={bot.name}
                    className="rounded-lg border border-border p-4 space-y-2"
                    style={{ borderLeftColor: bot.metadata?.color, borderLeftWidth: 4 }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{bot.metadata?.emoji}</span>
                      <h3 className="font-semibold">{bot.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">{bot.description}</p>
                    <p className="text-xs italic" style={{ color: bot.metadata?.color }}>
                      &ldquo;{bot.catchphrase}&rdquo;
                    </p>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground col-span-full text-center mt-2">
                  + 6 more offices waiting to help you succeed!
                </p>
              </div>
            )}

            {/* Step 6: Choose Trial Course */}
            {step === 6 && (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-accent/10 border border-accent/20 mb-4">
                  <p className="text-sm text-center">
                    <span className="font-semibold">7-Day Free Trial</span> — Full access to all lessons, no credit card required
                  </p>
                </div>
                <RadioGroup
                  value={formData.selectedCourseId}
                  onValueChange={(value) => setFormData({ ...formData, selectedCourseId: value })}
                  className="grid gap-3"
                >
                  {TRIAL_COURSES.map((course) => (
                    <div key={course.id}>
                      <RadioGroupItem
                        value={course.id}
                        id={course.id}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={course.id}
                        className="flex items-start gap-4 rounded-lg border-2 border-muted bg-popover p-4 hover:bg-accent/5 peer-data-[state=checked]:border-primary cursor-pointer transition-colors"
                      >
                        <div 
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg"
                          style={{ backgroundColor: `${course.color}20` }}
                        >
                          <GraduationCap className="h-6 w-6" style={{ color: course.color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-semibold">{course.title}</p>
                            <Badge variant="secondary" className="text-xs">{course.code}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {course.duration}
                            </span>
                            <span className="flex items-center gap-1">
                              <BookOpen className="h-3 w-3" />
                              {course.lessons} lessons
                            </span>
                            <span>by {course.instructor}</span>
                          </div>
                        </div>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {step < 6 ? (
                <Button onClick={handleNext} disabled={!canProceed()}>
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : step === 6 ? (
                <Button 
                  onClick={handleNext} 
                  disabled={!canProceed()}
                  className="bg-accent text-accent-foreground hover:bg-accent/90"
                >
                  Start 7-Day Trial
                  <Play className="ml-2 h-4 w-4" />
                </Button>
              ) : null}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
