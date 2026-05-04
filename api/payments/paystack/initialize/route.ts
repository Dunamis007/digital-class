import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// POST /api/payments/paystack/initialize
// Initialize a Paystack payment
export async function POST(request: NextRequest) {
  const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;

  if (!PAYSTACK_SECRET_KEY) {
    return NextResponse.json(
      { error: "PAYSTACK_SECRET_KEY is not configured" },
      { status: 500 }
    );
  }
  try {
    const auth = request.headers.get("Authorization");
    if (!auth) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(auth.replace("Bearer ", ""));

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { courseId, amount, email } = await request.json();

    if (!courseId || !amount) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Call Paystack API to initialize transaction
    const response = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email || user.email,
          amount: Math.round(amount * 100), // Convert to kobo (smallest Paystack unit)
          metadata: {
            userId: user.id,
            courseId: courseId,
            type: "course_purchase",
          },
          callback_url: `${process.env.NEXT_PUBLIC_SITE_URL}/payments/callback`,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Paystack initialization failed");
    }

    // Store transaction in database
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    await supabaseAdmin.from("transactions").insert({
      user_id: user.id,
      transaction_type: "course_purchase",
      amount,
      currency: "NGN",
      status: "pending",
      course_id: courseId,
      paystack_reference: data.data.reference,
    });

    return NextResponse.json({
      success: true,
      authorization_url: data.data.authorization_url,
      access_code: data.data.access_code,
      reference: data.data.reference,
    });
  } catch (error) {
    console.error("Paystack error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Payment initialization failed" },
      { status: 500 }
    );
  }
}
