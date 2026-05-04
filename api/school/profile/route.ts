// API: Get and update student academic profile
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import { getTokenEngine } from '@/lib/engines/token-engine';

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
        faculty:faculties(id, name, code, color, icon, description),
        department:departments(id, name, code, description),
        programme:programmes(id, name, code, duration_years),
        current_level:academic_levels(id, level_number, name),
        current_semester:semesters(
          id, name, number,
          session:academic_sessions(id, name, start_date, end_date)
        ),
        user:users(id, full_name, email, avatar_url)
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Academic profile not found. Please complete onboarding.' },
          { status: 404 }
        );
      }
      console.error('Profile fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
    }

    // Get token stats
    const tokenEngine = getTokenEngine();
    const tokenStats = await tokenEngine.getTokenStats(userId);

    return NextResponse.json({
      success: true,
      profile,
      tokenStats,
    });
  } catch (error) {
    console.error('Profile API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const supabase = createClient();
    const body = await request.json();
    const { user_id, ...updates } = body;

    if (!user_id) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    // Allowed update fields
    const allowedFields = ['study_mode', 'programme_id', 'current_level_id'];
    const filteredUpdates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (updates[field] !== undefined) {
        filteredUpdates[field] = updates[field];
      }
    }

    if (Object.keys(filteredUpdates).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    filteredUpdates.updated_at = new Date().toISOString();

    const { data: profile, error } = await supabase
      .from('student_academic_profiles')
      .update(filteredUpdates)
      .eq('user_id', user_id)
      .select(`
        *,
        faculty:faculties(id, name, code),
        department:departments(id, name, code),
        programme:programmes(id, name, code),
        current_level:academic_levels(id, level_number, name)
      `)
      .single();

    if (error) {
      console.error('Profile update error:', error);
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      profile,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Profile update API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
