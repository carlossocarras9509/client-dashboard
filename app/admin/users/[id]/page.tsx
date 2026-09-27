import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth";
import AppSidebar from "@/components/AppSidebar";
import RoleSelect from "../../RoleSelect";
import { ActivityIcon, BuildingIcon, CalendarIcon, ChevronLeftIcon, MailIcon, PhoneIcon, UserIcon } from "@/components/Icons";

export default async function AdminUserPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { supabase, user, profile: adminProfile } = await requireAdmin();
  const { data: profile } = await supabase.from("profiles").select("id,email,username,full_name,role,company,phone,created_at,updated_at").eq("id", id).single();
  if (!profile) notFound();

  const { data: activityData } = await supabase.from("activity_logs").select("id,action,details,created_at").eq("user_id", id).order("created_at", { ascending: false }).limit(25);
  const activity = activityData ?? [];
  const adminName = adminProfile?.full_name || user.email || "Administrator";
  const name = profile.full_name || "Unnamed user";
  const initials = name.split(" ").filter(Boolean).slice(0, 2).map((x: string) => x[0]?.toUpperCase()).join("") || "U";

  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
    <AppSidebar active="user" name={adminName} email={user.email || "No email"} role="admin" />
    <div className="lg:pl-72"><div className="mx-auto max-w-[1250px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
      <Link href="/admin" className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-500 transition hover:text-blue-600"><ChevronLeftIcon className="h-4 w-4" /> Back to user management</Link>

      <section className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
        <div className="relative bg-[radial-gradient(circle_at_top_left,_rgba(37,99,235,0.35),_transparent_40%),linear-gradient(120deg,#0f172a,#172554)] px-6 pb-16 pt-8 sm:px-8">
          <div className="flex items-start gap-4">
            <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl border-4 border-white/90 bg-blue-600 text-xl font-black text-white shadow-lg">{initials}</div>
            <div className="min-w-0 pt-1">
              <div className="flex flex-wrap items-center gap-2"><h1 className="break-words text-3xl font-black tracking-[-0.03em] text-white">{name}</h1><span className={`rounded-full border px-2.5 py-1 text-xs font-bold capitalize ${profile.role === "admin" ? "border-violet-300/30 bg-violet-400/15 text-violet-100" : "border-blue-300/30 bg-blue-400/15 text-blue-100"}`}>{profile.role}</span></div>
              <p className="mt-1 text-sm font-bold text-blue-200">{profile.username ? `@${profile.username}` : "No username"}</p>
              <p className="mt-1 break-all text-sm font-medium text-slate-300">{profile.email || "No email"}</p>
            </div>
          </div>
        </div>

        <div className="px-6 pb-7 sm:px-8">
          <div className="-mt-7 flex justify-end"><div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm"><RoleSelect userId={profile.id} role={profile.role} /></div></div>
          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            <Info icon={<UserIcon className="h-5 w-5" />} label="Username" value={profile.username ? `@${profile.username}` : "Not provided"} />
            <Info icon={<MailIcon className="h-5 w-5" />} label="Email" value={profile.email || "Not provided"} />
            <Info icon={<BuildingIcon className="h-5 w-5" />} label="Company" value={profile.company || "Not provided"} />
            <Info icon={<PhoneIcon className="h-5 w-5" />} label="Phone" value={profile.phone || "Not provided"} />
            <Info icon={<CalendarIcon className="h-5 w-5" />} label="Joined" value={new Date(profile.created_at).toLocaleDateString()} />
          </div>
        </div>
      </section>

      <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black text-slate-950">Activity history</h2><p className="mt-1 text-sm text-slate-500">Latest account events for this user.</p></div><span className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500"><ActivityIcon className="h-5 w-5" /></span></div>
        <div className="px-6 py-2">
          {activity.map((item) => <div key={item.id} className="flex gap-4 border-b border-slate-100 py-4 last:border-0"><span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600"><ActivityIcon className="h-4 w-4" /></span><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold capitalize text-slate-900">{item.action.replaceAll("_", " ")}</p><time className="text-xs font-medium text-slate-400">{new Date(item.created_at).toLocaleString()}</time></div><p className="mt-1 text-sm text-slate-500">{item.details || "No details"}</p></div></div>)}
          {activity.length === 0 && <div className="py-12 text-center"><ActivityIcon className="mx-auto h-8 w-8 text-slate-300" /><p className="mt-3 font-bold text-slate-700">No activity recorded</p></div>}
        </div>
      </section>
    </div></div>
  </main>;
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-white text-slate-500 shadow-sm">{icon}</span><div className="min-w-0"><p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p><p className="mt-0.5 truncate text-sm font-bold text-slate-800">{value}</p></div></div>;
}
