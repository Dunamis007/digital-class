import { NextRequest, NextResponse } from 'next/server'

// Mock test user - hardcoded for testing
const MOCK_USER = {
  id: 'test-user-12345',
  email: 'test@dunamis.edu',
  firstName: 'Test',
  lastName: 'Student',
  studentId: 'DUN/2024/COMP/CS/00001',
}

/**
 * POST /api/auth/mock-login
 * Temporary mock authentication for testing dashboard and bots
 * Returns a test user session that can be used throughout the app
 */
export async function POST(request: NextRequest) {
  try {
    // Create a mock session token
    const mockToken = `mock-session-${Date.now()}`
    
    // Set session in response headers (for future requests)
    const response = NextResponse.json(
      {
        success: true,
        user: MOCK_USER,
        session: {
          access_token: mockToken,
          user: MOCK_USER,
        },
      },
      { status: 200 }
    )

    // Set auth cookie that persists across refreshes
    response.cookies.set('auth-token', mockToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    })

    // Also set a mock user ID cookie for easy access
    response.cookies.set('mock-user-id', MOCK_USER.id, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return response
  } catch (err) {
    console.error('[v0] Mock login error:', err)
    return NextResponse.json(
      { error: 'Mock login failed' },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/mock-login
 * Returns the mock user info (for verifying session)
 */
export async function GET(request: NextRequest) {
  try {
    const mockUserId = request.cookies.get('mock-user-id')?.value

    if (!mockUserId) {
      return NextResponse.json(
        { error: 'No mock session found', user: null },
        { status: 401 }
      )
    }

    return NextResponse.json({
      success: true,
      user: MOCK_USER,
    })
  } catch (err) {
    console.error('[v0] Mock verify error:', err)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}
