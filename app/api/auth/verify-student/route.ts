import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * POST /api/auth/verify-student
 * Verifies that a student profile exists for the logged-in user
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'Missing userId' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if student profile exists
    const { data: student, error: studentError } = await supabase
      .from('student_academic_profiles')
      .select('id, student_id, user_id, current_tokens, token_level, is_active')
      .eq('user_id', userId)
      .single();

    if (studentError) {
      if (studentError.code === 'PGRST116') {
        // Student profile doesn't exist
        return NextResponse.json(
          { error: 'Student profile not found. Please complete onboarding.' },
          { status: 404 }
        );
      }
      throw studentError;
    }

    if (!student.is_active) {
      return NextResponse.json(
        { error: 'Student account is inactive' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Student verified',
      student: {
        studentId: student.student_id,
        userId: student.user_id,
        currentTokens: student.current_tokens,
        tokenLevel: student.token_level,
      },
    });
  } catch (error) {
    console.error('[v0] Verify student API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
