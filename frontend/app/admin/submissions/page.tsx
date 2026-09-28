"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

type EnquiryType = "Contact" | "Volunteer" | "Partnership";

interface Enquiry {
  id: string;
  type: EnquiryType;
  name: string;
  email: string;
  phone?: string;
  subjectOrType: string;
  message: string;
  date: Date;
  status: string;
  raw: Record<string, unknown>;
}

export default function AdminSubmissions() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewing, setViewing] = useState<Enquiry | null>(null);

  const fetchAll = () => {
    Promise.all([
      adminFetch("/api/admin/submissions/contact"),
      adminFetch("/api/admin/submissions/volunteer"),
      adminFetch("/api/admin/submissions/partnership"),
    ])
      .then(async ([c, v, p]) => {
        if (!c.ok || !v.ok || !p.ok) throw new Error("Failed to fetch submissions");
        const contacts = await c.json();
        const volunteers = await v.json();
        const partners = await p.json();

        const all: Enquiry[] = [
          ...contacts.map((x: Record<string, unknown>) => ({
            id: x.id, type: "Contact" as const, name: x.name, email: x.email, phone: x.phone, subjectOrType: x.subject, message: x.message, date: new Date(x.submittedAt as string), status: x.status || "NEW", raw: x
          })),
          ...volunteers.map((x: Record<string, unknown>) => ({
            id: x.id, type: "Volunteer" as const, name: x.name, email: x.email, phone: x.phone, subjectOrType: "Volunteer", message: x.message, date: new Date(x.submittedAt as string), status: x.status || "NEW", raw: x
          })),
          ...partners.map((x: Record<string, unknown>) => ({
            id: x.id, type: "Partnership" as const, name: x.contactName, email: x.email, phone: x.phone, subjectOrType: x.partnershipType, message: x.message, date: new Date(x.submittedAt as string), status: x.status || "NEW", raw: x
          }))
        ];
        
        all.sort((a, b) => b.date.getTime() - a.date.getTime());
        setEnquiries(all);
        setError(null);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load enquiries.");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleStatusChange = async (enquiry: Enquiry, newStatus: string) => {
    try {
      const endpoint = `/api/admin/submissions/${enquiry.type.toLowerCase()}/${enquiry.id}/status`;
      const res = await adminFetch(endpoint, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus })
      });
      if (!res.ok) throw new Error("Failed to update status");
      
      setEnquiries(prev => prev.map(e => e.id === enquiry.id ? { ...e, status: newStatus } : e));
      if (viewing?.id === enquiry.id) setViewing({ ...viewing, status: newStatus });
    } catch {
      alert("Error updating status.");
    }
  };

  const handleDelete = async (enquiry: Enquiry) => {
    if (!confirm("Are you sure you want to delete this enquiry permanently?")) return;
    try {
      const endpoint = `/api/admin/submissions/${enquiry.type.toLowerCase()}/${enquiry.id}`;
      const res = await adminFetch(endpoint, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setEnquiries(prev => prev.filter(e => e.id !== enquiry.id));
      if (viewing?.id === enquiry.id) setViewing(null);
    } catch {
      alert("Error deleting enquiry.");
    }
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-stone-900 tracking-wide">Enquiries</h1>
          <p className="text-stone-500 font-light">Manage incoming contacts, volunteers, and partnership requests.</p>
        </div>
      </header>

      {error && (
        <div className="bg-rose-50 backdrop-blur-md text-rose-800 border border-rose-200 rounded-2xl p-5 text-sm shadow-sm">
          {error}
        </div>
      )}

      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-20 bg-white/40 rounded-3xl border border-stone-200/60"></div>
          ))}
        </div>
      ) : (
        <div className="bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[4px_12px_40px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-stone-600">
              <thead className="text-[10px] text-stone-500 uppercase tracking-[0.2em] bg-stone-50/50 border-b border-stone-200/60">
                <tr>
                  <th className="px-8 py-5 font-medium">Date</th>
                  <th className="px-8 py-5 font-medium">Sender</th>
                  <th className="px-8 py-5 font-medium">Subject / Type</th>
                  <th className="px-8 py-5 font-medium">Status</th>
                  <th className="px-8 py-5 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/50">
                {enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-white/80 transition-colors group">
                    <td className="px-8 py-5 whitespace-nowrap font-light text-stone-600">
                      {e.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-8 py-5">
                      <div className="font-medium text-stone-900 transition-colors">{e.name}</div>
                      <div className="text-xs text-stone-500 font-light mt-1">{e.email}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="text-stone-800 transition-colors">{e.subjectOrType}</div>
                      <div className="text-[10px] text-stone-500 font-medium uppercase tracking-widest mt-1">{e.type}</div>
                    </td>
                    <td className="px-8 py-5">
                      <StatusBadge status={e.status} />
                    </td>
                    <td className="px-8 py-5 text-right space-x-4">
                      <button onClick={() => setViewing(e)} className="text-emerald-700/80 hover:text-emerald-900 font-medium transition-colors uppercase tracking-[0.2em] text-[10px]">View</button>
                    </td>
                  </tr>
                ))}
                {enquiries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center text-stone-500 font-light">No enquiries found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/40 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white/95 backdrop-blur-xl border border-stone-200/60 shadow-2xl rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col relative animate-in zoom-in-95 duration-300">
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-[60px] pointer-events-none"></div>
            
            <div className="px-8 py-6 border-b border-stone-200/60 flex justify-between items-center relative z-10">
              <div>
                <h3 className="text-2xl font-serif italic text-stone-900">{viewing.type} Enquiry</h3>
                <p className="text-[10px] text-stone-500 font-medium uppercase tracking-[0.2em] mt-1">Received {viewing.date.toLocaleString()}</p>
              </div>
              <button onClick={() => setViewing(null)} className="text-stone-400 hover:text-stone-900 p-2 transition-colors rounded-full hover:bg-stone-100/80">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto flex-1 space-y-8 text-sm text-stone-700 relative z-10">
              <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Name</span>
                  <span className="font-medium text-stone-900 text-base">{viewing.name}</span>
                </div>
                <div>
                  <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Email</span>
                  <a href={`mailto:${viewing.email}`} className="text-emerald-700 hover:text-emerald-800 hover:underline transition-colors">{viewing.email}</a>
                </div>
                {viewing.phone && (
                  <div>
                    <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Phone</span>
                    <span>{viewing.phone}</span>
                  </div>
                )}
                
                <div className="col-span-2">
                  <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Subject / Type</span>
                  <span className="font-medium text-stone-900">{viewing.subjectOrType}</span>
                </div>
                
                {/* Specific fields based on type */}
                {viewing.type === "Partnership" && typeof viewing.raw.organizationName === "string" && (
                  <div className="col-span-2">
                    <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Organization Name</span>
                    <span className="text-stone-900">{viewing.raw.organizationName}</span>
                  </div>
                )}
                {viewing.type === "Volunteer" && (
                  <>
                    <div className="col-span-2">
                      <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Location</span>
                      <span className="text-stone-900">{typeof viewing.raw.location === "string" ? viewing.raw.location : ""}</span>
                    </div>
                    {typeof viewing.raw.skills === "string" && (
                      <div className="col-span-2">
                        <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-1.5">Skills</span>
                        <span className="text-stone-900">{viewing.raw.skills}</span>
                      </div>
                    )}
                  </>
                )}
              </div>
              
              <div className="pt-6 border-t border-stone-200/60">
                <span className="block text-[10px] font-medium text-stone-400 uppercase tracking-[0.2em] mb-3">Message</span>
                <div className="p-6 bg-stone-50/80 rounded-2xl whitespace-pre-wrap leading-relaxed border border-stone-200/50 text-stone-800 font-light shadow-sm">
                  {viewing.message || "No message provided."}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 bg-stone-50/90 border-t border-stone-200/60 flex flex-wrap gap-4 items-center justify-between relative z-10">
              <div className="flex gap-2">
                <span className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mr-2 flex items-center">Status:</span>
                <button onClick={() => handleStatusChange(viewing, "NEW")} className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${viewing.status === 'NEW' ? 'bg-orange-100/50 text-orange-800 border border-orange-200' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 shadow-sm'}`}>New</button>
                <button onClick={() => handleStatusChange(viewing, "READ")} className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${viewing.status === 'READ' ? 'bg-sky-100/50 text-sky-800 border border-sky-200' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 shadow-sm'}`}>Read</button>
                <button onClick={() => handleStatusChange(viewing, "RESPONDED")} className={`px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] rounded-xl transition-all duration-300 ${viewing.status === 'RESPONDED' ? 'bg-emerald-100/50 text-emerald-800 border border-emerald-200' : 'bg-white text-stone-500 border border-stone-200 hover:bg-stone-50 shadow-sm'}`}>Responded</button>
              </div>
              <button onClick={() => handleDelete(viewing)} className="px-4 py-2 text-[10px] font-medium uppercase tracking-[0.2em] text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-all duration-300 border border-transparent hover:border-rose-100">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  let bg = "bg-stone-100/50";
  let text = "text-stone-600";
  let border = "border-stone-200/60";
  
  if (status === "RESPONDED") {
    bg = "bg-emerald-50";
    text = "text-emerald-800";
    border = "border-emerald-200";
  } else if (status === "READ") {
    bg = "bg-sky-50";
    text = "text-sky-800";
    border = "border-sky-200";
  } else if (status === "NEW") {
    bg = "bg-orange-50";
    text = "text-orange-800";
    border = "border-orange-200";
  }

  return (
    <span className={`px-3 py-1.5 text-[10px] font-medium uppercase tracking-[0.2em] rounded-full border backdrop-blur-md shadow-sm ${bg} ${text} ${border}`}>
      {status}
    </span>
  );
}
