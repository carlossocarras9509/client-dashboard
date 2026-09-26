import Link from "next/link";
import { requireUser } from "@/lib/auth";
import AppSidebar from "@/components/AppSidebar";
import EditProfileForm from "./EditProfileForm";
import { ActivityIcon, BuildingIcon, CalendarIcon, MailIcon, ShieldIcon, UserIcon } from "@/components/Icons";

export default async function DashboardPage(){
  const {supabase,user}=await requireUser();
  const {data:profile}=await supabase.from("profiles").select("full_name,role,company,phone,created_at").eq("id",user.id).single();
  const {data:activityData}=await supabase.from("activity_logs").select("id,action,details,created_at").eq("user_id",user.id).order("created_at",{ascending:false}).limit(6);
  const activity=activityData??[];
  const fullName=profile?.full_name||user.user_metadata?.full_name||user.email||"User";
  const role=profile?.role||"client";
  const firstName=fullName.split(" ")[0] || fullName;
  const memberSince=profile?.created_at?new Date(profile.created_at).toLocaleDateString("en-US",{month:"short",day:"numeric",year:"numeric"}):"Not available";
  return <main className="min-h-screen bg-[#f6f8fc] text-slate-950">
    <AppSidebar active="dashboard" name={fullName} email={user.email||"No email"} role={role}/>
    <div className="lg:pl-72">
      <div className="mx-auto max-w-[1500px] px-5 py-7 sm:px-7 lg:px-10 lg:py-9">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-xs font-bold uppercase tracking-[0.15em] text-blue-600">Overview</p><h1 className="mt-2 text-3xl font-black tracking-[-0.035em] text-slate-950 sm:text-4xl">Good to see you, {firstName}.</h1><p className="mt-2 text-slate-500">Here&apos;s what&apos;s happening with your account today.</p></div>
          {role==="admin"&&<Link href="/admin" className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800">Open admin workspace</Link>}
        </div>

        <section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Metric icon={<ShieldIcon className="h-5 w-5"/>} label="Account status" value="Active" helper="Secure session" tone="emerald"/>
          <Metric icon={<UserIcon className="h-5 w-5"/>} label="Access level" value={role === "admin" ? "Administrator" : "Client"} helper="Role-based access" tone="blue"/>
          <Metric icon={<MailIcon className="h-5 w-5"/>} label="Primary email" value={user.email||"Not available"} helper="Verified account" tone="violet" small/>
          <Metric icon={<CalendarIcon className="h-5 w-5"/>} label="Member since" value={memberSince} helper="Account created" tone="amber"/>
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1.05fr_.95fr]">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black tracking-tight text-slate-950">Profile overview</h2><p className="mt-1 text-sm text-slate-500">Your current account information.</p></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">Active profile</span></div>
            <div className="grid gap-0 sm:grid-cols-2">
              <ProfileItem icon={<UserIcon className="h-5 w-5"/>} label="Full name" value={fullName}/>
              <ProfileItem icon={<BuildingIcon className="h-5 w-5"/>} label="Company" value={profile?.company||"Not provided"}/>
              <ProfileItem icon={<MailIcon className="h-5 w-5"/>} label="Email" value={user.email||"Not provided"}/>
              <ProfileItem icon={<CalendarIcon className="h-5 w-5"/>} label="Member since" value={memberSince}/>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
            <div className="mb-6"><h2 className="text-lg font-black tracking-tight text-slate-950">Edit profile</h2><p className="mt-1 text-sm text-slate-500">Keep your contact information up to date.</p></div>
            <EditProfileForm fullName={profile?.full_name||""} company={profile?.company||""} phone={profile?.phone||""}/>
          </div>
        </section>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-[0_16px_40px_-30px_rgba(15,23,42,0.45)]">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-5"><div><h2 className="text-lg font-black tracking-tight text-slate-950">Recent activity</h2><p className="mt-1 text-sm text-slate-500">Latest events recorded for your account.</p></div><div className="grid h-10 w-10 place-items-center rounded-xl bg-slate-100 text-slate-500"><ActivityIcon className="h-5 w-5"/></div></div>
          <div className="px-6 py-2">{activity.map((item,index)=><div key={item.id} className="flex gap-4 border-b border-slate-100 py-4 last:border-0"><div className="relative mt-0.5"><span className="grid h-9 w-9 place-items-center rounded-full bg-blue-50 text-blue-600"><ActivityIcon className="h-4 w-4"/></span>{index<activity.length-1&&<span className="absolute left-1/2 top-9 h-5 w-px -translate-x-1/2 bg-slate-200"/>}</div><div className="min-w-0 flex-1"><div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between"><p className="font-bold capitalize text-slate-900">{item.action.replaceAll("_"," ")}</p><time className="text-xs font-medium text-slate-400">{new Date(item.created_at).toLocaleString()}</time></div><p className="mt-1 text-sm leading-6 text-slate-500">{item.details||"Account activity"}</p></div></div>)}{activity.length===0&&<div className="py-12 text-center"><span className="mx-auto grid h-12 w-12 place-items-center rounded-2xl bg-slate-100 text-slate-400"><ActivityIcon className="h-6 w-6"/></span><p className="mt-4 font-bold text-slate-800">No activity yet</p><p className="mt-1 text-sm text-slate-500">Your latest account actions will appear here.</p></div>}</div>
        </section>
      </div>
    </div>
  </main>
}

function Metric({icon,label,value,helper,tone,small=false}:{icon:React.ReactNode;label:string;value:string;helper:string;tone:"emerald"|"blue"|"violet"|"amber";small?:boolean}){
  const tones={emerald:"bg-emerald-50 text-emerald-600",blue:"bg-blue-50 text-blue-600",violet:"bg-violet-50 text-violet-600",amber:"bg-amber-50 text-amber-600"};
  return <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_14px_34px_-28px_rgba(15,23,42,0.5)]"><div className="flex items-start justify-between"><span className={`grid h-10 w-10 place-items-center rounded-xl ${tones[tone]}`}>{icon}</span><span className="h-2 w-2 rounded-full bg-emerald-400"/></div><p className="mt-5 text-xs font-bold uppercase tracking-[0.11em] text-slate-400">{label}</p><p className={`mt-1 truncate font-black tracking-tight text-slate-950 ${small?"text-base":"text-xl"}`}>{value}</p><p className="mt-1 text-xs font-medium text-slate-400">{helper}</p></div>
}
function ProfileItem({icon,label,value}:{icon:React.ReactNode;label:string;value:string}){return <div className="flex gap-4 border-b border-slate-100 p-6 sm:even:border-l sm:[&:nth-last-child(-n+2)]:border-b-0"><span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-slate-50 text-slate-500">{icon}</span><div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-400">{label}</p><p className="mt-1 break-words font-bold text-slate-900">{value}</p></div></div>}
