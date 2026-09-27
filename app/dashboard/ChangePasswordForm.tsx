"use client";

import { FormEvent, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { CheckIcon, ShieldIcon } from "@/components/Icons";

export default function ChangePasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "ok" | "error"; text: string } | null>(null);

  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };
  const valid = Object.values(requirements).every(Boolean);
  const matches = password.length > 0 && password === confirmPassword;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(null);
    if (!valid) return setMessage({ type: "error", text: "Password does not meet all requirements." });
    if (!matches) return setMessage({ type: "error", text: "Passwords do not match." });

    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setLoading(false);
      return setMessage({ type: "error", text: error.message });
    }

    await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "password_changed", details: "Password changed from account security settings" }),
    }).catch(() => undefined);

    setPassword("");
    setConfirmPassword("");
    setLoading(false);
    setMessage({ type: "ok", text: "Password changed successfully." });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="flex items-start gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-blue-800">
        <ShieldIcon className="mt-0.5 h-5 w-5 shrink-0" />
        <p>Use a unique password with at least 8 characters, including uppercase, lowercase, a number and a special character.</p>
      </div>
      <PasswordField label="New password" value={password} setValue={setPassword} />
      <PasswordField label="Confirm new password" value={confirmPassword} setValue={setConfirmPassword} />
      {password.length > 0 && (
        <div className="grid grid-cols-2 gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {Object.entries({ "8+ characters": requirements.length, Uppercase: requirements.uppercase, Lowercase: requirements.lowercase, Number: requirements.number, "Special character": requirements.special }).map(([label, ok]) => (
            <div key={label} className={`flex items-center gap-1.5 text-xs font-semibold ${ok ? "text-emerald-600" : "text-slate-400"}`}>
              <span className={`grid h-4 w-4 place-items-center rounded-full ${ok ? "bg-emerald-100" : "bg-slate-200"}`}>{ok && <CheckIcon className="h-3 w-3" />}</span>{label}
            </div>
          ))}
        </div>
      )}
      {message && <div className={`rounded-xl border px-4 py-3 text-sm font-semibold ${message.type === "ok" ? "border-emerald-100 bg-emerald-50 text-emerald-700" : "border-red-100 bg-red-50 text-red-700"}`}>{message.text}</div>}
      <button disabled={loading || !valid || !matches} className="rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50">{loading ? "Changing password..." : "Change password"}</button>
    </form>
  );
}

function PasswordField({ label, value, setValue }: { label: string; value: string; setValue: (value: string) => void }) {
  const id = label.toLowerCase().replaceAll(" ", "-");
  return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><input id={id} type="password" value={value} onChange={(e) => setValue(e.target.value)} autoComplete="new-password" required placeholder="••••••••" className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>;
}
