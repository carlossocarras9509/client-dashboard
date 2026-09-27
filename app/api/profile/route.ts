import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const usernamePattern = /^[a-z0-9._-]{3,30}$/;

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError || !user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const full_name = String(body.full_name ?? "").trim();
    const username = String(body.username ?? "").trim().toLowerCase();
    const company = String(body.company ?? "").trim();
    const phone = String(body.phone ?? "").trim();

    if (full_name.length < 2 || full_name.length > 100) return NextResponse.json({ error: "Full name must be 2-100 characters." }, { status: 400 });
    if (!usernamePattern.test(username)) return NextResponse.json({ error: "Username must be 3-30 characters using letters, numbers, dots, hyphens or underscores." }, { status: 400 });
    if (company.length > 120 || phone.length > 30) return NextResponse.json({ error: "Company or phone is too long." }, { status: 400 });

    const { data: current } = await supabase.from("profiles").select("full_name,username,company,phone").eq("id", user.id).single();
    const { data: existing } = await supabase.from("profiles").select("id").eq("username", username).neq("id", user.id).maybeSingle();
    if (existing) return NextResponse.json({ error: "Username already taken." }, { status: 409 });

    const { error: profileError } = await supabase.from("profiles").update({ full_name, username, company: company || null, phone: phone || null, updated_at: new Date().toISOString() }).eq("id", user.id);
    if (profileError) {
      console.error("Profile update error:", profileError);
      return NextResponse.json({ error: profileError.code === "23505" ? "Username already taken." : "Unable to update profile." }, { status: 400 });
    }

    const changedFields = [
      current?.full_name !== full_name ? "full name" : null,
      current?.username !== username ? "username" : null,
      (current?.company || "") !== company ? "company" : null,
      (current?.phone || "") !== phone ? "phone" : null,
    ].filter(Boolean);
    const details = changedFields.length ? `Updated ${changedFields.join(", ")}` : "Profile saved without field changes";
    const { error: activityError } = await supabase.from("activity_logs").insert({ user_id: user.id, actor_id: user.id, action: "profile_updated", details });
    if (activityError) {
      console.error("Activity log error:", activityError);
      return NextResponse.json({ error: "Profile updated, but activity could not be recorded." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Profile updated and activity recorded." });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
