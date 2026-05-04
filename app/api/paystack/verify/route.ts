import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// POST: Verify Paystack transaction
export async function POST(request: NextRequest) {
  try {
    if (!PAYSTACK_SECRET) {
      throw new Error('PAYSTACK_SECRET_KEY not configured');
    }

    const body = await request.json();
    const { reference, paymentId } = body;

    if (!reference) {
      return NextResponse.json(
        { error: 'reference is required' },
        { status: 400 }
      );
    }

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Verify with Paystack
    const response = await axios.get(
      `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET}`,
        },
      }
    );

    if (!response.data.status) {
      throw new Error(response.data.message || 'Failed to verify payment');
    }

    const transactionData = response.data.data;

    if (transactionData.status === 'success') {
      // Update payment record
      const { data: payment, error: paymentError } = await supabaseServer
        .from('payments')
        .update({
          status: 'completed',
          paystack_reference: reference,
          completed_at: new Date().toISOString(),
        })
        .eq('id', paymentId)
        .select()
        .single();

      if (paymentError) throw paymentError;

      // Create enrollment
      const { data: enrollment, error: enrollmentError } = await supabaseServer
        .from('enrollments')
        .insert([
          {
            student_id: transactionData.metadata.student_id,
            course_id: transactionData.metadata.course_id,
            enrollment_status: 'active',
            progress_percentage: 0,
          },
        ])
        .select()
        .single();

      if (enrollmentError && enrollmentError.code !== '23505') { // Ignore duplicate key error
        throw enrollmentError;
      }

      // Add transaction to wallet
      const { data: wallet } = await supabaseServer
        .from('wallets')
        .select('*')
        .eq('user_id', transactionData.metadata.student_id)
        .single();

      if (wallet) {
        const newBalance = wallet.balance + transactionData.amount / 100;

        await supabaseServer
          .from('transactions')
          .insert([
            {
              wallet_id: wallet.id,
              transaction_type: 'purchase',
              amount: transactionData.amount / 100,
              balance_before: wallet.balance,
              balance_after: newBalance,
              status: 'completed',
              reference_id: reference,
              description: `Course purchase - Reference: ${reference}`,
            },
          ]);

        await supabaseServer
          .from('wallets')
          .update({ balance: newBalance })
          .eq('id', wallet.id);
      }

      return NextResponse.json({
        success: true,
        message: 'Payment verified successfully',
        payment,
        transaction: transactionData,
      });
    } else {
      // Payment failed
      await supabaseServer
        .from('payments')
        .update({
          status: 'failed',
          paystack_reference: reference,
        })
        .eq('id', paymentId);

      return NextResponse.json(
        { error: 'Payment verification failed', status: transactionData.status },
        { status: 400 }
      );
    }
  } catch (error: any) {
    console.error('Paystack verification error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify payment' },
      { status: 500 }
    );
  }
}
