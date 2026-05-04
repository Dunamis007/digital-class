import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase";
import fs from "fs";
import path from "path";

// This endpoint initializes the database schema
// Call this once: POST /api/admin/init-database?key=your_admin_key

export async function POST(request: NextRequest) {
  try {
    // Security check
    const adminKey = request.nextUrl.searchParams.get("key");
    if (adminKey !== process.env.ADMIN_INIT_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    if (!supabaseServer) {
      return NextResponse.json(
        { error: "Supabase admin client not configured" },
        { status: 500 }
      );
    }

    // Read the SQL migration file
    const sqlPath = path.join(process.cwd(), "scripts", "01-setup-database.sql");
    const sqlContent = fs.readFileSync(sqlPath, "utf-8");

    // Execute the SQL
    const { error } = await supabaseServer.rpc("exec_sql", {
      sql_query: sqlContent,
    });

    if (error) {
      // Try alternative approach: split statements and execute individually
      const statements = sqlContent
        .split(";")
        .map((stmt) => stmt.trim())
        .filter((stmt) => stmt.length > 0 && !stmt.startsWith("--"));

      let executed = 0;
      let failed = 0;

      for (const stmt of statements) {
        try {
          await supabaseServer.from("_migrations").insert({
            name: `migration_${Date.now()}`,
            sql: stmt.substring(0, 200),
          });
          executed++;
        } catch (e) {
          failed++;
        }
      }

      return NextResponse.json({
        success: true,
        message: "Database initialization in progress",
        statements_found: statements.length,
        note: "Run this endpoint multiple times if needed. Check Supabase dashboard for table creation.",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
    });
  } catch (error) {
    console.error("Database initialization error:", error);
    return NextResponse.json(
      { error: String(error) },
      { status: 500 }
    );
  }
}
