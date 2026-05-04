// API: Get departments, optionally filtered by faculty
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const facultyId = searchParams.get('faculty_id');
    const includeProgrammes = searchParams.get('include_programmes') === 'true';

    let query = supabase
      .from('departments')
      .select(
        includeProgrammes
          ? '*, faculty:faculties(id, name, code), programmes(*)'
          : '*, faculty:faculties(id, name, code)'
      )
      .eq('is_active', true)
      .order('name');

    if (facultyId) {
      query = query.eq('faculty_id', facultyId);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Departments fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch departments' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      departments: data || [],
    });
  } catch (error) {
    console.error('Departments API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
