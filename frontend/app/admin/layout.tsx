"use client";

import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    await fetch(`${getApiUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#F9F8F6] text-stone-900 flex relative overflow-hidden selection:bg-emerald-100 selection:text-emerald-900 font-sans">
      {/* Subtle organic background elements */}
      <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] rounded-full bg-orange-100/40 blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-emerald-100/40 blur-[100px] pointer-events-none"></div>

      {/* Sidebar */}
      <aside className="w-64 bg-white/60 backdrop-blur-xl border-r border-stone-200/60 flex flex-col z-10 hidden md:flex shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="px-8 py-10 border-b border-stone-200/60">
          <span className="font-serif italic font-medium text-lg text-emerald-900 tracking-wide drop-shadow-sm">Akssada</span>
          <span className="ml-2 font-light text-[10px] text-stone-500 uppercase tracking-[0.2em]">Admin</span>
        </div>
        <nav className="flex-1 py-8 px-4 space-y-2">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/initiatives", label: "Initiatives" },
            { href: "/admin/blog", label: "Stories" },
            { href: "/admin/submissions", label: "Enquiries" },
          ].map(({ href, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`group relative block px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "text-emerald-800 bg-emerald-50/80 shadow-sm border border-emerald-100/50"
                    : "text-stone-600 hover:text-stone-900 hover:bg-stone-100/50 border border-transparent"
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 shadow-[1px_0_8px_rgba(5,150,105,0.4)] z-10 rounded-r-full"></div>
                )}
                <span className="relative z-10">{label}</span>
              </Link>
            )
          })}
        </nav>
        <div className="p-6 border-t border-stone-200/60">
          <button
            onClick={handleLogout}
            className="w-full text-left px-5 py-3 rounded-xl text-sm font-medium text-stone-500 hover:text-orange-700 hover:bg-orange-50/80 transition-colors duration-300 border border-transparent hover:border-orange-100/50"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto z-10 relative">
        <div className="max-w-7xl mx-auto p-8 md:p-12 animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out fill-mode-both">
          {children}
        </div>
      </main>
    </div>
  );
}
