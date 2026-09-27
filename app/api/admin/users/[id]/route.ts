import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: me } = await supabase
    .from("profiles")
    .select("id, role, username, full_name, email")
    .eq("id", user.id)
    .single();

  if (me?.role !== "admin") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const body = await request.json();
  const role = body.role === "admin" ? "admin" : body.role === "client" ? "client" : null;
  if (!role) return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  if (id === user.id && role !== "admin") return NextResponse.json({ error: "You cannot remove your own admin access." }, { status: 400 });

  const { data: target, error: targetError } = await supabase
    .from("profiles")
    .select("id, role, username, full_name, email")
    .eq("id", id)
    .single();

  if (targetError || !target) return NextResponse.json({ error: "User not found." }, { status: 404 });
  if (target.role === role) return NextResponse.json({ ok: true, unchanged: true });

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ role, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (updateError) return NextResponse.json({ error: "Unable to update user." }, { status: 400 });

  const actorLabel = me.username ? `@${me.username}` : me.full_name || me.email || "Administrator";
  const targetLabel = target.username ? `@${target.username}` : target.full_name || target.email || "user";
  const previousRole = target.role === "admin" ? "Admin" : "Client";
  const nextRole = role === "admin" ? "Admin" : "Client";

  const { error: activityError } = await supabase.from("activity_logs").insert([
    {
      user_id: user.id,
      actor_id: user.id,
      action: "admin_role_updated",
      details: `Changed ${targetLabel}'s role from ${previousRole} to ${nextRole}`,
    },
    {
      user_id: id,
      actor_id: user.id,
      action: "role_changed",
      details: `${actorLabel} changed your role from ${previousRole} to ${nextRole}`,
    },
  ]);

  if (activityError) {
    console.error("Role activity log error:", activityError);
    return NextResponse.json({ ok: true, warning: "Role updated, but the audit event could not be recorded." });
  }

  return NextResponse.json({ ok: true });
}
