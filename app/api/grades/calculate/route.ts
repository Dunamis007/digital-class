// API: GPA/CGPA calculation utilities
import { NextRequest, NextResponse } from 'next/server';
import {
  scoreToGrade,
  gradeToPoints,
  calculateAdjustedScore,
  calculateGPA,
  calculateQualityPoints,
  getCGPACalculator,
} from '@/lib/engines/cgpa-calculator';
import type { TokenLevel } from '@/lib/types/school-system';

// POST: Calculate what-if GPA scenarios
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      user_id,
      hypothetical_grades, // Array of { credit_units, expected_grade } or { credit_units, expected_score, token_level }
    } = body;

    if (!hypothetical_grades || !Array.isArray(hypothetical_grades)) {
      return NextResponse.json(
        { error: 'hypothetical_grades array is required' },
        { status: 400 }
      );
    }

    // Get current user stats if user_id provided
    const cgpaCalculator = getCGPACalculator();
    let currentTotalCredits = 0;
    let currentTotalQualityPoints = 0;

    if (user_id) {
      const { cgpa, grades } = await cgpaCalculator.getUserGrades(user_id);
      for (const grade of grades) {
        currentTotalCredits += grade.credit_units;
        currentTotalQualityPoints += grade.quality_points;
      }
    }

    // Process hypothetical grades
    const processedGrades: { creditUnits: number; gradePoints: number; grade: string }[] = [];

    for (const hypo of hypothetical_grades) {
      const creditUnits = hypo.credit_units || 3;
      let gradePoints: number;
      let gradeLetter: string;

      if (hypo.expected_grade) {
        // Direct grade provided
        gradeLetter = hypo.expected_grade;
        gradePoints = gradeToPoints(gradeLetter);
      } else if (hypo.expected_score !== undefined) {
        // Score provided, convert to grade
        const tokenLevel = (hypo.token_level || 'ajebutter_freshman') as TokenLevel;
        const { adjustedScore } = calculateAdjustedScore(hypo.expected_score, tokenLevel);
        gradeLetter = scoreToGrade(adjustedScore);
        gradePoints = gradeToPoints(gradeLetter);
      } else {
        continue;
      }

      processedGrades.push({
        creditUnits,
        gradePoints,
        grade: gradeLetter,
      });
    }

    // Calculate projected GPA
    const projectedCGPA = cgpaCalculator.calculateWhatIfGPA(
      currentTotalCredits,
      currentTotalQualityPoints,
      processedGrades
    );

    // Calculate GPA for just the hypothetical courses
    let hypoCredits = 0;
    let hypoQualityPoints = 0;
    for (const g of processedGrades) {
      hypoCredits += g.creditUnits;
      hypoQualityPoints += g.creditUnits * g.gradePoints;
    }
    const hypotheticalGPA = calculateGPA(hypoQualityPoints, hypoCredits);

    return NextResponse.json({
      success: true,
      currentStats: {
        totalCredits: currentTotalCredits,
        totalQualityPoints: currentTotalQualityPoints,
        currentCGPA: currentTotalCredits > 0 
          ? calculateGPA(currentTotalQualityPoints, currentTotalCredits) 
          : 0,
      },
      hypotheticalGrades: processedGrades,
      hypotheticalGPA,
      projectedCGPA,
      newTotalCredits: currentTotalCredits + hypoCredits,
    });
  } catch (error) {
    console.error('GPA calculate API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET: Score to grade conversion utility
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const score = parseFloat(searchParams.get('score') || '0');
    const tokenLevel = (searchParams.get('token_level') || 'ajebutter_freshman') as TokenLevel;
    const creditUnits = parseInt(searchParams.get('credit_units') || '3');

    // Calculate adjusted score with token bonus
    const { tokenBonus, adjustedScore } = calculateAdjustedScore(score, tokenLevel);

    // Convert to grade
    const gradeLetter = scoreToGrade(adjustedScore);
    const gradePoints = gradeToPoints(gradeLetter);
    const qualityPoints = calculateQualityPoints(gradePoints, creditUnits);

    return NextResponse.json({
      success: true,
      rawScore: score,
      tokenLevel,
      tokenBonus: Math.round(tokenBonus * 100) / 100,
      adjustedScore,
      gradeLetter,
      gradePoints,
      creditUnits,
      qualityPoints,
    });
  } catch (error) {
    console.error('Score conversion API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
