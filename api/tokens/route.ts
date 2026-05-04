// API: Token operations - earn, lose, and get stats
import { NextRequest, NextResponse } from 'next/server';
import { getTokenEngine } from '@/lib/engines/token-engine';

// GET: Get token stats and history
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const historyLimit = parseInt(searchParams.get('history_limit') || '20');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const tokenEngine = getTokenEngine();
    const stats = await tokenEngine.getTokenStats(userId);

    if (!stats) {
      return NextResponse.json(
        { error: 'Student profile not found' },
        { status: 404 }
      );
    }

    // Get more transaction history if requested
    let transactions = stats.recentTransactions;
    if (historyLimit > 10) {
      transactions = await tokenEngine.getTransactionHistory(userId, { limit: historyLimit });
    }

    return NextResponse.json({
      success: true,
      stats: {
        currentTokens: stats.currentTokens,
        tokenLevel: stats.tokenLevel,
        levelInfo: stats.levelInfo,
        progress: stats.progress,
        earnedAllTime: stats.earnedAllTime,
        lostAllTime: stats.lostAllTime,
      },
      transactions,
    });
  } catch (error) {
    console.error('Token stats API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Earn or lose tokens
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      action, // 'earn' or 'lose'
      rule_type,
      reference_type,
      reference_id,
      metadata,
      custom_amount,
    } = body;

    if (!user_id || !action || !rule_type) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, action, rule_type' },
        { status: 400 }
      );
    }

    if (action !== 'earn' && action !== 'lose') {
      return NextResponse.json(
        { error: 'action must be "earn" or "lose"' },
        { status: 400 }
      );
    }

    const options = {
      referenceType: reference_type,
      referenceId: reference_id,
      metadata,
      customAmount: custom_amount,
    };

    let result;
    if (action === 'earn') {
      result = await tokenEngine.earnTokens(user_id, rule_type, options);
    } else {
      result = await tokenEngine.loseTokens(user_id, rule_type, options);
    }

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error('Token operation API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
