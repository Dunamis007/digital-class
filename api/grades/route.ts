// API: Student grades and CGPA management
import { NextRequest, NextResponse } from 'next/server';
import { getCGPACalculator } from '@/lib/engines/cgpa-calculator';
import { createClient } from '@/lib/supabase';

// GET: Get grades for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id');
    const semesterId = searchParams.get('semester_id');

    if (!userId) {
      return NextResponse.json({ error: 'user_id is required' }, { status: 400 });
    }

    const cgpaCalculator = getCGPACalculator();
    const result = await cgpaCalculator.getUserGrades(userId, semesterId || undefined);

    // Get GPA history
    const gpaHistory = await cgpaCalculator.getGPAHistory(userId);

    // Get grade distribution
    const distribution = await cgpaCalculator.getGradeDistribution(userId);

    return NextResponse.json({
      success: true,
      grades: result.grades,
      semesterGPA: result.semesterGPA,
      cgpa: result.cgpa,
      gpaHistory,
      gradeDistribution: distribution,
    });
  } catch (error) {
    console.error('Grades API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: Submit a grade
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      course_id,
      semester_id,
      continuous_assessment,
      exam_score,
    } = body;

    if (!user_id || !course_id || !semester_id) {
      return NextResponse.json(
        { error: 'Missing required fields: user_id, course_id, semester_id' },
        { status: 400 }
      );
    }

    if (continuous_assessment === undefined || exam_score === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: continuous_assessment, exam_score' },
        { status: 400 }
      );
    }

    const result = await cgpaCalculator.submitGrade(user_id, course_id, semester_id, {
      continuousAssessment: continuous_assessment,
      examScore: exam_score,
    });

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 400 }
      );
    }

    // Get updated CGPA
    const updatedGrades = await cgpaCalculator.getUserGrades(user_id);

    return NextResponse.json({
      success: true,
      grade: result.grade,
      message: result.message,
      cgpa: updatedGrades.cgpa,
    });
  } catch (error) {
    console.error('Grade submit API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
