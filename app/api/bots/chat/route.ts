import {
  consumeStream,
  convertToModelMessages,
  streamText,
  UIMessage,
} from 'ai'
import { BOT_SYSTEM_PROMPTS } from '@/lib/council/bot-prompts'
import { getOllamaOpenAI } from '@/lib/ai/ollama-openai'
import { getActiveModel } from '@/lib/engines/OllamaBridge'

export const maxDuration = 60

export async function POST(req: Request) {
  const {
    messages,
    botId,
    studentData,
  }: {
    messages: UIMessage[]
    botId: string
    studentData?: {
      name?: string
      tokens?: number
      cgpa?: number
      department?: string
      loginStreak?: number
    }
  } = await req.json()

  const systemPrompt = BOT_SYSTEM_PROMPTS[botId] || BOT_SYSTEM_PROMPTS.prof_brain

  let contextAddition = ''
  if (studentData) {
    contextAddition = `\n\nCurrent student context:
- Name: ${studentData.name || 'Student'}
- EduCoin balance (₦1 = 1 EduCoin): ${studentData.tokens ?? 0}
- CGPA: ${studentData.cgpa?.toFixed(2) ?? 'N/A'}
- Department: ${studentData.department || 'Not specified'}
- Login Streak: ${studentData.loginStreak ?? 0} days`
  }

  try {
    const modelName = await getActiveModel()
    const ollama = getOllamaOpenAI()
    const result = streamText({
      model: ollama(modelName),
      system: systemPrompt + contextAddition,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
      temperature: 0.7,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
      consumeSseStream: consumeStream,
    })
  } catch (err) {
    console.error('[bots/chat] Ollama error:', err)
    return new Response(
      JSON.stringify({
        error: 'Ollama unavailable',
        detail: err instanceof Error ? err.message : String(err),
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
