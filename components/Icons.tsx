import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;
const base = { fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function GridIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>; }
export function UsersIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>; }
export function UserIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>; }
export function ActivityIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M3 12h4l2.4-6 4.2 12 2.4-6H21"/></svg>; }
export function ShieldIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></svg>; }
export function ArrowRightIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M5 12h14M13 6l6 6-6 6"/></svg>; }
export function SearchIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>; }
export function BuildingIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M4 21V3h10v18M14 8h6v13M8 7h2M8 11h2M8 15h2M17 12h1M17 16h1M2 21h20"/></svg>; }
export function MailIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></svg>; }
export function PhoneIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 5.15 12.8 19.79 19.79 0 0 1 2.08 4.18 2 2 0 0 1 4.07 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.7a16 16 0 0 0 6 6l1.24-1.24a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92Z"/></svg>; }
export function CalendarIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>; }
export function SparklesIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="m12 3-1.2 3.2L7.5 7.5l3.3 1.3L12 12l1.2-3.2 3.3-1.3-3.3-1.3L12 3Z"/><path d="m18 13-.8 2.2-2.2.8 2.2.8L18 19l.8-2.2L21 16l-2.2-.8L18 13ZM5 14l-.7 1.8-1.8.7 1.8.7L5 19l.7-1.8 1.8-.7-1.8-.7L5 14Z"/></svg>; }
export function LogOutIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-5"/></svg>; }
export function ChevronLeftIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="m15 18-6-6 6-6"/></svg>; }
export function CheckIcon(props: IconProps) { return <svg viewBox="0 0 24 24" aria-hidden="true" {...base} {...props}><path d="m5 12 4 4L19 6"/></svg>; }
