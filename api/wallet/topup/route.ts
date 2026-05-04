import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// GET: Get wallet transactions
export async function GET(request: NextRequest) {
  try {
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

    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    const { data: transactions, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({
      wallet,
      transactions: transactions || [],
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

// POST: Add funds to wallet (via bank transfer record)
export async function POST(request: NextRequest) {
  try {
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
    const { amount, description, bankDetails } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json(
        { error: 'Invalid amount' },
        { status: 400 }
      );
    }

    const supabaseServer = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { persistSession: false } }
    );

    // Get wallet
    const { data: wallet } = await supabaseServer
      .from('wallets')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (!wallet) {
      return NextResponse.json(
        { error: 'Wallet not found' },
        { status: 404 }
      );
    }

    // Create transaction record
    const newBalance = wallet.balance + amount;

    const { data: transaction, error } = await supabaseServer
      .from('transactions')
      .insert([
        {
          wallet_id: wallet.id,
          transaction_type: 'topup',
          amount,
          balance_before: wallet.balance,
          balance_after: newBalance,
          status: 'pending', // Pending bank verification
          description: description || 'Wallet top-up via bank transfer',
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Generate bank transfer reference
    const reference = `DUN-${user.id.substring(0, 8).toUpperCase()}-${Date.now()}`;

    // Return bank details to user
    const bankTransferInfo = {
      account_name: 'Dunamis EdTech Wallet',
      account_number: '1234567890', // This would come from your bank integration
      bank_code: '999999',
      reference,
      amount,
      note: `Transfer ${amount} using reference: ${reference}`,
    };

    return NextResponse.json({
      transaction,
      bank_transfer_info: bankTransferInfo,
      message: 'Bank transfer details generated. Please transfer the amount to complete top-up.',
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
