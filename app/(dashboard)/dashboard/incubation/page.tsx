'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { useStudentStore } from '@/lib/stores/student-store'

const WEEKS = [
  'Week 1: Problem Statement (500 words)',
  'Week 2: Market Research (10 real data points)',
  'Week 3: Solution Sketch (diagram + description)',
  'Week 4: Validation Plan',
  'Week 5: Problem Validation Document',
  'Week 6: 3 Solution Ideas with pros/cons',
]

export default function IncubationPage() {
  const { fullName, enrolledCourses } = useStudentStore()
  const allCoreDone = enrolledCourses.length > 0 && enrolledCourses.every((c) => c.status === 'completed')
  const [week, setWeek] = useState(0)
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async () => {
    setLoading(true)
    setFeedback('')
    try {
      const system = `You are an incubation mentor at DUNAMIS EDTECH Nigeria. Review this team's submission for Week ${week + 1}: [SUBMISSION TEXT]. Give specific, actionable feedback in under 250 words. Score it 1-100. Highlight the strongest point and the most urgent improvement. Write like a tough-love Nigerian startup mentor.`
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user: text }),
      })
      const data = await res.json()
      setFeedback(data.text || data.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {!allCoreDone && (
        <p className="rounded-md border border-amber-500/40 bg-amber-500/10 px-4 py-2 text-sm">
          Incubation Arena fully unlocks after all enrolled core courses are marked completed. You can still explore AI
          feedback below.
        </p>
      )}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🔬 Incubation Arena</CardTitle>
          <CardDescription>Team assignment & weekly deliverables — cohort capacity 50 (transparent).</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm">
          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <p className="font-semibold">Team Fintech — Cohort 3</p>
            <p className="text-muted-foreground">
              Members: {fullName || 'You'}, Emeka, Aisha, Chidi, Funke — Problem focus: Financial inclusion in rural
              Nigeria.
            </p>
            <p className="mt-2">Team score: 340 points | Rank #2 of 8 teams</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly challenge</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Label>Deliverable</Label>
          <select
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
          >
            {WEEKS.map((w, i) => (
              <option key={w} value={i}>
                {w}
              </option>
            ))}
          </select>
          <Textarea rows={8} value={text} onChange={(e) => setText(e.target.value)} placeholder="Paste your team submission…" />
          <Button type="button" onClick={submit} disabled={loading || !text.trim()}>
            {loading ? 'Getting mentor feedback…' : 'Submit for AI mentor feedback'}
          </Button>
          {feedback && <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-xs">{feedback}</pre>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leaderboard</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Team rankings update from your database in production. Demo: Team Fintech #2, Team AgriTech #1, Team EdTech #3…
        </CardContent>
      </Card>
    </div>
  )
}
