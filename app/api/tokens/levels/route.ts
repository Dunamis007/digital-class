// API: Get token level thresholds and information
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase';
import {
  TOKEN_LEVEL_THRESHOLDS,
  TOKEN_LEVEL_NAMES,
  TOKEN_LEVEL_ICONS,
  TokenLevel,
} from '@/lib/types/school-system';

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient();

    // Try to get from database first (has perks info)
    const { data: dbLevels, error } = await supabase
      .from('token_level_thresholds')
      .select('*')
      .order('min_tokens');

    if (!error && dbLevels && dbLevels.length > 0) {
      return NextResponse.json({
        success: true,
        levels: dbLevels,
      });
    }

    // Fallback to constants
    const levels = (Object.keys(TOKEN_LEVEL_THRESHOLDS) as TokenLevel[]).map((level) => ({
      level,
      name: TOKEN_LEVEL_NAMES[level],
      icon: TOKEN_LEVEL_ICONS[level],
      min_tokens: TOKEN_LEVEL_THRESHOLDS[level].min,
      max_tokens: TOKEN_LEVEL_THRESHOLDS[level].max,
      cgpa_bonus: TOKEN_LEVEL_THRESHOLDS[level].bonus,
    }));

    return NextResponse.json({
      success: true,
      levels,
    });
  } catch (error) {
    console.error('Token levels API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
