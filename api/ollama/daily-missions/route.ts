import { NextRequest, NextResponse } from 'next/server'
import { getActiveModel, isOllamaHealthy } from '@/lib/engines/OllamaBridge'

const base = process.env.OLLAMA_API_URL || 'http://127.0.0.1:11434'
const genUrl = `${base.replace(/\/$/, '')}/api/generate`

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const course = typeof body.course === 'string' ? body.course : 'your enrolled course'
    const dept = typeof body.department === 'string' ? body.department : 'your department'

    const ok = await isOllamaHealthy()
    if (!ok) {
      return NextResponse.json({ text: 'Ollama offline — try again when your local model is running.' })
    }

    const system = `You are a motivational learning coach for DUNAMIS EDTECH Nigeria. Generate 3 specific daily learning missions for a student studying ${course} in ${dept}. Each mission should take 15-30 minutes. Format each line exactly as:
Mission name | Description | Coin reward
Make them achievable and tied to the current course module. No markdown.`

    const model = await getActiveModel()
    const r = await fetch(genUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model,
        prompt: `${system}\n\n---\n\nGenerate today's missions.`,
        stream: false,
        temperature: 0.75,
      }),
    })
    const data = (await r.json()) as { response?: string }
    return NextResponse.json({ text: (data.response || '').trim() })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}
