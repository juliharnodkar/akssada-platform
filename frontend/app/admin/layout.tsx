"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { getApiUrl } from "@/lib/api";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${getApiUrl()}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-[#0d0d1a] flex">
      {/* Sidebar */}
      <aside className="w-56 bg-[#16213e] border-r border-white/10 flex flex-col">
        <div className="px-5 py-5 border-b border-white/10">
          <span className="font-bold text-white text-sm">AKSSADA Admin</span>
        </div>
        <nav className="flex-1 py-4 space-y-0.5 px-2">
          {[
            { href: "/admin", label: "Dashboard" },
            { href: "/admin/initiatives", label: "Initiatives" },
            { href: "/admin/blog", label: "Blog / Articles" },
            { href: "/admin/submissions", label: "Submissions" },
          ].map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="block px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-500 hover:text-red-400 hover:bg-red-900/10 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {children}
      </main>
    </div>
  );
}
