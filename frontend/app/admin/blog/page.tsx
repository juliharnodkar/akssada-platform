"use client";

import { useEffect, useState } from "react";
import { adminFetch, getApiUrl } from "@/lib/api";

interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  authorName: string;
  category: string;
  coverImageUrl: string;
  published: boolean;
}

export default function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Minimal form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", authorName: "", category: "", coverImageUrl: "", published: false
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    let mounted = true;
    adminFetch("/api/admin/blog")
      .then(r => r.json())
      .then(data => {
        if (mounted) setArticles(Array.isArray(data) ? data : []);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const handleEdit = (article: Article) => {
    setEditingId(article.id);
    setFormData({
      title: article.title || "",
      slug: article.slug || "",
      content: article.content || "",
      authorName: article.authorName || "",
      category: article.category || "",
      coverImageUrl: article.coverImageUrl || "",
      published: !!article.published
    });
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({ title: "", slug: "", content: "", authorName: "", category: "", coverImageUrl: "", published: false });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId === "new" ? "/api/admin/blog" : `/api/admin/blog/${editingId}`;
    const method = editingId === "new" ? "POST" : "PUT";
    
    await adminFetch(url, {
      method,
      body: JSON.stringify({
        ...formData,
        additionalImageUrls: [], // minimal implementation, could add a gallery later
        initiativeId: null, // could link to initiative if needed
      })
    });
    setEditingId(null);
    setLoading(true);
    adminFetch("/api/admin/blog")
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    setLoading(true);
    adminFetch("/api/admin/blog")
      .then(r => r.json())
      .then(data => setArticles(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      const res = await fetch(`${getApiUrl()}/api/admin/media`, {
        method: "POST",
        credentials: "include",
        body: form,
      });
      if (res.ok) {
        const data = await res.json();
        setFormData(prev => ({ ...prev, coverImageUrl: data.url }));
      } else {
        alert("Upload failed.");
      }
    } catch {
      alert("Network error.");
    } finally {
      setUploading(false);
    }
  };

  if (loading) return <div className="text-gray-400">Loading articles...</div>;

  if (editingId) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white mb-6">{editingId === "new" ? "New Article" : "Edit Article"}</h2>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-300 mb-1">Author</label>
              <input type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm text-gray-300 mb-1">Category</label>
              <input type="text" className="w-full bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Content (Markdown/HTML)</label>
            <textarea required className="w-full bg-[#0f3460] rounded px-3 py-2 text-white h-40" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
          </div>
          <div>
            <label className="block text-sm text-gray-300 mb-1">Cover Image URL</label>
            <div className="flex gap-2">
              <input type="text" className="flex-1 bg-[#0f3460] rounded px-3 py-2 text-white" value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} />
              <div className="relative">
                <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                <button type="button" className="bg-gray-700 px-4 py-2 rounded text-white font-medium hover:bg-gray-600">
                  {uploading ? "Uploading..." : "Upload Image"}
                </button>
              </div>
            </div>
            {formData.coverImageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img src={formData.coverImageUrl} alt="Cover" className="mt-2 h-20 object-contain rounded border border-gray-700" />
            )}
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
        <h2 className="text-2xl font-bold text-white">Blog / Articles</h2>
        <button onClick={handleNew} className="bg-indigo-600 px-4 py-2 rounded-lg text-white font-medium hover:bg-indigo-500">
          + New Article
        </button>
      </div>
      
      <div className="bg-[#16213e] rounded-xl overflow-hidden border border-white/10">
        <table className="w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-white/5 border-b border-white/10">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a: Article) => (
              <tr key={a.id} className="border-b border-white/5 hover:bg-white/5">
                <td className="px-4 py-3 font-medium text-white">{a.title}</td>
                <td className="px-4 py-3">{a.category || "—"}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs ${a.published ? 'bg-green-900/50 text-green-400' : 'bg-yellow-900/50 text-yellow-400'}`}>
                    {a.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-3">
                  <button onClick={() => handleEdit(a)} className="text-indigo-400 hover:text-indigo-300">Edit</button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-400 hover:text-red-300">Delete</button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
