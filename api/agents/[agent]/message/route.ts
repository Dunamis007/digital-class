import { NextRequest, NextResponse } from 'next/server'
import { generateText } from 'ai'
import { openai } from '@ai-sdk/openai'
import { supabaseServer } from '@/lib/supabase'
import { getAgentPrompt, AgentType } from '@/lib/ai-agents'
import { createClient } from '@supabase/supabase-js'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ agent: string }> }
) {
  try {
    const { agent } = await params
    const auth = request.headers.get('Authorization')

    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(auth.replace('Bearer ', ''))

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { message, conversationId } = await request.json()

    if (!message) {
      return NextResponse.json({ error: 'Message required' }, { status: 400 })
    }

    // Get agent prompt
    const systemPrompt = getAgentPrompt(agent as AgentType)
    if (!systemPrompt) {
      return NextResponse.json({ error: 'Invalid agent' }, { status: 400 })
    }

    // Get conversation history
    let conversation = conversationId
    let messages: Array<{ role: 'user' | 'assistant'; content: string }> = []

    if (conversationId) {
      const { data: conversationData } = await supabaseServer
        .from('ai_conversations')
        .select('id')
        .eq('id', conversationId)
        .single()

      if (conversationData) {
        const { data: messageHistory } = await supabaseServer
          .from('ai_messages')
          .select('sender, content')
          .eq('conversation_id', conversationId)
          .order('created_at', { ascending: true })

        messages = (messageHistory || []).map((m: any) => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.content
        }))
      }
    } else {
      // Create new conversation
      const { data: newConversation } = await supabaseServer
        .from('ai_conversations')
        .insert([
          {
            user_id: user.id,
            agent_type: agent,
            title: `Chat with ${agent} - ${new Date().toLocaleDateString()}`
          }
        ])
        .select()
        .single()

      if (newConversation) {
        conversation = newConversation.id
      }
    }

    // Add user message to history
    messages.push({ role: 'user', content: message })

    // Generate response using Vercel AI SDK
    const { text: responseText } = await generateText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt,
      messages,
      maxTokens: 500,
      temperature: 0.7
    })

    // Save messages to database
    await supabaseServer.from('ai_messages').insert([
      {
        conversation_id: conversation,
        sender: 'user',
        content: message
      },
      {
        conversation_id: conversation,
        sender: 'agent',
        content: responseText
      }
    ])

    return NextResponse.json({
      conversationId: conversation,
      message: responseText,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('AI agent error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Agent request failed' },
      { status: 500 }
    )
  }
}
