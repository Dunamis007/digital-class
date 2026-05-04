'use client'

import Link from "next/link"
import { 
  Award, 
  Download, 
  Share2, 
  ExternalLink,
  GraduationCap,
  Calendar,
  CheckCircle2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStudentStore } from "@/lib/stores/student-store"

// Mock certificates
const MOCK_CERTIFICATES = [
  {
    id: 'cert-1',
    title: 'Python Programming',
    issueDate: '2024-01-15',
    courseCode: 'CS101',
    instructor: 'Mrs. Ngozi Eze',
    credentialId: 'DUN-CERT-2024-001234',
    status: 'issued',
  },
]

export default function CertificatesPage() {
  const { isOnboarded, fullName, enrolledCourses } = useStudentStore()

  const completedCourses = enrolledCourses.filter(c => c.status === 'completed')

  if (!isOnboarded) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <CardTitle>Complete Your Enrollment</CardTitle>
            <CardDescription>
              Please complete the onboarding process to view your certificates.
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
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">My Certificates</h1>
        <p className="text-muted-foreground mt-1">
          Download and share your earned certificates
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Award className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses.length}</p>
              <p className="text-sm text-muted-foreground">Certificates Earned</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <GraduationCap className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{enrolledCourses.length - completedCourses.length}</p>
              <p className="text-sm text-muted-foreground">In Progress</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <CheckCircle2 className="h-5 w-5 text-purple-500" />
            </div>
            <div>
              <p className="text-2xl font-bold">{completedCourses.reduce((acc, c) => acc + c.creditUnits, 0)}</p>
              <p className="text-sm text-muted-foreground">Credits Earned</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Certificates Grid */}
      {completedCourses.length === 0 && MOCK_CERTIFICATES.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Award className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="font-semibold text-lg mb-2">No Certificates Yet</h3>
            <p className="text-muted-foreground text-center max-w-md mb-4">
              Complete your enrolled courses to earn certificates. Each completed course
              will generate a verified certificate you can download and share.
            </p>
            <Button asChild>
              <Link href="/dashboard/courses">View My Courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Actual completed courses */}
          {completedCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative">
                <Award className="h-16 w-16 text-primary/30" />
                <Badge className="absolute top-3 right-3 bg-green-500">Verified</Badge>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{course.title}</h3>
                  <p className="text-sm text-muted-foreground">{course.code} - {course.instructor}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date().toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <span>{course.creditUnits} Credits</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Credential ID: DUN-CERT-{new Date().getFullYear()}-{course.id.slice(-6).toUpperCase()}</p>
                  <p>Issued to: {fullName}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Mock certificates */}
          {MOCK_CERTIFICATES.map((cert) => (
            <Card key={cert.id} className="overflow-hidden">
              <div className="h-32 bg-gradient-to-br from-primary/20 via-accent/10 to-primary/5 flex items-center justify-center relative">
                <Award className="h-16 w-16 text-primary/30" />
                <Badge className="absolute top-3 right-3 bg-green-500">Verified</Badge>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.courseCode} - {cert.instructor}</p>
                </div>
                
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(cert.issueDate).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Verified</span>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground">
                  <p>Credential ID: {cert.credentialId}</p>
                  <p>Issued to: {fullName}</p>
                </div>

                <div className="flex gap-2">
                  <Button className="flex-1" variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="icon">
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Verification Info */}
      <Card className="bg-muted/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <h4 className="font-medium">Certificate Verification</h4>
              <p className="text-sm text-muted-foreground mt-1">
                All Dunamis EdTech certificates are digitally signed and can be verified using 
                the credential ID. Share your certificates on LinkedIn or with employers 
                to showcase your skills.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
