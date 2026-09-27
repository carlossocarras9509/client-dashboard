import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const allowedActions = new Set([
  "signed_in",
  "signed_out",
  "password_changed",
  "password_reset_completed",
]);

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabase
    .from("activity_logs")
    .select("id, action, details, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const action = String(body.action ?? "");
  const details = typeof body.details === "string" ? body.details.slice(0, 300) : null;

  if (!allowedActions.has(action)) {
    return NextResponse.json({ error: "Unsupported activity type." }, { status: 400 });
  }

  const { error } = await supabase.from("activity_logs").insert({
    user_id: user.id,
    actor_id: user.id,
    action,
    details,
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
