"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Brand from "@/components/Brand";
import { ArrowRightIcon, CheckIcon, ShieldIcon } from "@/components/Icons";

export default function RegisterPage() {
  const supabase = createClient();
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); const [error, setError] = useState(""); const [success, setSuccess] = useState("");
  const passwordRequirements = { length: password.length >= 8, uppercase: /[A-Z]/.test(password), lowercase: /[a-z]/.test(password), number: /[0-9]/.test(password), special: /[^A-Za-z0-9]/.test(password) };
  const passwordIsValid = Object.values(passwordRequirements).every(Boolean);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setError(""); setSuccess("");
    if (!passwordIsValid) { setError("Password does not meet all requirements."); return; }
    setLoading(true);
    const { error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth/callback`, data: { full_name: name } } });
    if (error) { setError(error.message); setLoading(false); return; }
    setSuccess("Account created. Check your email to confirm your account."); setName(""); setEmail(""); setPassword(""); setLoading(false);
  }

  return (
    <main className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.05fr]">
      <section className="flex min-h-screen flex-col px-6 py-7 sm:px-10 lg:px-14 xl:px-20">
        <Brand />
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center py-10">
          <div className="mb-7"><p className="text-sm font-bold text-blue-600">GET STARTED</p><h1 className="mt-2 text-4xl font-black tracking-[-0.035em] text-slate-950">Create your workspace account</h1><p className="mt-3 leading-7 text-slate-500">Set up secure access to your client management dashboard.</p></div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Field label="Full name" id="name" value={name} onChange={setName} placeholder="John Smith" autoComplete="name" />
            <Field label="Email address" id="email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" autoComplete="email" />
            <div><label htmlFor="password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label><input id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a strong password" required autoComplete="new-password" className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/>
              {password.length > 0 && !passwordIsValid && <div className="mt-3 grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">{Object.entries({"8+ characters":passwordRequirements.length,"Uppercase":passwordRequirements.uppercase,"Lowercase":passwordRequirements.lowercase,"Number":passwordRequirements.number,"Special character":passwordRequirements.special}).map(([label,valid])=><div key={label} className={`flex items-center gap-1.5 text-xs font-semibold ${valid?"text-emerald-600":"text-slate-400"}`}><span className={`grid h-4 w-4 place-items-center rounded-full ${valid?"bg-emerald-100":"bg-slate-200"}`}>{valid&&<CheckIcon className="h-3 w-3"/>}</span>{label}</div>)}</div>}
            </div>
            {error && <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</div>}
            {success && <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</div>}
            <button type="submit" disabled={loading || !passwordIsValid} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">{loading?"Creating account...":<>Create account <ArrowRightIcon className="h-4 w-4"/></>}</button>
          </form>
          <p className="mt-7 text-center text-sm text-slate-500">Already have an account? <Link href="/login" className="font-bold text-slate-900 hover:text-blue-600">Sign in</Link></p>
        </div>
      </section>
      <aside className="relative hidden overflow-hidden bg-slate-950 p-12 lg:flex lg:flex-col lg:justify-between"><div className="absolute -right-20 top-0 h-96 w-96 rounded-full bg-blue-600/25 blur-3xl"/><div className="relative z-10 inline-flex w-fit items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-300"><ShieldIcon className="h-3.5 w-3.5"/> Security first</div><div className="relative z-10 max-w-xl"><h2 className="text-4xl font-black leading-tight tracking-[-0.035em] text-white">Built like a real internal product, not a demo form.</h2><div className="mt-8 space-y-4">{["Email confirmation and secure sessions","Strong password requirements","Protected client and admin routes","Database policies with Supabase RLS"].map((x)=><div key={x} className="flex items-center gap-3 text-slate-300"><span className="grid h-7 w-7 place-items-center rounded-full bg-emerald-500/10 text-emerald-400"><CheckIcon className="h-4 w-4"/></span>{x}</div>)}</div></div></aside>
    </main>
  );
}
function Field({label,id,type="text",value,onChange,placeholder,autoComplete}:{label:string;id:string;type?:string;value:string;onChange:(v:string)=>void;placeholder:string;autoComplete:string}){return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><input id={id} type={type} value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} required autoComplete={autoComplete} className="w-full rounded-xl border border-slate-300 px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></div>}
