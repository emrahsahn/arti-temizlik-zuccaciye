import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  // Verify authorization header if CRON_SECRET is configured
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({
      status: "mock_mode",
      message: "Supabase bağlantısı henüz yapılandırılmadı. Yerel mod aktif.",
    });
  }

  try {
    // Retain only orders younger than 90 days for completed orders to respect Supabase free-tier 500MB
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    const { count, error } = await supabase
      .from("siparisler")
      .delete({ count: "exact" })
      .eq("status", "tamamlandi")
      .lt("created_at", ninetyDaysAgo);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      cleaned_orders_count: count,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Cleanup işlemi sırasında hata oluştu" },
      { status: 500 }
    );
  }
}
