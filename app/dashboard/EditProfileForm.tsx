"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { BuildingIcon, CheckIcon, PhoneIcon, UserIcon } from "@/components/Icons";

export default function EditProfileForm({ fullName, company, phone }: { fullName: string; company: string; phone: string }) {
  const router = useRouter();
  const [name,setName]=useState(fullName); const [companyName,setCompany]=useState(company); const [phoneNumber,setPhone]=useState(phone); const [loading,setLoading]=useState(false); const [message,setMessage]=useState<{type:"ok"|"error";text:string}|null>(null);
  async function handleSubmit(event:FormEvent<HTMLFormElement>){event.preventDefault();setLoading(true);setMessage(null);const response=await fetch("/api/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({full_name:name,company:companyName,phone:phoneNumber})});const body=await response.json();setLoading(false);if(!response.ok){setMessage({type:"error",text:body.error||"Unable to update profile."});return;}setMessage({type:"ok",text:"Profile updated successfully."});router.refresh();}
  return <form onSubmit={handleSubmit} className="space-y-4">
    <Field icon={<UserIcon className="h-4 w-4"/>} label="Full name" value={name} setValue={setName} required/>
    <Field icon={<BuildingIcon className="h-4 w-4"/>} label="Company" value={companyName} setValue={setCompany} placeholder="Company name"/>
    <Field icon={<PhoneIcon className="h-4 w-4"/>} label="Phone" value={phoneNumber} setValue={setPhone} placeholder="Phone number" type="tel"/>
    {message&&<div className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold ${message.type==="ok"?"border-emerald-100 bg-emerald-50 text-emerald-700":"border-red-100 bg-red-50 text-red-700"}`}>{message.type==="ok"&&<CheckIcon className="h-4 w-4"/>}{message.text}</div>}
    <button disabled={loading} className="inline-flex items-center justify-center rounded-xl bg-slate-950 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-slate-800 disabled:opacity-50">{loading?"Saving changes...":"Save changes"}</button>
  </form>;
}
function Field({icon,label,value,setValue,placeholder,type="text",required=false}:{icon:React.ReactNode;label:string;value:string;setValue:(v:string)=>void;placeholder?:string;type?:string;required?:boolean}){const id=label.toLowerCase().replaceAll(" ","-");return <div><label htmlFor={id} className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><div className="relative"><span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span><input id={id} type={type} value={value} onChange={(e)=>setValue(e.target.value)} placeholder={placeholder} required={required} className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-10 pr-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"/></div></div>}
