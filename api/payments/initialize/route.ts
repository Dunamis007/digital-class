import { NextRequest, NextResponse } from 'next/server'
import { supabaseServer } from '@/lib/supabase'
import { initializePayment } from '@/lib/paystack'
import { createClient } from '@supabase/supabase-js'

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

    const { amount, description } = await request.json()

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
    }

    // Initialize Paystack payment
    const paymentData = await initializePayment({
      email: user.email!,
      amount,
      metadata: {
        userId: user.id,
        description
      }
    })

    // Log transaction in database
    const { data: wallet } = await supabaseServer
      .from('wallets')
      .select('id')
      .eq('user_id', user.id)
      .single()

    if (wallet) {
      await supabaseServer.from('transactions').insert([
        {
          wallet_id: wallet.id,
          transaction_type: 'topup',
          amount,
          status: 'pending',
          reference_id: paymentData.reference,
          description
        }
      ])
    }

    return NextResponse.json(paymentData)
  } catch (error) {
    console.error('Payment initialization error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Payment initialization failed' },
      { status: 500 }
    )
  }
}
