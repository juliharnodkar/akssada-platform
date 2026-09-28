"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { adminFetch } from "@/lib/api";

interface Stats {
  initiatives: number;
  publishedInitiatives: number;
  articles: number;
  publishedArticles: number;
  enquiries: number;
}

interface ActivityItem {
  id: string;
  type: "Story" | "Initiative" | "Enquiry";
  title: string;
  date: Date;
  status: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentActivity, setRecentActivity] = useState<ActivityItem[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    let isMounted = true;
    Promise.all([
      adminFetch("/api/admin/initiatives"),
      adminFetch("/api/admin/blog"),
      adminFetch("/api/admin/submissions/contact"),
      adminFetch("/api/admin/submissions/volunteer"),
      adminFetch("/api/admin/submissions/partnership"),
    ])
      .then(async ([iRes, bRes, cRes, vRes, pRes]) => {
        if (!iRes.ok || !bRes.ok || !cRes.ok || !vRes.ok || !pRes.ok) {
          throw new Error("API request failed");
        }
        const [initiatives, articles, contacts, volunteers, partnerships] = await Promise.all([
          iRes.json(), bRes.json(), cRes.json(), vRes.json(), pRes.json(),
        ]);
        
        if (!isMounted) return;

        const allEnquiries = [
          ...contacts.map((c: Record<string, unknown>) => ({ ...c, _type: 'Contact' })),
          ...volunteers.map((v: Record<string, unknown>) => ({ ...v, _type: 'Volunteer' })),
          ...partnerships.map((p: Record<string, unknown>) => ({ ...p, _type: 'Partnership' }))
        ];

        setStats({
          initiatives: initiatives.length,
          publishedInitiatives: initiatives.filter((i: Record<string, unknown>) => i.published).length,
          articles: articles.length,
          publishedArticles: articles.filter((a: Record<string, unknown>) => a.published).length,
          enquiries: allEnquiries.length,
        });

        const activities: ActivityItem[] = [
          ...articles.map((a: Record<string, unknown>) => ({
            id: a.id as string,
            type: "Story" as const,
            title: a.title as string,
            date: new Date((a.createdAt || a.updatedAt) as string),
            status: a.published ? "Published" : "Draft"
          })),
          ...initiatives.map((i: Record<string, unknown>) => ({
            id: i.id as string,
            type: "Initiative" as const,
            title: i.title as string,
            date: new Date((i.createdAt || i.updatedAt || new Date().toISOString()) as string),
            status: i.published ? "Published" : "Draft"
          })),
          ...allEnquiries.map((e: Record<string, unknown>) => ({
            id: e.id as string,
            type: "Enquiry" as const,
            title: `${e.name || e.organizationName} (${e._type})`,
            date: new Date(e.submittedAt as string),
            status: e.status as string
          }))
        ];

        activities.sort((a, b) => b.date.getTime() - a.date.getTime());
        setRecentActivity(activities.slice(0, 10));
      })
      .catch(() => {
        if (isMounted) setError("Failed to load dashboard data.");
      });
      
    return () => { isMounted = false; };
  }, []);

  return (
    <div className="space-y-12">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-stone-900 tracking-wide">Overview</h1>
          <p className="text-stone-500 font-light">Real-time metrics and recent activity across the platform.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="group relative px-6 py-3 bg-emerald-700/90 backdrop-blur-md text-emerald-50 text-sm font-medium rounded-xl border border-emerald-800/20 overflow-hidden hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(5,150,105,0.2)] transition-all duration-300"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
              New Story
            </span>
          </Link>
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 backdrop-blur-md text-rose-800 border border-rose-200 rounded-2xl p-5 text-sm shadow-sm">
          {error}
        </div>
      )}

      {!stats && !error ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 animate-pulse">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-white/40 rounded-3xl border border-stone-200/60"></div>
          ))}
        </div>
      ) : stats ? (
        <>
          {/* Overview Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatCard label="Stories" value={stats.articles} subValue={`${stats.publishedArticles} Published`} delay="0ms" />
            <StatCard label="Initiatives" value={stats.initiatives} subValue={`${stats.publishedInitiatives} Active`} delay="100ms" />
            <StatCard label="Enquiries" value={stats.enquiries} subValue="All Time" delay="200ms" />
            <StatCard label="Platform Status" value={"Online"} subValue="Systems Nominal" delay="300ms" isStatus />
          </div>

          <div className="grid md:grid-cols-3 gap-8 pt-4">
            {/* Recent Activity */}
            <div className="md:col-span-2 space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300 fill-mode-both">
              <h2 className="text-xl font-serif italic text-stone-800">Recent Activity</h2>
              <div className="bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[4px_12px_40px_rgba(0,0,0,0.03)] overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <ul className="divide-y divide-stone-200/50 relative z-10">
                  {recentActivity.length === 0 ? (
                    <li className="p-10 text-sm text-stone-500 text-center font-light">No recent activity found.</li>
                  ) : (
                    recentActivity.map((activity, i) => (
                      <li key={`${activity.type}-${activity.id}`} className="p-6 hover:bg-white/80 transition-colors flex items-center justify-between group/item">
                        <div className="flex items-center gap-4">
                          <div className={`w-2 h-2 rounded-full ${activity.type === 'Enquiry' ? 'bg-orange-400' : activity.type === 'Initiative' ? 'bg-sky-400' : 'bg-emerald-400'} shadow-[0_0_8px_currentColor] opacity-70 group-hover/item:opacity-100 transition-opacity`}></div>
                          <div className="flex flex-col">
                            <span className="font-medium text-stone-900 transition-colors">{activity.title}</span>
                            <span className="text-xs text-stone-500 mt-1 font-light tracking-wide uppercase">
                              {activity.type} <span className="mx-2 opacity-30">•</span> {activity.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                            </span>
                          </div>
                        </div>
                        <StatusBadge status={activity.status} />
                      </li>
                    ))
                  )}
                </ul>
              </div>
            </div>

            {/* Quick Links / Charts Placeholder */}
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500 fill-mode-both">
              <h2 className="text-xl font-serif italic text-stone-800">Quick Actions</h2>
              <div className="bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[4px_12px_40px_rgba(0,0,0,0.03)] p-3 space-y-2 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-100/40 rounded-full blur-[40px] pointer-events-none group-hover:bg-orange-100/60 transition-colors duration-700"></div>
                
                <QuickLink href="/admin/submissions" title="Review Enquiries" icon="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                <QuickLink href="/admin/initiatives" title="Manage Initiatives" icon="M13 10V3L4 14h7v7l9-11h-7z" />
                <QuickLink href="/admin/blog" title="Manage Stories" icon="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15" />
              </div>

              {/* Mini Chart visualization */}
              <div className="bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[4px_12px_40px_rgba(0,0,0,0.03)] p-6 relative overflow-hidden">
                <h3 className="text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-6">Engagement Overview</h3>
                <div className="h-32 flex items-end justify-between gap-2 px-2">
                  {[40, 70, 45, 90, 65, 85, 120].map((val, i) => (
                    <div key={i} className="w-full bg-stone-200/50 rounded-t-sm hover:bg-emerald-200 transition-colors relative group/bar cursor-pointer" style={{ height: `${(val/120)*100}%` }}>
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-stone-800 text-[10px] text-white px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none shadow-md">
                        {val} views
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function StatCard({ label, value, subValue, delay, isStatus = false }: { label: string, value: string | number, subValue: string, delay: string, isStatus?: boolean }) {
  return (
    <div 
      className="group relative bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl p-6 md:p-8 shadow-[4px_12px_40px_rgba(0,0,0,0.02)] hover:border-emerald-100 hover:-translate-y-1 hover:shadow-[4px_16px_40px_rgba(5,150,105,0.05)] transition-all duration-500 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
      style={{ animationDelay: delay }}
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-stone-100/50 rounded-full blur-[40px] pointer-events-none group-hover:bg-emerald-50 transition-colors duration-700"></div>
      
      <p className="text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] relative z-10">{label}</p>
      
      <div className="mt-4 flex items-end gap-3 relative z-10">
        {isStatus ? (
          <p className="text-3xl font-serif italic text-emerald-600 tracking-tight flex items-center gap-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            {value}
          </p>
        ) : (
          <p className="text-5xl font-light text-stone-900 tracking-tighter">{value}</p>
        )}
      </div>
      
      <p className="text-xs text-stone-500 mt-4 font-light relative z-10 flex items-center gap-2">
        {!isStatus && <span className="w-1.5 h-1.5 rounded-full bg-stone-300"></span>}
        {subValue}
      </p>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const isPositive = status.toUpperCase() === "PUBLISHED" || status.toUpperCase() === "RESPONDED";
  
  return (
    <span className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full border backdrop-blur-md ${
      isPositive 
        ? 'bg-emerald-50 text-emerald-800 border-emerald-100/50 shadow-sm' 
        : 'bg-orange-50 text-orange-800 border-orange-100/50 shadow-sm'
    }`}>
      {status}
    </span>
  );
}

function QuickLink({ href, title, icon }: { href: string, title: string, icon: string }) {
  return (
    <Link href={href} className="group/link flex items-center justify-between p-4 rounded-2xl border border-transparent hover:border-stone-200/60 hover:bg-white/80 transition-all relative z-10">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-stone-100 flex items-center justify-center border border-stone-200/50 group-hover/link:border-stone-300/50 group-hover/link:text-emerald-700 text-stone-500 transition-colors shadow-sm">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={icon}></path></svg>
        </div>
        <span className="text-sm font-medium text-stone-700 group-hover/link:text-stone-900 transition-colors">{title}</span>
      </div>
      <span className="text-stone-400 group-hover/link:text-emerald-600 group-hover/link:translate-x-1 transition-all">→</span>
    </Link>
  );
}
