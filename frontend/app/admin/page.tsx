"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/api";

interface Stats {
  initiatives: number;
  articles: number;
  contacts: number;
  volunteers: number;
  partnerships: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    Promise.all([
      adminFetch("/api/admin/initiatives"),
      adminFetch("/api/admin/blog"),
      adminFetch("/api/admin/submissions/contact"),
      adminFetch("/api/admin/submissions/volunteer"),
      adminFetch("/api/admin/submissions/partnership"),
    ])
      .then(async ([i, b, c, v, p]) => {
        const [initiatives, articles, contacts, volunteers, partnerships] = await Promise.all([
          i.json(), b.json(), c.json(), v.json(), p.json(),
        ]);
        setStats({
          initiatives: Array.isArray(initiatives) ? initiatives.length : 0,
          articles: Array.isArray(articles) ? articles.length : 0,
          contacts: Array.isArray(contacts) ? contacts.length : 0,
          volunteers: Array.isArray(volunteers) ? volunteers.length : 0,
          partnerships: Array.isArray(partnerships) ? partnerships.length : 0,
        });
      })
      .catch(() => setError("Failed to load dashboard data."));
  }, []);

  const cards = stats
    ? [
        { label: "Initiatives", value: stats.initiatives, href: "/admin/initiatives" },
        { label: "Articles", value: stats.articles, href: "/admin/blog" },
        { label: "Contact Submissions", value: stats.contacts, href: "/admin/submissions" },
        { label: "Volunteer Applications", value: stats.volunteers, href: "/admin/submissions" },
        { label: "Partnership Inquiries", value: stats.partnerships, href: "/admin/submissions" },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      {error && <p className="text-red-400 mb-4">{error}</p>}
      {!stats && !error && <p className="text-gray-500">Loading...</p>}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="bg-[#16213e] border border-white/10 rounded-xl p-5 hover:border-indigo-500/50 transition-colors"
          >
            <p className="text-3xl font-bold text-white">{card.value}</p>
            <p className="text-sm text-gray-400 mt-1">{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
