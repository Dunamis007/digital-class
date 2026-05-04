// API: Academic leaderboard with multi-scope filtering (global, faculty, department)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import type { LeaderboardScope, LeaderboardEntry, TokenLevel } from '@/lib/types/school-system';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);

    // Parse parameters
    const scope = (searchParams.get('scope') || 'global') as LeaderboardScope;
    const facultyId = searchParams.get('faculty_id');
    const departmentId = searchParams.get('department_id');
    const tokenLevel = searchParams.get('token_level') as TokenLevel | null;
    const sortBy = searchParams.get('sort_by') || 'tokens'; // 'tokens' or 'cgpa'
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    const userId = searchParams.get('user_id'); // To get user's rank

    // Build query
    let query = supabase
      .from('student_academic_profiles')
      .select(`
        id,
        user_id,
        student_id,
        current_tokens,
        token_level,
        current_cgpa,
        total_lessons_completed,
        current_login_streak,
        faculty:faculties(id, name, code, color),
        department:departments(id, name, code),
        user:users(id, full_name, avatar_url)
      `)
      .eq('is_active', true);

    // Apply scope filters
    if (scope === 'faculty' && facultyId) {
      query = query.eq('faculty_id', facultyId);
    } else if (scope === 'department' && departmentId) {
      query = query.eq('department_id', departmentId);
    }

    // Apply token level filter
    if (tokenLevel) {
      query = query.eq('token_level', tokenLevel);
    }

    // Apply sorting
    if (sortBy === 'cgpa') {
      query = query.order('current_cgpa', { ascending: false });
    } else {
      query = query.order('current_tokens', { ascending: false });
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Leaderboard fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
    }

    // Transform and add rankings
    const leaderboard: LeaderboardEntry[] = (data || []).map((entry, index) => ({
      rank: offset + index + 1,
      user_id: entry.user_id,
      student_id: entry.student_id,
      full_name: entry.user?.full_name || 'Anonymous',
      avatar_url: entry.user?.avatar_url,
      faculty_name: entry.faculty?.name || '',
      faculty_code: entry.faculty?.code || '',
      department_name: entry.department?.name || '',
      department_code: entry.department?.code || '',
      current_tokens: entry.current_tokens,
      token_level: entry.token_level as TokenLevel,
      current_cgpa: entry.current_cgpa,
      total_lessons_completed: entry.total_lessons_completed,
      current_login_streak: entry.current_login_streak,
    }));

    // Get user's rank if requested
    let userRank = null;
    if (userId) {
      // Find user in current results first
      const userInResults = leaderboard.find(e => e.user_id === userId);
      if (userInResults) {
        userRank = userInResults;
      } else {
        // Query user's rank
        const { data: userProfile } = await supabase
          .from('student_academic_profiles')
          .select(`
            id,
            user_id,
            student_id,
            current_tokens,
            token_level,
            current_cgpa,
            faculty:faculties(id, name, code),
            department:departments(id, name, code),
            user:users(full_name, avatar_url)
          `)
          .eq('user_id', userId)
          .single();

        if (userProfile) {
          // Count users ahead of this user
          let countQuery = supabase
            .from('student_academic_profiles')
            .select('id', { count: 'exact', head: true })
            .eq('is_active', true);

          if (scope === 'faculty' && facultyId) {
            countQuery = countQuery.eq('faculty_id', facultyId);
          } else if (scope === 'department' && departmentId) {
            countQuery = countQuery.eq('department_id', departmentId);
          }

          if (sortBy === 'cgpa') {
            countQuery = countQuery.gt('current_cgpa', userProfile.current_cgpa);
          } else {
            countQuery = countQuery.gt('current_tokens', userProfile.current_tokens);
          }

          const { count } = await countQuery;
          const rank = (count || 0) + 1;

          userRank = {
            rank,
            user_id: userProfile.user_id,
            student_id: userProfile.student_id,
            full_name: userProfile.user?.full_name || 'Anonymous',
            avatar_url: userProfile.user?.avatar_url,
            faculty_name: userProfile.faculty?.name || '',
            faculty_code: userProfile.faculty?.code || '',
            department_name: userProfile.department?.name || '',
            department_code: userProfile.department?.code || '',
            current_tokens: userProfile.current_tokens,
            token_level: userProfile.token_level as TokenLevel,
            current_cgpa: userProfile.current_cgpa,
          };
        }
      }
    }

    // Get total count for pagination
    let countQuery = supabase
      .from('student_academic_profiles')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true);

    if (scope === 'faculty' && facultyId) {
      countQuery = countQuery.eq('faculty_id', facultyId);
    } else if (scope === 'department' && departmentId) {
      countQuery = countQuery.eq('department_id', departmentId);
    }

    if (tokenLevel) {
      countQuery = countQuery.eq('token_level', tokenLevel);
    }

    const { count: totalCount } = await countQuery;

    return NextResponse.json({
      success: true,
      leaderboard,
      userRank,
      pagination: {
        total: totalCount || 0,
        limit,
        offset,
        hasMore: (offset + limit) < (totalCount || 0),
      },
      filters: {
        scope,
        facultyId,
        departmentId,
        tokenLevel,
        sortBy,
      },
    });
  } catch (error) {
    console.error('Leaderboard API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
