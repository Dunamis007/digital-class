import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { createClient } from '@supabase/supabase-js'

// Get all published courses or filter by category
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabaseServer
      .from('courses')
      .select('*, instructor:courses(instructor_id)')
      .eq('is_published', true)
      .eq('is_archived', false)
      .limit(limit)

    if (category) {
      query = query.eq('category', category)
    }

    const { data, error } = await query.order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Create new course (instructor only)
export async function POST(request: NextRequest) {
  try {
    const auth = request.headers.get('Authorization')
    if (!auth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const {
      data: { user },
      error: authError
    } = await supabase.auth.getUser(auth.replace('Bearer ', ''))

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, category, level, duration_hours, price } = body

    const { data, error } = await supabaseServer
      .from('courses')
      .insert([
        {
          instructor_id: user.id,
          title,
          description,
          category,
          level,
          duration_hours,
          price,
          is_published: false
        }
      ])
      .select()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json(data[0], { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
