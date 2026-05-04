// API: Get academic sessions and semesters
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const currentOnly = searchParams.get('current_only') === 'true';

    // Get academic sessions with their semesters
    let sessionsQuery = supabase
      .from('academic_sessions')
      .select('*, semesters(*)')
      .eq('is_active', true)
      .order('start_date', { ascending: false });

    if (currentOnly) {
      sessionsQuery = sessionsQuery.eq('is_current', true);
    }

    const { data: sessions, error: sessionsError } = await sessionsQuery;

    if (sessionsError) {
      console.error('Sessions fetch error:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    // Get academic levels
    const { data: levels, error: levelsError } = await supabase
      .from('academic_levels')
      .select('*')
      .order('level_number');

    if (levelsError) {
      console.error('Levels fetch error:', levelsError);
      return NextResponse.json({ error: 'Failed to fetch levels' }, { status: 500 });
    }

    // Find current semester
    const currentSession = sessions?.find(s => s.is_current);
    const currentSemester = currentSession?.semesters?.find((sem: { is_current: boolean }) => sem.is_current);

    return NextResponse.json({
      success: true,
      sessions: sessions || [],
      levels: levels || [],
      currentSession,
      currentSemester,
    });
  } catch (error) {
    console.error('Semesters API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
