import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import axios from 'axios';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// POST: Initialize Paystack transaction
export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET) {
      throw new Error('PAYSTACK_SECRET_KEY not configured');
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { amount, courseId, email, metadata } = body;

    if (!amount || !courseId || !email) {
      return NextResponse.json(
        { error: 'amount, courseId, and email are required' },
        { status: 400 }
      );
    }

    // Create payment record first
    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    const { data: payment, error: paymentError } = await supabaseServer
      .from('payments')
      .insert([
        {
          student_id: user.id,
          course_id: courseId,
          amount,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (paymentError) throw paymentError;

    // Initialize Paystack transaction
    const response = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      {
        email,
        amount: Math.round(amount * 100), // Paystack uses kobo (1 naira = 100 kobo)
        metadata: {
          student_id: user.id,
          course_id: courseId,
          payment_id: payment.id,
          ...metadata,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to initialize payment');
    }

    return NextResponse.json({
      authorization_url: response.data.data.authorization_url,
      access_code: response.data.data.access_code,
      reference: response.data.data.reference,
      payment_id: payment.id,
    });
  } catch (error: any) {
    console.error('Paystack initialization error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
