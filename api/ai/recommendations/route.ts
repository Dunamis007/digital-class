import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { z } from 'zod';

// Schema for recommendations
const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      course_id: z.string().optional(),
      course_title: z.string(),
      reason: z.string(),
      difficulty: z.string(),
      estimated_hours: z.number(),
    })
  ),
  learning_path: z.object({
    current_level: z.string(),
    target_level: z.string(),
    estimated_weeks: z.number(),
    milestones: z.array(z.string()),
  }),
});

// POST: Get AI-powered course recommendations
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

    // Get user's enrolled courses and progress
    const { data: enrollments } = await supabase
      .from('enrollments')
      .select('*, courses(*)')
      .eq('student_id', user.id);

    const { data: stats } = await supabase
      .from('user_stats')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Get available courses
    const { data: allCourses } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true);

    const context = `
      Student Learning Context:
      - Completed Courses: ${enrollments?.length || 0}
      - Total Points: ${stats?.total_points || 0}
      - Courses Completed: ${stats?.courses_completed || 0}
      - Current Interests: ${body.interests?.join(', ') || 'Not specified'}
      - Goal: ${body.goal || 'Not specified'}
      - Time Available: ${body.hours_per_week || 10} hours/week
      
      Available Courses:
      ${allCourses?.map(c => `- ${c.title} (${c.category}, ${c.level})`).join('\n') || 'None'}
    `;

    const { object } = await generateObject({
      model: openai('gpt-4-turbo'),
      system: `You are Nexus, an AI course recommendation engine at Dunamis EdTech. 
        Analyze the student's learning history and provide personalized course recommendations.
        Consider their completed courses, learning goals, and available time.
        Recommend courses that build on existing knowledge or explore new areas aligned with their goals.`,
      prompt: `${context}\n\nProvide recommendations for: ${body.preferences || 'general skill development'}`,
      schema: RecommendationSchema,
      temperature: 0.7,
    });

    // Save recommendations to database
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    for (const rec of object.recommendations) {
      await supabaseServer.from('recommendations').insert([
        {
          user_id: user.id,
          course_id: rec.course_id,
          recommendation_reason: rec.reason,
          relevance_score: Math.random() * 100, // Placeholder
        },
      ]);
    }

    return NextResponse.json({
      recommendations: object.recommendations,
      learning_path: object.learning_path,
    });
  } catch (error: any) {
    console.error('Recommendation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}
