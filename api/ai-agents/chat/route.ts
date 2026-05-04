import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

// POST /api/ai-agents/chat
// Stream chat responses from AI agents
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get("Authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(auth.replace("Bearer ", ""));

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const {
      conversationId,
      agentType,
      message,
      courseId,
    } = await request.json();

    if (!agentType || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Get conversation or create it
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let conversation = conversationId;

    if (!conversation) {
      const { data: newConv, error: convError } = await supabaseAdmin
        .from("ai_agent_conversations")
        .insert({
          user_id: user.id,
          agent_type: agentType,
          course_id: courseId,
          is_active: true,
        })
        .select()
        .single();

      if (convError) throw convError;
      conversation = newConv.id;
    }

    // Store user message
    await supabaseAdmin.from("agent_messages").insert({
      conversation_id: conversation,
      role: "user",
      content: message,
      message_type: "text",
    });

    // Generate system prompt based on agent type
    const systemPrompts: Record<string, string> = {
      nexus:
        "You are Nexus, an AI course discovery agent for Dunamis EdTech. Help students find the perfect courses based on their learning goals, skill level, and interests. Be enthusiastic and encouraging.",
      pair: "You are Pair, an AI study partner for Dunamis EdTech. Help students understand course material by explaining concepts, answering questions, and providing examples. Be patient and thorough.",
      time_sentinel:
        "You are Time Sentinel, a learning schedule optimizer. Help students manage their learning time, create study plans, set goals, and stay on track. Be practical and supportive.",
      spark:
        "You are Spark, a personalized learning path generator. Create customized learning journeys based on student goals, pace, and preferences. Be creative and adaptive.",
      mentor:
        "You are Mentor, a doubt resolution specialist. Help resolve student queries about course content, provide detailed explanations, and guide thinking. Be clear and comprehensive.",
    };

    // Stream response using Vercel AI SDK
    const result = await streamText({
      model: openai("gpt-4-turbo"),
      system: systemPrompts[agentType] || systemPrompts.nexus,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });

    // Collect full response for storage
    let fullResponse = "";

    const stream = result.toAIStream({
      onFinal: async (completion) => {
        fullResponse = completion;

        // Store agent response
        await supabaseAdmin.from("agent_messages").insert({
          conversation_id: conversation,
          role: "agent",
          content: fullResponse,
          message_type: "text",
        });

        // Award points for agent interaction
        await supabaseAdmin
          .from("point_transactions")
          .insert({
            user_id: user.id,
            points: 10,
            transaction_type: "agent_interaction",
            reference_id: conversation,
          });
      },
    });

    return new NextResponse(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("AI agent error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process request" },
      { status: 500 }
    );
  }
}
