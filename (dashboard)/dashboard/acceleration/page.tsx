'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'

const TOOLS = [
  { name: 'Bubble.io', desc: 'Visual app builder — great for MVPs.', url: 'https://bubble.io' },
  { name: 'Make.com', desc: 'Automation between apps and APIs.', url: 'https://make.com' },
  { name: 'Carrd.co', desc: 'One-page sites for waitlists.', url: 'https://carrd.co' },
  { name: 'Flutterwave', desc: 'Payments for Nigerian startups.', url: 'https://flutterwave.com' },
  { name: 'Typeform', desc: 'Surveys and waitlist signups.', url: 'https://typeform.com' },
]

const MILESTONES = [
  'Week 1: Problem validated',
  'Week 2: Solution defined',
  'Week 3: First prototype built',
  'Week 4: Landing page live',
  'Week 5: 10 waitlist signups',
  'Week 6: MVP tested with 5 real users',
  'Week 7: 50 waitlist signups',
  'Week 8: Working MVP submitted',
]

export default function AccelerationPage() {
  const [update, setUpdate] = useState('')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const done = 2

  const submit = async () => {
    setLoading(true)
    setFeedback('')
    try {
      const system = `You are an acceleration coach at DUNAMIS EDTECH. Review this weekly MVP progress update: [SUBMISSION]. Give specific technical and strategic feedback in under 200 words. Suggest one specific tool (Bubble, Make, Zapier, Flutterwave API, etc.) that would help them move faster. Be direct and practical.`
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user: update }),
      })
      const data = await res.json()
      setFeedback(data.text || data.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">⚡ Acceleration Lab</CardTitle>
          <CardDescription>Unlocked after incubation in production; MVP coaching with local Ollama.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="rounded-lg border border-border p-4">
            <p className="font-semibold">Your MVP: PesaLink — Rural Payment App</p>
            <p className="text-muted-foreground">Stage: Prototype → Testing</p>
            <Progress className="mt-2 h-2" value={60} />
            <p className="mt-2 text-xs text-muted-foreground">Weekly submission due Friday 11pm WAT.</p>
          </div>
          <Textarea rows={6} value={update} onChange={(e) => setUpdate(e.target.value)} placeholder="What you built, blockers, next week plan…" />
          <Button type="button" onClick={submit} disabled={loading || !update.trim()}>
            {loading ? 'Coach is reviewing…' : 'Submit this week’s progress'}
          </Button>
          {feedback && <pre className="whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-xs">{feedback}</pre>}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>No-code tool guide</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={TOOLS[0].name}>
            <TabsList className="flex flex-wrap h-auto gap-1">
              {TOOLS.map((t) => (
                <TabsTrigger key={t.name} value={t.name} className="text-xs">
                  {t.name}
                </TabsTrigger>
              ))}
            </TabsList>
            {TOOLS.map((t) => (
              <TabsContent key={t.name} value={t.name} className="text-sm text-muted-foreground">
                <p>{t.desc}</p>
                <a href={t.url} className="text-accent underline" target="_blank" rel="noreferrer">
                  Open {t.name}
                </a>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Milestone tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {MILESTONES.map((m, i) => (
            <label key={m} className="flex items-center gap-2">
              <input type="checkbox" checked={i < done} readOnly className="rounded border" />
              {m}
            </label>
          ))}
          <p className="text-xs text-muted-foreground pt-2">Each milestone can award EduCoins via your ledger rules.</p>
        </CardContent>
      </Card>
    </div>
  )
}
