"use client";

import { useEffect, useState } from "react";
import { adminFetch } from "@/lib/api";

interface Initiative {
  id: string;
  title: string;
  slug: string;
  focusArea: string;
  summary: string;
  content: string;
  coverImageUrl: string;
  published: boolean;
}

export default function AdminInitiatives() {
  const [initiatives, setInitiatives] = useState<Initiative[]>([]);
  const [loading, setLoading] = useState(true);

  // Minimal form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", slug: "", focusArea: "", summary: "", content: "", coverImageUrl: "", published: false
  });

  useEffect(() => {
    let mounted = true;
    adminFetch("/api/admin/initiatives")
      .then(r => r.json())
      .then(data => {
        if (mounted) setInitiatives(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleEdit = (initiative: Initiative) => {
    setEditingId(initiative.id);
    setFormData(initiative);
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({ title: "", slug: "", focusArea: "", summary: "", content: "", coverImageUrl: "", published: false });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId === "new" ? "/api/admin/initiatives" : `/api/admin/initiatives/${editingId}`;
    const method = editingId === "new" ? "POST" : "PUT";
    
    await adminFetch(url, {
      method,
      body: JSON.stringify(formData)
    });
    setEditingId(null);
    // Reload simply
    setLoading(true);
    adminFetch("/api/admin/initiatives")
      .then(r => r.json())
      .then(data => setInitiatives(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await adminFetch(`/api/admin/initiatives/${id}`, { method: "DELETE" });
    setLoading(true);
    adminFetch("/api/admin/initiatives")
      .then(r => r.json())
      .then(data => setInitiatives(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  if (loading) return <div className="text-gray-400">Loading initiatives...</div>;

  if (editingId) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">{editingId === "new" ? "New Initiative" : "Edit Initiative"}</h2>
        <form onSubmit={handleSave} className="bg-[#16213e] p-6 rounded-xl border border-white/10 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Title</label>
              <input required type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Slug</label>
              <input required type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Focus Area</label>
            <input required type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.focusArea} onChange={e => setFormData({...formData, focusArea: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Summary</label>
            <textarea required className="w-full bg-[#0f3460] rounded px-3 py-2 text-white h-20" value={formData.summary} onChange={e => setFormData({...formData, summary: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Content (Markdown/HTML)</label>
            <textarea required className="w-full bg-[#0f3460] rounded px-3 py-2 text-white h-40" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Cover Image URL</label>
            <input type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.coverImageUrl || ""} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="pub" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
            <label htmlFor="pub" className="text-white">Published</label>
          </div>
          <div className="flex gap-4 pt-4">
            <button type="submit" className="bg-indigo-600 px-4 py-2 rounded text-white font-medium hover:bg-indigo-500">Save</button>
            <button type="button" onClick={handleCancel} className="bg-gray-700 px-4 py-2 rounded text-white font-medium hover:bg-gray-600">Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Initiatives</h2>
        <button onClick={handleNew} className="bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-indigo-500">
          + New Initiative
        </button>
      </div>
      
      <div className="bg-[#16213e] rounded-xl overflow-hidden border border-white/10">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Focus Area</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {initiatives.map((i: Initiative) => (
              <tr key={i.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{i.title}</td>
                <td className="px-4 py-3">{i.focusArea}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${i.published ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {i.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEdit(i)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={() => handleDelete(i.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {initiatives.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No initiatives found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
