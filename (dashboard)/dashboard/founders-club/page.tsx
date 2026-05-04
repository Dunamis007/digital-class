'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStudentStore } from '@/lib/stores/student-store'

export default function FoundersClubPage() {
  const { enrolledCourses, fullName } = useStudentStore()
  const unlocked = useMemo(
    () => enrolledCourses.length > 0 && enrolledCourses.every((c) => c.status === 'completed'),
    [enrolledCourses]
  )

  if (!unlocked) {
    return (
      <div className="relative mx-auto max-w-3xl overflow-hidden rounded-xl border border-border">
        <div className="pointer-events-none select-none blur-sm">
          <Card>
            <CardHeader>
              <CardTitle>🏆 Founders Club</CardTitle>
            </CardHeader>
            <CardContent className="h-48" />
          </Card>
        </div>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/70 p-6 text-center">
          <p className="text-lg font-semibold">Complete your startup launch path to unlock Founders Club</p>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Nigeria&apos;s alumni network preview — graduate checklist lives on Startup Launchpad.
          </p>
          <div className="mt-4 h-2 w-64 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-accent transition-all"
              style={{
                width: `${Math.min(100, (enrolledCourses.filter((c) => c.status === 'completed').length / Math.max(enrolledCourses.length, 1)) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🏆 Founders Club — Welcome, {fullName?.split(' ')[0] || 'Founder'}!</CardTitle>
          <CardDescription>Dunamis Founder — Class of {new Date().getFullYear()}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button type="button">Download certificate (demo)</Button>
          <Button type="button" variant="outline">
            Share on LinkedIn
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Graduate success wall</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Profile cards pull from your `founders_club` table when connected to Supabase.
        </CardContent>
      </Card>
    </div>
  )
}
