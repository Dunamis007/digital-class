import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import { createClient } from "@supabase/supabase-js";

// GET /api/wallet - Get user's wallet balance
export async function GET(request: NextRequest) {
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

    // Get or create wallet
    let { data: wallet, error: walletError } = await supabaseServer
      .from("wallets")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (walletError && walletError.code === "PGRST116") {
      // Wallet doesn't exist, create it
      const { data: newWallet, error: createError } = await supabaseServer
        .from("wallets")
        .insert([
          {
            user_id: user.id,
            balance: 0,
            currency: "NGN",
          },
        ])
        .select()
        .single();

      if (createError) throw createError;
      wallet = newWallet;
    } else if (walletError) {
      throw walletError;
    }

    return NextResponse.json({ wallet });
  } catch (error) {
    console.error("Error fetching wallet:", error);
    return NextResponse.json(
      { error: "Failed to fetch wallet" },
      { status: 500 }
    );
  }
}
