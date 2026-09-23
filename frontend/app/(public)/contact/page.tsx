"use client";

import { useState } from "react";
import { PageIntro } from "@/components/ui/PageIntro";
import { getApiUrl } from "@/lib/api";

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      const res = await fetch(`${getApiUrl()}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Failed to submit message.");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", subject: "General Inquiry", message: "" });
    } catch (err) {
      setError("An error occurred while sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <PageIntro
        title="Contact AKSSADA"
        description="Have a question about AKSSADA's work? Reach out below."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Send a Message</h2>
            {success ? (
              <div className="rounded-sm bg-cream-deep p-6 border border-line">
                <p className="text-terracotta font-medium">Message Sent!</p>
                <p className="mt-2 text-[15px] text-ink-soft">Thank you for reaching out. We will get back to you shortly.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-sm bg-ink px-4 py-2 text-sm text-cream transition-colors hover:bg-ink/90"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {error && <p className="text-sm text-terracotta">{error}</p>}
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">Name</label>
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Your Name"
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
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">Message</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="How can we help you?"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 self-start rounded-sm bg-ink px-8 py-3 text-[15px] text-cream transition-colors hover:bg-ink/90 disabled:opacity-50"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>
            )}
          </div>

          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Contact Details</h2>
            <div className="flex flex-col gap-8 text-[15px] text-ink-soft">
              <div>
                <h3 className="mb-2 font-medium text-ink">Office Address</h3>
                <p className="leading-relaxed">
                  AKSSADA Headquarters<br />
                  Main Road, Haliyal<br />
                  Uttara Kannada District<br />
                  Karnataka, India 581329
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-medium text-ink">Email Address</h3>
                <p className="leading-relaxed">
                  contact@akssada.org<br />
                  <span className="text-sm italic">(Responses may take 2-3 business days)</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
