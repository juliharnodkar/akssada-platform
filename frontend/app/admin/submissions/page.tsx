"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

interface ContactSubmission { id: string; name: string; email: string; subject: string; submittedAt: string; }
interface VolunteerApplication { id: string; name: string; email: string; location: string; submittedAt: string; }
interface PartnershipInquiry { id: string; organizationName: string; contactName: string; email: string; partnershipType: string; submittedAt: string; }

export default function AdminSubmissions() {
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [volunteers, setVolunteers] = useState<VolunteerApplication[]>([]);
  const [partners, setPartners] = useState<PartnershipInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminFetch("/api/admin/submissions/contact"),
      adminFetch("/api/admin/submissions/volunteer"),
      adminFetch("/api/admin/submissions/partnership"),
    ])
      .then(async ([c, v, p]) => {
        setContacts(await c.json());
        setVolunteers(await v.json());
        setPartners(await p.json());
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-gray-400">Loading submissions...</div>;

  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xl font-bold text-white mb-4">Contact Submissions</h2>
        <div className="bg-[#16213e] rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Subject</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((c: ContactSubmission) => (
                <tr key={c.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">{new Date(c.submittedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-white">{c.name}</td>
                  <td className="px-4 py-3">{c.email}</td>
                  <td className="px-4 py-3">{c.subject}</td>
                </tr>
              ))}
              {contacts.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Volunteer Applications</h2>
        <div className="bg-[#16213e] rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Location</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map((v: VolunteerApplication) => (
                <tr key={v.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">{new Date(v.submittedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-white">{v.name}</td>
                  <td className="px-4 py-3">{v.email}</td>
                  <td className="px-4 py-3">{v.location}</td>
                </tr>
              ))}
              {volunteers.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No applications found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold text-white mb-4">Partnership Inquiries</h2>
        <div className="bg-[#16213e] rounded-xl overflow-hidden border border-white/10">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Organization</th>
                <th className="px-4 py-3">Contact</th>
                <th className="px-4 py-3">Type</th>
              </tr>
            </thead>
            <tbody>
              {partners.map((p: PartnershipInquiry) => (
                <tr key={p.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="px-4 py-3">{new Date(p.submittedAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 font-medium text-white">{p.organizationName}</td>
                  <td className="px-4 py-3">{p.contactName} ({p.email})</td>
                  <td className="px-4 py-3">{p.partnershipType}</td>
                </tr>
              ))}
              {partners.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No inquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
