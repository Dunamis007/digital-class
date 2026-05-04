import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateText, streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { getAgentPrompt } from '@/lib/ai-agents';

// POST: Stream AI agent response
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { agent_type, message, conversation_id, context } = body;

    if (!agent_type || !message) {
      return NextResponse.json(
        { error: 'agent_type and message are required' },
        { status: 400 }
      );
    }

    // Create or use existing conversation
    let convId = conversation_id;
    if (!convId) {
      const { data: conv, error: convError } = await supabase
        .from('ai_conversations')
        .insert([
          {
            user_id: user.id,
            agent_type,
            title: message.substring(0, 50),
          },
        ])
        .select()
        .single();

      if (convError) throw convError;
      convId = conv.id;
    }

    // Get agent system prompt
    const systemPrompt = getAgentPrompt(agent_type as any);

    // Save user message
    await supabase.from('ai_messages').insert([
      {
        conversation_id: convId,
        sender: 'user',
        content: message,
        message_type: 'text',
      },
    ]);

    // Stream response using Vercel AI SDK
    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system: systemPrompt + (context ? `\n\nStudent Context: ${JSON.stringify(context)}` : ''),
      prompt: message,
      temperature: 0.7,
      maxTokens: 1500,
    });

    // Collect full response for saving
    let fullResponse = '';

    // Create a ReadableStream that processes the AI response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.textStream) {
          fullResponse += chunk;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: chunk })}\n\n`));
        }

        // Save agent response after streaming completes
        await supabase.from('ai_messages').insert([
          {
            conversation_id: convId,
            sender: 'agent',
            content: fullResponse,
            message_type: 'text',
          },
        ]);

        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true, conversation_id: convId })}\n\n`));
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
