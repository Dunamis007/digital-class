'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useStudentStore } from '@/lib/stores/student-store'

export default function LaunchpadPage() {
  const { enrolledCourses, fullName } = useStudentStore()
  const coreDone = enrolledCourses.filter((c) => c.status === 'completed').length
  const total = enrolledCourses.length || 1
  const [url, setUrl] = useState('')
  const [plan, setPlan] = useState('')

  const genPlan = async () => {
    const res = await fetch('/api/ollama/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system:
          'Generate a realistic 3-month post-graduation plan for a Nigerian startup. Include: Month 1 (validation), Month 2 (growth), Month 3 (revenue). Be specific to Nigeria market conditions. Under 400 words.',
        user: `Startup placeholder for ${fullName}. Sector: FinTech. Landing page: ${url || 'TBD'}.`,
      }),
    })
    const data = await res.json()
    setPlan(data.text || data.error)
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🚀 Startup Launchpad</CardTitle>
          <CardDescription>Graduation checklist — links are official references only.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg border border-border p-4 space-y-2">
            <p className="font-semibold">Graduation requirements</p>
            <ul className="list-inside list-disc space-y-1 text-muted-foreground">
              <li className={coreDone === total ? 'line-through' : ''}>All core courses completed ({coreDone}/{total})</li>
              <li>Incubation phase passed</li>
              <li>Acceleration phase passed</li>
              <li>Business name registered (CAC)</li>
              <li>Live website / landing page</li>
              <li>50 waitlist signups OR 10 paying customers</li>
              <li>3-month post-graduation plan submitted</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>CAC registration (Nigeria)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Use the official Corporate Affairs Commission portal for name search, reservations, and fees.</p>
          <a href="https://pre.cac.gov.ng" className="text-accent underline" target="_blank" rel="noreferrer">
            https://pre.cac.gov.ng
          </a>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Landing page & waitlist</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Landing page URL</Label>
            <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
          </div>
          <p className="text-xs text-muted-foreground">Reported signups can sync to your database; progress bar toward 50 is manual in demo.</p>
          <ProgressFake />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>3-month post-graduation plan (AI draft)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button type="button" variant="secondary" onClick={genPlan}>
            Generate plan with Ollama
          </Button>
          {plan && <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-xs">{plan}</pre>}
        </CardContent>
      </Card>
    </div>
  )
}

function ProgressFake() {
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div className="h-full w-[35%] bg-accent" />
    </div>
  )
}
