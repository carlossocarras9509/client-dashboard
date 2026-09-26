import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { data: me } = await supabase.from("profiles").select("role").eq("id", user.id).single();
  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const role = body.role === "admin" ? "admin" : body.role === "client" ? "client" : null;
  if (!role) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  if (id === user.id && role !== "admin") return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });

  const { error } = await supabase.from("profiles").update({ role, updated_at: new Date().toISOString() }).eq("id", id);
  if (error) return NextResponse.json({ error: "Unable to update user." }, { status: 400 });
  await supabase.from("activity_logs").insert({ user_id: user.id, action: "admin_role_updated", details: `Changed user ${id} role to ${role}` });
  return NextResponse.json({ ok: true });
}
