"use client";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "@/components/Icons";

export default function LogoutButton({ variant = "default" }: { variant?: "default" | "sidebar" | "compact" }) {
  const router = useRouter();
  async function logout(){
    await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "signed_out", details: "Signed out of the workspace" }),
    }).catch(() => undefined);
    const supabase=createClient();
    await supabase.auth.signOut();
    router.replace("/login");
    router.refresh();
  }
  const cls = variant === "sidebar"
    ? "flex w-full items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white"
    : variant === "compact"
      ? "grid h-9 w-9 place-items-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
      : "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-slate-300 hover:bg-slate-50";
  return <button onClick={logout} className={cls} title="Sign out"><LogOutIcon className="h-4 w-4"/>{variant !== "compact" && "Sign out"}</button>
}
