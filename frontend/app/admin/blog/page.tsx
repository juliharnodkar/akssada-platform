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
  initiativeId?: string;
}

export default function AdminBlog() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  // Minimal form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", authorName: "", category: "", coverImageUrl: "", published: false, initiativeId: null as string | null
  });
  const [uploading, setUploading] = useState(false);

  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    adminFetch("/api/admin/blog")
      .then(async r => {
        if (!r.ok) {
          const errText = await r.text();
          throw new Error(`API Error (${r.status}): ${errText}`);
        }
        return r.json();
      })
      .then(data => {
        if (mounted) {
          setArticles(Array.isArray(data) ? data : []);
          setError(null);
        }
      })
      .catch(err => {
        if (mounted) {
          console.error("Failed to fetch articles:", err);
          setError(err.message || "Failed to load articles");
          setArticles([]);
        }
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
      published: !!article.published,
      initiativeId: article.initiativeId || null
    });
  };

  const handleNew = () => {
    setEditingId("new");
    setFormData({ title: "", slug: "", content: "", authorName: "", category: "", coverImageUrl: "", published: false, initiativeId: null });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const url = editingId === "new" ? "/api/admin/blog" : `/api/admin/blog/${editingId}`;
    const method = editingId === "new" ? "POST" : "PUT";
    
    try {
      const res = await adminFetch(url, {
        method,
        body: JSON.stringify({
          ...formData,
          additionalImageUrls: [], // minimal implementation, could add a gallery later
          initiativeId: formData.initiativeId, // preserve existing link
        })
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Save failed (${res.status}): ${errText}`);
      }

      setEditingId(null);
      setLoading(true);
      
      const fetchRes = await adminFetch("/api/admin/blog");
      if (!fetchRes.ok) throw new Error(`Fetch failed after save (${fetchRes.status})`);
      const data = await fetchRes.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred while saving.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    setError(null);
    try {
      const res = await adminFetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Delete failed (${res.status}): ${errText}`);
      }
      setLoading(true);
      const fetchRes = await adminFetch("/api/admin/blog");
      if (!fetchRes.ok) throw new Error(`Fetch failed after delete (${fetchRes.status})`);
      const data = await fetchRes.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "An error occurred while deleting.");
    } finally {
      setLoading(false);
    }
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

  if (loading) return (
    <div className="animate-pulse space-y-4">
      {[1,2,3,4].map(i => (
        <div key={i} className="h-20 bg-white/40 rounded-3xl border border-stone-200/60"></div>
      ))}
    </div>
  );

  if (editingId) {
    return (
      <div className="max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h2 className="text-3xl font-serif italic text-stone-900 mb-8 tracking-wide">{editingId === "new" ? "New Story" : "Edit Story"}</h2>
        
        <form onSubmit={handleSave} className="bg-white/60 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-stone-200/60 shadow-[4px_12px_40px_rgba(0,0,0,0.03)] relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100/40 rounded-full blur-[60px] pointer-events-none group-hover:bg-orange-100/60 transition-colors duration-700"></div>
          
          <div className="relative z-10 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Title</label>
                <input required type="text" className="w-full bg-white/80 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-light shadow-sm" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Slug</label>
                <input required type="text" className="w-full bg-white/80 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-light shadow-sm" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Author</label>
                <input type="text" className="w-full bg-white/80 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-light shadow-sm" value={formData.authorName} onChange={e => setFormData({...formData, authorName: e.target.value})} />
              </div>
              <div>
                <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Category</label>
                <input type="text" className="w-full bg-white/80 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-light shadow-sm" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
              </div>
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Content (Markdown/HTML)</label>
              <textarea required className="w-full bg-white/80 border border-stone-200 rounded-xl px-5 py-4 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all h-64 resize-y font-light leading-relaxed shadow-sm" value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} />
            </div>
            
            <div>
              <label className="block text-[10px] font-medium text-stone-500 uppercase tracking-[0.2em] mb-2">Cover Image URL</label>
              <div className="flex gap-4">
                <input type="text" className="flex-1 bg-white/80 border border-stone-200 rounded-xl px-5 py-3.5 text-stone-900 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-light shadow-sm" value={formData.coverImageUrl} onChange={e => setFormData({...formData, coverImageUrl: e.target.value})} />
                <div className="relative shrink-0 flex">
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  <button type="button" className="px-6 py-3.5 bg-stone-100 border border-stone-200 rounded-xl text-stone-600 font-medium hover:bg-stone-200 transition-colors uppercase tracking-[0.2em] text-[10px] shadow-sm">
                    {uploading ? "Uploading..." : "Upload Image"}
                  </button>
                </div>
              </div>
              {formData.coverImageUrl && (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={formData.coverImageUrl} alt="Cover" className="mt-6 h-32 w-auto object-cover rounded-xl border border-stone-200/50 shadow-md" />
              )}
            </div>
            
            <div className="flex items-center gap-4 py-4 px-5 bg-stone-50/80 border border-stone-200/60 rounded-xl shadow-sm">
              <input type="checkbox" id="pub" className="w-5 h-5 accent-emerald-600 bg-white border-stone-300 rounded cursor-pointer transition-colors" checked={formData.published} onChange={e => setFormData({...formData, published: e.target.checked})} />
              <label htmlFor="pub" className="text-sm font-medium text-stone-700 cursor-pointer select-none">Publish to public site</label>
            </div>
            
            <div className="flex gap-4 pt-4 border-t border-stone-200/60">
              <button type="submit" className="px-8 py-3.5 bg-emerald-700/90 hover:bg-emerald-600 text-emerald-50 rounded-xl font-medium transition-all shadow-[0_4px_15px_rgba(5,150,105,0.2)] hover:shadow-[0_8px_25px_rgba(5,150,105,0.3)]">
                Save Story
              </button>
              <button type="button" onClick={handleCancel} className="px-8 py-3.5 bg-stone-100 border border-stone-200 text-stone-600 rounded-xl font-medium hover:bg-stone-200 transition-colors shadow-sm">
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200/60 pb-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-4xl font-serif italic text-stone-900 tracking-wide">Stories</h1>
          <p className="text-stone-500 font-light">Manage blog articles and stories.</p>
        </div>
        <button onClick={handleNew} className="group relative px-6 py-3 bg-emerald-700/90 backdrop-blur-md text-emerald-50 text-sm font-medium rounded-xl border border-emerald-800/20 overflow-hidden hover:bg-emerald-600 hover:shadow-[0_8px_20px_rgba(5,150,105,0.2)] transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-emerald-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <span className="relative z-10 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path></svg>
            New Story
          </span>
        </button>
      </header>
      
      <div className="bg-white/60 backdrop-blur-xl border border-stone-200/60 rounded-3xl shadow-[4px_12px_40px_rgba(0,0,0,0.03)] overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700 relative">
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent pointer-events-none"></div>
        {error && (
          <div className="bg-rose-50 backdrop-blur-md text-rose-800 border-b border-rose-200 px-8 py-4 text-sm relative z-10 shadow-sm">
            {error}
          </div>
        )}
        <div className="overflow-x-auto relative z-10">
          <table className="w-full text-sm text-left text-stone-600">
            <thead className="text-[10px] text-stone-500 uppercase tracking-[0.2em] bg-stone-50/50 border-b border-stone-200/60">
              <tr>
                <th className="px-8 py-5 font-medium">Title</th>
                <th className="px-8 py-5 font-medium">Category</th>
                <th className="px-8 py-5 font-medium">Status</th>
                <th className="px-8 py-5 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200/50">
              {articles.map((a: Article) => (
                <tr key={a.id} className="hover:bg-white/80 transition-colors group">
                  <td className="px-8 py-5 font-medium text-stone-900 transition-colors">{a.title}</td>
                  <td className="px-8 py-5 text-stone-600">{a.category || "—"}</td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-full text-[10px] font-medium uppercase tracking-[0.2em] border backdrop-blur-md shadow-sm ${a.published ? 'bg-emerald-50 text-emerald-800 border-emerald-100/50' : 'bg-orange-50 text-orange-800 border-orange-100/50'}`}>
                      {a.published ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right space-x-4">
                    <button onClick={() => handleEdit(a)} className="text-sky-700/80 hover:text-sky-900 font-medium transition-colors uppercase tracking-[0.2em] text-[10px]">Edit</button>
                    <button onClick={() => handleDelete(a.id)} className="text-rose-600/80 hover:text-rose-700 font-medium transition-colors uppercase tracking-[0.2em] text-[10px]">Delete</button>
                  </td>
                </tr>
              ))}
              {!error && articles.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-8 py-16 text-center text-stone-500 font-light">No stories found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
