"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function RoleSelect({ userId, role }: { userId: string; role: string }) {
  const router = useRouter(); const [value,setValue]=useState(role); const [saving,setSaving]=useState(false);
  async function change(next:string){const previous=value;setValue(next);setSaving(true);const response=await fetch(`/api/admin/users/${userId}`,{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({role:next})});if(!response.ok){setValue(previous);alert((await response.json()).error||"Unable to update role.");}setSaving(false);router.refresh();}
  return <div className="relative inline-flex"><span className={`pointer-events-none absolute left-3 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full ${value==="admin"?"bg-violet-500":"bg-blue-500"}`}/><select aria-label="User role" value={value} disabled={saving} onChange={(e)=>change(e.target.value)} className="appearance-none rounded-full border border-slate-200 bg-white py-2 pl-7 pr-8 text-xs font-bold capitalize text-slate-700 outline-none transition hover:border-slate-300 focus:border-blue-400 disabled:opacity-50"><option value="client">Client</option><option value="admin">Admin</option></select><span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">⌄</span></div>
}
