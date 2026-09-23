"use client";

import { useState } from "react";
import { PageIntro } from "@/components/ui/PageIntro";
import { getApiUrl } from "@/lib/api";

export default function PartnerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    orgName: "",
    contactName: "",
    email: "",
    type: "",
    details: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${getApiUrl()}/api/partnership`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          organizationName: formData.orgName,
          contactName: formData.contactName,
          email: formData.email,
          phone: "", // Optional in backend
          partnershipType: formData.type,
          message: formData.details,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit inquiry.");
      }

      setSuccess(true);
      setFormData({ orgName: "", contactName: "", email: "", type: "", details: "" });
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <PageIntro
        title="Partner With Us"
        description="Work with AKSSADA on sustainable community initiatives as an NGO, corporate CSR partner, or educational institution."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Partnership Inquiry</h2>
            {success ? (
              <div className="rounded-sm bg-cream-deep p-6 border border-line">
                <p className="text-terracotta font-medium">Inquiry Received!</p>
                <p className="mt-2 text-[15px] text-ink-soft">Thank you for your interest in partnering with AKSSADA. We will review your inquiry and get back to you soon.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-sm bg-ink px-4 py-2 text-sm text-cream transition-colors hover:bg-ink/90"
                >
                  Submit another inquiry
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {error && <p className="text-sm text-terracotta">{error}</p>}
                
                <div>
                  <label htmlFor="orgName" className="mb-2 block text-sm font-medium text-ink">Organization Name</label>
                  <input
                    type="text"
                    id="orgName"
                    value={formData.orgName}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Your Organization"
                  />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor="contactName" className="mb-2 block text-sm font-medium text-ink">Contact Name</label>
                    <input
                      type="text"
                      id="contactName"
                      value={formData.contactName}
                      onChange={handleChange}
                      required
                      className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-ink">Email</label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="type" className="mb-2 block text-sm font-medium text-ink">Partnership Type</label>
                  <select
                    id="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  >
                    <option value="">Select an option...</option>
                    <option value="Corporate CSR">Corporate CSR</option>
                    <option value="NGO / Non-Profit">NGO / Non-Profit</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Government Agency">Government Agency</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="details" className="mb-2 block text-sm font-medium text-ink">Proposed Collaboration</label>
                  <textarea
                    id="details"
                    value={formData.details}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Tell us how you'd like to work together..."
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 self-start rounded-sm bg-ink px-8 py-3 text-[15px] text-cream transition-colors hover:bg-ink/90 disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Inquiry"}
                </button>
              </form>
            )}
          </div>

          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Our Network</h2>
            <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Sustainable change requires collaboration. We work with various partners to scale our impact across the region while maintaining our community-first approach.
              </p>
              <div className="border border-line p-5 bg-cream">
                <h3 className="font-serif text-xl text-ink mb-2">Corporate CSR</h3>
                <p>Fulfill your social responsibility mandates by funding targeted interventions in education, health, and livelihood generation.</p>
              </div>
              <div className="border border-line p-5 bg-cream">
                <h3 className="font-serif text-xl text-ink mb-2">Academic Institutions</h3>
                <p>Collaborate on research, ethnographic studies, or student immersion programs to foster a deeper understanding of forest-dwelling communities.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
