import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { verifyPayment } from '@/lib/paystack'

export async function POST(request: NextRequest) {
  try {
    const { reference } = await request.json()

    if (!reference) {
      return NextResponse.json({ error: 'Reference required' }, { status: 400 })
    }

    // Verify with Paystack
    const paymentInfo = await verifyPayment(reference)

    if (paymentInfo.status !== 'success') {
      return NextResponse.json({ error: 'Payment not successful' }, { status: 400 })
    }

    // Get wallet for the user
    const { data: transactions } = await supabaseServer
      .from('transactions')
      .select('wallet_id')
      .eq('reference_id', reference)
      .single()

    if (!transactions) {
      return NextResponse.json({ error: 'Transaction not found' }, { status: 404 })
    }

    const { data: wallet } = await supabaseServer
      .from('wallets')
      .select('balance')
      .eq('id', transactions.wallet_id)
      .single()

    if (!wallet) {
      return NextResponse.json({ error: 'Wallet not found' }, { status: 404 })
    }

    // Update transaction status and wallet balance
    const newBalance = wallet.balance + paymentInfo.amount

    await supabaseServer
      .from('transactions')
      .update({ status: 'completed', completed_at: paymentInfo.paid_at })
      .eq('reference_id', reference)

    await supabaseServer
      .from('wallets')
      .update({
        balance: newBalance
      })
      .eq('id', transactions.wallet_id)

    return NextResponse.json({
      success: true,
      message: 'Payment verified and wallet updated',
      amount: paymentInfo.amount,
      newBalance
    })
  } catch (error) {
    console.error('Payment verification error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment verification failed' },
      { status: 500 }
    )
  }
}
