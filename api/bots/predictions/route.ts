import { NextRequest, NextResponse } from 'next/server';
import { getBotPredictionEngine } from '@/lib/engines/bot-predictions';

/**
 * GET /api/bots/predictions?user_id=xxx
 * Get predictive risk assessment for a student
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('user_id');
    const riskType = searchParams.get('type'); // 'attendance', 'academic', 'engagement', 'all'

    if (!userId) {
      return NextResponse.json(
        { error: 'user_id parameter is required' },
        { status: 400 }
      );
    }

    const predictionEngine = getBotPredictionEngine();

    if (riskType === 'attendance') {
      const risk = await predictionEngine.predictAttendanceRisk(userId);
      return NextResponse.json({
        success: true,
        risk_type: 'attendance',
        risk,
      });
    }

    if (riskType === 'academic') {
      const risk = await predictionEngine.predictAcademicRisk(userId);
      return NextResponse.json({
        success: true,
        risk_type: 'academic',
        risk,
      });
    }

    if (riskType === 'engagement') {
      const risk = await predictionEngine.predictEngagementRisk(userId);
      return NextResponse.json({
        success: true,
        risk_type: 'engagement',
        risk,
      });
    }

    // Default: return comprehensive assessment
    const assessment = await predictionEngine.generateRiskAssessment(userId);
    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (error) {
    console.error('Bot predictions API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
