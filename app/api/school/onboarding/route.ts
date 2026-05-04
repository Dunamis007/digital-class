// API: Student academic onboarding - creates academic profile with generated student ID
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import type { StudyMode, StudentAcademicProfile } from '@/lib/types/school-system';
import { generateInitialProfile } from '@/lib/engines/student-utils';

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();

    const {
      user_id,
      faculty_id,
      department_id,
      programme_id,
      study_mode,
      current_level,
    } = body;

    // Validate required fields
    if (!user_id || !faculty_id || !department_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, faculty_id, department_id' },
        { status: 400 }
      );
    }

    // Check if user already has an academic profile
    const { data: existingProfile } = await supabase
      .from('student_academic_profiles')
      .select('id, student_id')
      .eq('user_id', user_id)
      .single();

    if (existingProfile) {
      return NextResponse.json(
        {
          success: false,
          error: 'User already has an academic profile',
          profile: existingProfile,
        },
        { status: 409 }
      );
    }

    // Get faculty and department codes for student ID generation
    const { data: faculty, error: facultyError } = await supabase
      .from('faculties')
      .select('code')
      .eq('id', faculty_id)
      .single();

    if (facultyError || !faculty) {
      return NextResponse.json({ error: 'Invalid faculty' }, { status: 400 });
    }

    const { data: department, error: deptError } = await supabase
      .from('departments')
      .select('code')
      .eq('id', department_id)
      .single();

    if (deptError || !department) {
      return NextResponse.json({ error: 'Invalid department' }, { status: 400 });
    }

    // Get current academic year
    const admissionYear = new Date().getFullYear();

    // Generate student ID using the database function
    const { data: studentIdResult, error: idError } = await supabase.rpc('generate_student_id', {
      p_faculty_code: faculty.code,
      p_department_code: department.code,
      p_admission_year: admissionYear,
    });

    if (idError) {
      console.error('Student ID generation error:', idError);
      // Fallback: generate manually
      const { data: sequence } = await supabase
        .from('student_id_sequences')
        .select('last_number')
        .eq('faculty_code', faculty.code)
        .eq('department_code', department.code)
        .eq('admission_year', admissionYear)
        .single();

      const nextNumber = (sequence?.last_number || 0) + 1;
      
      // Update or create sequence
      await supabase.from('student_id_sequences').upsert({
        faculty_code: faculty.code,
        department_code: department.code,
        admission_year: admissionYear,
        last_number: nextNumber,
      }, {
        onConflict: 'faculty_code,department_code,admission_year',
      });
    }

    const studentId = studentIdResult || 
      `DUN/${admissionYear}/${faculty.code}/${department.code}/${String(Math.floor(Math.random() * 99999)).padStart(5, '0')}`;

    // Get current semester
    const { data: currentSemester } = await supabase
      .from('semesters')
      .select('id')
      .eq('is_current', true)
      .single();

    // Get the level if specified
    let levelId = null;
    if (current_level) {
      const { data: level } = await supabase
        .from('academic_levels')
        .select('id')
        .eq('level_number', current_level)
        .single();
      levelId = level?.id;
    } else {
      // Default to 100 level
      const { data: level } = await supabase
        .from('academic_levels')
        .select('id')
        .eq('level_number', 100)
        .single();
      levelId = level?.id;
    }

    // Create academic profile using utility
    const profileData = generateInitialProfile(user_id, studentId, faculty_id, department_id, {
      programmeId: programme_id,
      currentLevelId: levelId,
      currentSemesterId: currentSemester?.id,
      studyMode: (study_mode || 'online') as StudyMode,
      admissionYear,
    });

    const { data: profile, error: profileError } = await supabase
      .from('student_academic_profiles')
      .insert(profileData)
      .select(`
        *,
        faculty:faculties(id, name, code, color, icon),
        department:departments(id, name, code),
        programme:programmes(id, name, code),
        current_level:academic_levels(id, level_number, name)
      `)
      .single();

    if (profileError) {
      console.error('Profile creation error:', profileError);
      return NextResponse.json(
        { error: 'Failed to create academic profile', details: profileError.message },
        { status: 500 }
      );
    }

    // Update user role to student if not already set
    await supabase
      .from('users')
      .update({ role: 'student' })
      .eq('id', user_id)
      .is('role', null);

    return NextResponse.json({
      success: true,
      profile: profile as StudentAcademicProfile,
      student_id: studentId,
      message: `Welcome to Dunamis! Your student ID is ${studentId}`,
    });
  } catch (error) {
    console.error('Onboarding API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Check onboarding status
export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const { data: profile, error } = await supabase
      .from('student_academic_profiles')
      .select(`
        *,
        faculty:faculties(id, name, code, color, icon),
        department:departments(id, name, code),
        programme:programmes(id, name, code),
        current_level:academic_levels(id, level_number, name),
        current_semester:semesters(id, name, number, session:academic_sessions(name))
      `)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      is_onboarded: !!profile,
      profile: profile || null,
    });
  } catch (error) {
    console.error('Onboarding status API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
