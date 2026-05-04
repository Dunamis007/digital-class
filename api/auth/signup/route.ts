import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { generateStudentId, getInitialTokens } from '@/lib/engines/student-utils';

/**
 * POST /api/auth/signup
 * Creates student profile after Supabase auth signup
 */
export async function POST(request: NextRequest) {
  try {
    const { userId, email, firstName, lastName, phone } = await request.json();

    if (!userId || !email) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, email' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if student profile already exists
    const { data: existingStudent, error: checkError } = await supabase
      .from('student_academic_profiles')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (!checkError && existingStudent) {
      // Student already exists
      return NextResponse.json({
        success: true,
        message: 'Student profile already exists',
        userId,
      });
    }

    // Set default values for onboarding if not provided
    const facultyCode = 'GENERAL';
    const departmentCode = 'GEN';
    const currentYear = new Date().getFullYear();

    // Generate student ID
    let studentId: string;
    try {
      studentId = await generateStudentId(facultyCode, departmentCode, currentYear);
    } catch (err) {
      console.error('[v0] Failed to generate student ID:', err);
      // Generate a simple fallback ID if function fails
      studentId = `DUN/${currentYear}/${facultyCode}/${departmentCode}/${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
    }

    // Get initial tokens (welcome bonus)
    const initialTokens = getInitialTokens();

    // Create student profile
    const { data: newStudent, error: createError } = await supabase
      .from('student_academic_profiles')
      .insert([
        {
          user_id: userId,
          student_id: studentId,
          faculty_id: null, // To be set during onboarding
          department_id: null, // To be set during onboarding
          current_tokens: initialTokens,
          token_level: 'ajebutter_freshman',
          tokens_earned_all_time: initialTokens,
          current_cgpa: 0,
          is_active: true,
        },
      ])
      .select()
      .single();

    if (createError) {
      console.error('[v0] Failed to create student profile:', createError);
      return NextResponse.json(
        { error: 'Failed to create student profile', details: createError.message },
        { status: 500 }
      );
    }

    // Create initial token transaction record for welcome bonus
    const { error: tokenError } = await supabase
      .from('token_transactions')
      .insert([
        {
          user_id: userId,
          amount: initialTokens,
          type: 'earn',
          rule_type: 'welcome_bonus',
          reference_type: 'signup',
          metadata: {
            signup_email: email,
            first_name: firstName,
            last_name: lastName,
          },
        },
      ]);

    if (tokenError) {
      console.error('[v0] Failed to create welcome token transaction:', tokenError);
      // This is not critical - student profile was created
    }

    return NextResponse.json({
      success: true,
      message: 'Student profile created successfully',
      student: {
        userId: newStudent.user_id,
        studentId: newStudent.student_id,
        initialTokens: newStudent.current_tokens,
      },
    });
  } catch (error) {
    console.error('[v0] Signup API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
