import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

/**
 * GET /api/student-dashboard?user_id=xxx
 * Aggregates all student dashboard data: profile, tokens, grades, activities, upcoming deadlines
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const supabase = createClient();

    // Check if this is a mock user (for testing without Supabase)
    const isMockUser = userId === 'test-user-12345' || userId.startsWith('demo-')

    let profile = null
    let profileError = null

    if (!isMockUser) {
      // Get student academic profile with relationships from Supabase
      const result = await supabase
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

      profile = result.data
      profileError = result.error
    } else {
      // Return mock profile data for testing
      profile = {
        id: 'mock-profile-1',
        user_id: userId,
        student_id: 'DUN/2024/COMP/CS/00001',
        first_name: 'Test',
        last_name: 'Student',
        email: 'test@dunamis.edu',
        phone: '+234 801 234 5678',
        date_of_birth: '2000-01-15',
        gender: 'M',
        nationality: 'Nigerian',
        state_of_origin: 'Lagos',
        current_tokens: 850,
        current_cgpa: 3.85,
        total_gpa: 3.85,
        faculty: { id: '1', name: 'Science and Technology', code: 'STECH', color: '#3B82F6', icon: '🔬' },
        department: { id: '1', name: 'Computer Science', code: 'COMP' },
        programme: { id: '1', name: 'B.Sc. Computer Science', code: 'CS' },
        current_level: { id: '3', level_number: 300, name: '300 Level' },
        current_semester: { id: '1', name: 'First Semester', number: 1, session: { name: '2023/2024' } },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }

    if (profileError && !isMockUser) {
      return NextResponse.json(
        { error: 'Student profile not found', onboarded: false },
        { status: 404 }
      );
    }

    let tokenStats, recentGrades, semesterGpas, activities, courseRegistrations, attendanceRecords

    if (!isMockUser) {
      // Get token stats
      const { data } = await supabase
        .from('token_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(10);
      tokenStats = data;

      // Get recent grades
      const { data: grades } = await supabase
        .from('student_grades')
        .select('*, course:courses(id, title, code)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      recentGrades = grades;

      // Get semester GPA history
      const { data: gpas } = await supabase
        .from('semester_gpas')
        .select('*, semester:semesters(id, name, number)')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(3);
      semesterGpas = gpas;

      // Get recent activities
      const { data: act } = await supabase
        .from('student_activities')
        .select('*')
        .eq('user_id', userId)
        .order('activity_date', { ascending: false })
        .limit(10);
      activities = act;

      // Get course registrations for current semester
      const { data: courses } = await supabase
        .from('course_registrations')
        .select('*, course:courses(id, title, code, credit_units)')
        .eq('user_id', userId)
        .eq('is_registered', true)
        .limit(10);
      courseRegistrations = courses;

      // Get attendance summary
      const { data: attendance } = await supabase
        .from('attendance_records')
        .select('is_present')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      attendanceRecords = attendance;
    } else {
      // Return mock data for testing
      tokenStats = [
        { id: '1', user_id: userId, amount: 50, type: 'earn', reason: 'Attendance', created_at: new Date().toISOString() },
        { id: '2', user_id: userId, amount: 100, type: 'earn', reason: 'Quiz passed', created_at: new Date().toISOString() },
        { id: '3', user_id: userId, amount: -10, type: 'lose', reason: 'Late submission', created_at: new Date().toISOString() },
      ]
      recentGrades = [
        { id: '1', user_id: userId, course_id: '1', score: 85, grade: 'A', course: { id: '1', title: 'Data Structures', code: 'CS201' }, created_at: new Date().toISOString() },
        { id: '2', user_id: userId, course_id: '2', score: 78, grade: 'B+', course: { id: '2', title: 'Database Systems', code: 'CS202' }, created_at: new Date().toISOString() },
      ]
      semesterGpas = [
        { id: '1', user_id: userId, semester_id: '1', gpa: 3.85, semester: { id: '1', name: 'First Semester', number: 1 }, created_at: new Date().toISOString() },
      ]
      activities = [
        { id: '1', user_id: userId, activity_type: 'attendance', activity_date: new Date().toISOString(), description: 'Attended Data Structures lecture' },
        { id: '2', user_id: userId, activity_type: 'quiz', activity_date: new Date().toISOString(), description: 'Completed Database Systems quiz' },
      ]
      courseRegistrations = [
        { id: '1', user_id: userId, course_id: '1', is_registered: true, course: { id: '1', title: 'Data Structures', code: 'CS201', credit_units: 3 } },
        { id: '2', user_id: userId, course_id: '2', is_registered: true, course: { id: '2', title: 'Database Systems', code: 'CS202', credit_units: 4 } },
      ]
      attendanceRecords = Array.from({ length: 15 }, (_, i) => ({
        is_present: i % 3 !== 0, // 2 out of 3 present
        created_at: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
      }))
    }

    const attendanceStats = attendanceRecords ? {
      total: attendanceRecords.length,
      present: attendanceRecords.filter(r => r.is_present).length,
      rate: attendanceRecords.length > 0 
        ? Math.round((attendanceRecords.filter(r => r.is_present).length / attendanceRecords.length) * 100)
        : 0,
    } : { total: 0, present: 0, rate: 0 };

    return NextResponse.json({
      success: true,
      profile,
      stats: {
        currentTokens: profile.current_tokens,
        tokenLevel: profile.token_level,
        currentCgpa: profile.current_cgpa,
        totalLessonsCompleted: profile.total_lessons_completed,
        totalQuizzesPassed: profile.total_quizzes_passed,
        loginStreak: profile.current_login_streak,
      },
      recentTransactions: tokenStats || [],
      recentGrades: recentGrades || [],
      semesterGpas: semesterGpas || [],
      courseRegistrations: courseRegistrations || [],
      activities: activities || [],
      attendance: attendanceStats,
    });
  } catch (error) {
    console.error('Student dashboard API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
