import Link from "next/link";
import Brand from "@/components/Brand";
import { ActivityIcon, GridIcon, ShieldIcon, UsersIcon } from "@/components/Icons";
import LogoutButton from "@/app/dashboard/LogoutButton";

type SidebarProps = {
  active: "dashboard" | "admin" | "user";
  name: string;
  email: string;
  role: string;
};

export default function AppSidebar({ active, name, email, role }: SidebarProps) {
  const initials = name.split(" ").filter(Boolean).slice(0,2).map((part)=>part[0]?.toUpperCase()).join("") || "U";
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-slate-800 bg-slate-950 px-5 py-6 text-white lg:flex">
        <Brand inverse />
        <nav className="mt-10 space-y-1.5">
          <Nav href="/dashboard" active={active === "dashboard"} icon={<GridIcon className="h-5 w-5"/>} label="Overview" />
          {role === "admin" && <Nav href="/admin" active={active === "admin" || active === "user"} icon={<UsersIcon className="h-5 w-5"/>} label="User management" />}
          <div className="pt-5"><p className="px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">Workspace</p></div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500"><ActivityIcon className="h-5 w-5"/><span>Activity monitoring</span></div>
          <div className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-500"><ShieldIcon className="h-5 w-5"/><span>Secure access</span></div>
        </nav>
        <div className="mt-auto rounded-2xl border border-slate-800 bg-slate-900/70 p-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-600 text-xs font-black text-white">{initials}</div>
            <div className="min-w-0 flex-1"><p className="truncate text-sm font-bold text-white">{name}</p><p className="truncate text-xs text-slate-400">{email}</p></div>
          </div>
          <div className="mt-3 border-t border-slate-800 pt-3"><LogoutButton variant="sidebar" /></div>
        </div>
      </aside>
      <div className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:hidden">
        <Brand compact />
        <div className="flex items-center gap-2">{role === "admin" && <Link href="/admin" className="rounded-lg bg-slate-900 px-3 py-2 text-xs font-bold text-white">Admin</Link>}<LogoutButton variant="compact"/></div>
      </div>
    </>
  );
}

function Nav({href,active,icon,label}:{href:string;active:boolean;icon:React.ReactNode;label:string}){
  return <Link href={href} className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${active?"bg-blue-600 text-white shadow-lg shadow-blue-950/20":"text-slate-400 hover:bg-slate-900 hover:text-white"}`}>{icon}<span>{label}</span>{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-white"/>}</Link>
}
