// API: Get all faculties with their departments
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();
    const { searchParams } = new URL(request.url);
    const includeDepartments = searchParams.get('include_departments') === 'true';

    let query = supabase
      .from('faculties')
      .select(includeDepartments ? '*, departments(*)' : '*')
      .eq('is_active', true)
      .order('name');

    const { data, error } = await query;

    if (error) {
      console.error('Faculties fetch error:', error);
      return NextResponse.json({ error: 'Failed to fetch faculties' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      faculties: data || [],
    });
  } catch (error) {
    console.error('Faculties API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
