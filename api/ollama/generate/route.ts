import { NextRequest, NextResponse } from 'next/server'
import { getActiveModel, isOllamaHealthy } from '@/lib/engines/OllamaBridge'

const base = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434'
const genUrl = `${base.replace(/\/$/, '')}/api/generate`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const system = typeof body.system === 'string' ? body.system : ''
    const user = typeof body.user === 'string' ? body.user : ''
    if (!user) {
      return NextResponse.json({ error: 'user prompt required' }, { status: 400 })
    }

    const ok = await isOllamaHealthy()
    if (!ok) {
      return NextResponse.json(
        { error: 'Ollama is not running on this server. Start Ollama locally to use AI features.' },
        { status: 503 }
      )
    }

    const model = await getActiveModel()
    const prompt = system ? `${system}\n\n---\n\n${user}` : user

    const res = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        temperature: 0.7,
      }),
    })

    if (!res.ok) {
      return NextResponse.json({ error: res.statusText }, { status: 502 })
    }

    const data = (await res.json()) as { response?: string }
    const text = (data.response || '').trim()
    return NextResponse.json({ text, model })
  } catch (e) {
    console.error('[ollama/generate]', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'generate failed' },
      { status: 500 }
    )
  }
}
