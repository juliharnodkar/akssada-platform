"use client";

import { useState } from "react";
import { PageIntro } from "@/components/ui/PageIntro";
import { getApiUrl } from "@/lib/api";

export default function VolunteerPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    interests: "",
    message: "",
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
      const res = await fetch(`${getApiUrl()}/api/volunteer`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          areasOfInterest: formData.interests,
          message: formData.message,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to submit application.");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", phone: "", location: "", interests: "", message: "" });
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main>
      <PageIntro
        title="Volunteer"
        description="Contribute your time and skills to AKSSADA's work with forest-dwelling communities in Karnataka."
      />
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="grid gap-16 md:grid-cols-2">
          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Volunteer Application</h2>
            {success ? (
              <div className="rounded-sm bg-cream-deep p-6 border border-line">
                <p className="text-terracotta font-medium">Application Received!</p>
                <p className="mt-2 text-[15px] text-ink-soft">Thank you for your interest in volunteering with AKSSADA. We will review your application and contact you soon.</p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-4 rounded-sm bg-ink px-4 py-2 text-sm text-cream transition-colors hover:bg-ink/90"
                >
                  Submit another application
                </button>
              </div>
            ) : (
              <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                {error && <p className="text-sm text-terracotta">{error}</p>}
                
                <div>
                  <label htmlFor="name" className="mb-2 block text-sm font-medium text-ink">Full Name</label>
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
                
                <div className="grid gap-5 sm:grid-cols-2">
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
                    <label htmlFor="phone" className="mb-2 block text-sm font-medium text-ink">Phone</label>
                    <input
                      type="text"
                      id="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                      placeholder="Phone Number"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="location" className="mb-2 block text-sm font-medium text-ink">Location</label>
                  <input
                    type="text"
                    id="location"
                    value={formData.location}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="City, State"
                  />
                </div>
                
                <div>
                  <label htmlFor="interests" className="mb-2 block text-sm font-medium text-ink">Area of Interest</label>
                  <select
                    id="interests"
                    value={formData.interests}
                    onChange={handleChange}
                    required
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                  >
                    <option value="">Select an area...</option>
                    <option value="Teaching & Education">Teaching & Education</option>
                    <option value="Field Work & Survey">Field Work & Survey</option>
                    <option value="Digital & Design">Digital & Design</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="mb-2 block text-sm font-medium text-ink">Tell us about yourself</label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full rounded-sm border border-line bg-cream p-3 text-[15px] focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
                    placeholder="Your background and why you want to volunteer..."
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 self-start rounded-sm bg-terracotta px-8 py-3 text-[15px] text-cream transition-colors hover:bg-terracotta-deep disabled:opacity-50"
                >
                  {loading ? "Submitting..." : "Submit Application"}
                </button>
              </form>
            )}
          </div>

          <div>
            <h2 className="mb-6 font-serif text-3xl text-ink">Why Volunteer?</h2>
            <div className="flex flex-col gap-6 text-[15px] leading-relaxed text-ink-soft">
              <p>
                Volunteers play a crucial role in bringing our programs to life. Whether you have specific technical skills or just a willingness to learn and help, there is an opportunity to make a difference.
              </p>
              <div className="border-l-2 border-terracotta pl-4">
                <h3 className="font-medium text-ink mb-1">On-Ground Roles</h3>
                <p>Assist with teaching in our rural centers, organizing community health camps, or collecting data for environmental surveys.</p>
              </div>
              <div className="border-l-2 border-terracotta pl-4">
                <h3 className="font-medium text-ink mb-1">Remote Roles</h3>
                <p>Help us with grant writing, social media management, translation services, or website development.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
