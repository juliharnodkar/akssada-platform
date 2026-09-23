import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AKSSADA | Sustainable Community Development",
  description:
    "AKSSADA is a Section 8 non-profit working with the Siddi community and other forest-dwelling communities in Karnataka on sustainable livelihoods, education, cultural heritage, and environmental protection.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">{children}</body>
    </html>
  );
}
