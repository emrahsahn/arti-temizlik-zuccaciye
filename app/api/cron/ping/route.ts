import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();
  if (!supabase) {
    return NextResponse.json({
      status: "alive",
      mode: "local_mock",
      timestamp: new Date().toISOString(),
    });
  }

  try {
    // Light query to keep the PostgreSQL database awake
    const { data, error } = await supabase
      .from("ayarlar")
      .select("id")
      .limit(1);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "alive",
      mode: "supabase_connected",
      records_checked: data?.length || 0,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json(
      { error: "Ping sorgusu başarısız" },
      { status: 500 }
    );
  }
}
