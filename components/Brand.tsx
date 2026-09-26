import Link from "next/link";

type BrandProps = {
  compact?: boolean;
  href?: string;
  inverse?: boolean;
};

export default function Brand({ compact = false, href = "/", inverse = false }: BrandProps) {
  return (
    <Link href={href} className="inline-flex items-center gap-3 group">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition-transform group-hover:-translate-y-0.5">
        CM
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className={`block text-[15px] font-bold tracking-tight ${inverse ? "text-white" : "text-slate-950"}`}>
            Cliently
          </span>
          <span className={`block text-[11px] font-medium ${inverse ? "text-slate-400" : "text-slate-500"}`}>
            Management workspace
          </span>
        </span>
      )}
    </Link>
  );
}
