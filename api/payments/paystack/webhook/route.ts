import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

// POST /api/payments/paystack/webhook
// Paystack webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-paystack-signature");

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      );
    }

    // Verify signature
    const hash = crypto
      .createHmac("sha512", PAYSTACK_SECRET_KEY!)
      .update(body)
      .digest("hex");

    if (hash !== signature) {
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 400 }
      );
    }

    const event = JSON.parse(body);

    if (event.event !== "charge.success") {
      return NextResponse.json({ success: true });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data: transaction, error: txError } = await supabaseAdmin
      .from("transactions")
      .select("*")
      .eq("paystack_reference", event.data.reference)
      .single();

    if (txError) {
      console.error("Transaction not found:", txError);
      return NextResponse.json({ success: true });
    }

    // Update transaction status
    await supabaseAdmin
      .from("transactions")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
      })
      .eq("id", transaction.id);

    // Create enrollment
    if (transaction.course_id && transaction.user_id) {
      await supabaseAdmin.from("enrollments").insert({
        student_id: transaction.user_id,
        course_id: transaction.course_id,
        status: "enrolled",
        enrolled_at: new Date().toISOString(),
      });

      // Update wallet balance
      const { data: wallet } = await supabaseAdmin
        .from("wallets")
        .select("balance")
        .eq("user_id", transaction.user_id)
        .single();

      if (wallet) {
        await supabaseAdmin
          .from("wallets")
          .update({
            balance: wallet.balance - transaction.amount,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", transaction.user_id);
      }

      // Award points
      await supabaseAdmin
        .from("point_transactions")
        .insert({
          user_id: transaction.user_id,
          points: 100,
          transaction_type: "course_purchase",
          reference_id: transaction.course_id,
        });

      // Update user stats
      await supabaseAdmin.rpc("update_user_stats_points", {
        p_user_id: transaction.user_id,
        p_points: 100,
      });
    }

    // Handle referral bonus if applicable
    if (transaction.referrer_id) {
      const referralBonus = 5000; // ₦5,000 referral bonus
      await supabaseAdmin
        .from("point_transactions")
        .insert({
          user_id: transaction.referrer_id,
          points: referralBonus,
          transaction_type: "referral_bonus",
          reference_id: transaction.user_id,
        });

      // Credit referrer's wallet
      const { data: referrerWallet } = await supabaseAdmin
        .from("wallets")
        .select("balance")
        .eq("user_id", transaction.referrer_id)
        .single();

      if (referrerWallet) {
        await supabaseAdmin
          .from("wallets")
          .update({
            balance: referrerWallet.balance + referralBonus,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", transaction.referrer_id);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}
