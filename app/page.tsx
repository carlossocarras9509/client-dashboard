import Link from "next/link";
import Brand from "@/components/Brand";
import {
  ArrowRightIcon,
  ShieldIcon,
  UsersIcon,
  ActivityIcon,
} from "@/components/Icons";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Brand />

          <Link
            href="/login"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-bold text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
          >
            Sign in
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-14 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-blue-700">
            <ShieldIcon className="h-4 w-4" />
            Secure client management
          </div>

          <h1 className="mt-6 max-w-2xl text-5xl font-black tracking-[-0.045em] text-slate-950 sm:text-6xl">
            Manage your clients from one secure workspace.
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            A modern management platform for client profiles, account
            activity and role-based administration — designed for teams
            that value clarity and speed.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 rounded-xl bg-blue-600 px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:bg-blue-700"
            >
              Sign in
              <ArrowRightIcon className="h-4 w-4" />
            </Link>

            <Link
              href="/register"
              className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 font-bold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
            >
              Create account
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4 text-sm font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <ShieldIcon className="h-5 w-5 text-emerald-500" />
              Secure authentication
            </div>

            <div className="flex items-center gap-2">
              <UsersIcon className="h-5 w-5 text-blue-600" />
              Role-based access
            </div>

            <div className="flex items-center gap-2">
              <ActivityIcon className="h-5 w-5 text-violet-600" />
              Activity tracking
            </div>
          </div>
        </div>

        <div className="relative hidden lg:block">
          <div className="absolute -right-10 -top-10 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
          <div className="absolute -bottom-10 left-10 h-72 w-72 rounded-full bg-indigo-200/50 blur-3xl" />

          <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 shadow-2xl shadow-slate-300/40">
            <div className="flex items-center justify-between border-b border-slate-100 pb-5">
              <div>
                <p className="text-sm font-semibold text-slate-500">
                  Workspace overview
                </p>
                <p className="mt-1 text-xl font-black text-slate-950">
                  Client Dashboard
                </p>
              </div>

              <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
                Active
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <PreviewCard title="Clients" value="128" />
              <PreviewCard title="Active users" value="94" />
              <PreviewCard title="Activities" value="1,284" />
              <PreviewCard title="Status" value="Healthy" />
            </div>

            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-900">
                Recent activity
              </p>

              <div className="mt-4 space-y-4">
                <ActivityRow
                  title="Profile updated"
                  description="Client information was updated"
                />

                <ActivityRow
                  title="New account"
                  description="A new client joined the workspace"
                />

                <ActivityRow
                  title="Secure sign in"
                  description="Authentication completed successfully"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function PreviewCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
      <p className="text-sm font-medium text-slate-500">{title}</p>
      <p className="mt-2 text-2xl font-black text-slate-950">{value}</p>
    </div>
  );
}

function ActivityRow({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="h-2.5 w-2.5 rounded-full bg-blue-600" />

      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}