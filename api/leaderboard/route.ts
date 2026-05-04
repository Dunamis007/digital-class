import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase";
import type { LeaderboardEntry, LeaderboardScope } from "@/lib/types/school-system";

/**
 * GET /api/leaderboard?scope=global&limit=50&offset=0
 * scope: 'global' | 'faculty' | 'department'
 * Fetch leaderboard entries based on tokens or CGPA
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const scope = (searchParams.get("scope") || "global") as LeaderboardScope;
    const faculty_id = searchParams.get("faculty_id");
    const department_id = searchParams.get("department_id");
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 200);
    const offset = parseInt(searchParams.get("offset") || "0");
    const metric = searchParams.get("metric") || "tokens"; // 'tokens' or 'cgpa'

    const supabase = createClient();

    // Build query for student profiles based on scope
    let query = supabase
      .from("student_academic_profiles")
      .select(`
        id,
        user_id,
        student_id,
        current_tokens,
        token_level,
        current_cgpa,
        total_lessons_completed,
        current_login_streak,
        faculty:faculties(id, name, code),
        department:departments(id, name, code),
        user:auth.users!inner(
          id,
          email,
          user_metadata(full_name)
        )
      `, { count: "exact" })
      .eq("is_active", true);

    // Apply scope filters
    if (scope === "faculty" && faculty_id) {
      query = query.eq("faculty_id", faculty_id);
    } else if (scope === "department" && department_id) {
      query = query.eq("department_id", department_id);
    }

    // Order by metric
    const orderColumn = metric === "cgpa" ? "current_cgpa" : "current_tokens";
    query = query.order(orderColumn, { ascending: false });

    // Apply pagination
    const { data: profiles, error, count } = await query.range(offset, offset + limit - 1);

    if (error) {
      console.error("Leaderboard fetch error:", error);
      return NextResponse.json(
        { error: "Failed to fetch leaderboard" },
        { status: 500 }
      );
    }

    // Transform to leaderboard entries
    const leaderboard: LeaderboardEntry[] = (profiles || []).map((profile: any, index: number) => ({
      rank: offset + index + 1,
      user_id: profile.user_id,
      student_id: profile.student_id,
      full_name: profile.user?.user_metadata?.full_name || "Anonymous",
      avatar_url: null,
      faculty_name: profile.faculty?.name || "Unknown",
      faculty_code: profile.faculty?.code || "N/A",
      department_name: profile.department?.name || "Unknown",
      department_code: profile.department?.code || "N/A",
      current_tokens: profile.current_tokens,
      token_level: profile.token_level,
      current_cgpa: profile.current_cgpa,
      total_lessons_completed: profile.total_lessons_completed,
      current_login_streak: profile.current_login_streak,
    }));

    return NextResponse.json({
      success: true,
      scope,
      metric,
      leaderboard,
      pagination: {
        limit,
        offset,
        total: count || 0,
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
