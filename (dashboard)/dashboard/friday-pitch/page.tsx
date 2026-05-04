'use client'

import { useEffect, useMemo, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { nextFridaySixPmLagos, formatCountdown } from '@/lib/time/wat-friday'
import { useCouncilNotifications } from '@/lib/stores/council-notifications'

const JUDGES = [
  {
    id: 'adebayo',
    name: 'Dr. Adebayo Salami',
    focus: 'Fintech & Payments (AI evaluation system)',
    prompt:
      'You are Dr. Adebayo Salami, an AI evaluation system representing a Fintech-focused investment perspective for DUNAMIS EDTECH pitch sessions. Evaluate startup pitches from a fintech, payments, and financial inclusion lens. Ask sharp questions about revenue model and market size. Be challenging but fair. Respond in under 100 words per question.',
  },
  {
    id: 'chidinma',
    name: 'Mrs. Chidinma Okonkwo',
    focus: 'AgriTech & Impact (AI evaluation system)',
    prompt:
      'You are Mrs. Chidinma Okonkwo, an AI evaluation system representing an impact investment perspective. Focus on social impact, sustainability, and scalability in underserved Nigerian communities. Ask about community adoption and implementation challenges. Under 100 words per response.',
  },
  {
    id: 'tunde',
    name: 'Mr. Tunde Eze',
    focus: 'Technology & Scalability (AI evaluation system)',
    prompt:
      'You are Mr. Tunde Eze, an AI evaluation system representing a technology investment perspective. Focus on technical feasibility, automation, and scalability. Ask about tech stack, automation potential, and competitive advantages. Under 100 words per response.',
  },
] as const

export default function FridayPitchPage() {
  const target = useMemo(() => nextFridaySixPmLagos(), [])
  const [now, setNow] = useState(() => new Date())
  const { add } = useCouncilNotifications()
  const [startup, setStartup] = useState('')
  const [problem, setProblem] = useState('')
  const [market, setMarket] = useState('')
  const [solution, setSolution] = useState('')
  const [stage, setStage] = useState('idea')
  const [feedback, setFeedback] = useState('')
  const [loading, setLoading] = useState(false)
  const [judgeReply, setJudgeReply] = useState<Record<string, string>>({})

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])

  const cd = formatCountdown(target, now)

  const submitPitch = async () => {
    setLoading(true)
    setFeedback('')
    try {
      const user = `Startup: ${startup}\nProblem (max 100 words): ${problem}\nMarket: ${market}\nSolution (max 150 words): ${solution}\nStage: ${stage}`
      const system = `You are an AI pitch screening assistant for DUNAMIS EDTECH Nigeria. Evaluate this startup pitch and give honest, constructive feedback in under 200 words. Rate it 1-10 on: Problem clarity, Market size, Solution viability. Be encouraging but rigorous. Speak like a Nigerian VC who wants to see founders succeed.`
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system, user }),
      })
      const data = await res.json()
      setFeedback(data.text || data.error || 'No response')
      add('miss_social', 'Friday Pitch Zone: your idea was screened — check your feedback.')
    } catch (e) {
      setFeedback(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setLoading(false)
    }
  }

  const askJudge = async (judge: (typeof JUDGES)[number]) => {
    setLoading(true)
    try {
      const user = `Pitch context:\n${problem}\n${solution}\nAsk one sharp follow-up question as this judge persona.`
      const res = await fetch('/api/ollama/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ system: judge.prompt, user }),
      })
      const data = await res.json()
      setJudgeReply((r) => ({ ...r, [judge.id]: data.text || data.error }))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">🎤 Friday Pitch Zone</CardTitle>
          <CardDescription>Next pitch session — Friday, 6:00 PM WAT (Lagos)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {[
              ['DAYS', cd.days],
              ['HRS', cd.hours],
              ['MINS', cd.minutes],
              ['SECS', cd.seconds],
            ].map(([label, val]) => (
              <div key={label as string} className="rounded-lg border border-border bg-muted/30 p-4 text-center">
                <p className="text-3xl font-bold tabular-nums">{val}</p>
                <p className="text-xs text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            Submissions close Thursday 11:00 PM WAT. Judges (automated AI systems, disclosed in Help) review the top 10
            submissions by cutoff.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submit your pitch idea</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Startup name</Label>
            <Input value={startup} onChange={(e) => setStartup(e.target.value)} />
          </div>
          <div>
            <Label>Problem being solved (max ~100 words)</Label>
            <Textarea value={problem} onChange={(e) => setProblem(e.target.value)} rows={4} />
          </div>
          <div>
            <Label>Target market</Label>
            <Textarea value={market} onChange={(e) => setMarket(e.target.value)} rows={3} />
          </div>
          <div>
            <Label>Proposed solution (max ~150 words)</Label>
            <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} rows={5} />
          </div>
          <div>
            <Label>Stage</Label>
            <Select value={stage} onValueChange={setStage}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="idea">Idea</SelectItem>
                <SelectItem value="prototype">Prototype</SelectItem>
                <SelectItem value="mvp">MVP</SelectItem>
                <SelectItem value="live">Live</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="button" onClick={submitPitch} disabled={loading || !startup}>
            {loading ? 'Screening…' : 'Submit for AI pre-screening'}
          </Button>
          {feedback && (
            <div className="rounded-md border border-border bg-muted/20 p-4 text-sm whitespace-pre-wrap">{feedback}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI judge panel</CardTitle>
          <CardDescription>Automated evaluation personas powered by local Ollama — disclosed in platform FAQ.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-3">
          {JUDGES.map((j) => (
            <div key={j.id} className="space-y-2 rounded-lg border border-border p-3 text-sm">
              <p className="font-semibold">{j.name}</p>
              <p className="text-xs text-muted-foreground">{j.focus}</p>
              <Button type="button" variant="outline" size="sm" className="w-full" onClick={() => askJudge(j)} disabled={loading}>
                Sample question
              </Button>
              {judgeReply[j.id] && <p className="text-xs whitespace-pre-wrap">{judgeReply[j.id]}</p>}
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Past sessions (archive)</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>
            Live room, scoring, and archives wire to your database in production. Demo grid: 12 Apr — FinTech cohort —
            winners announced Friday 9pm WAT.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
