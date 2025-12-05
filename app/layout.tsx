import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ghosted - Which Companies Ghost Job Applicants",
  description: "See which companies ghost job applicants. Anonymous community reports expose the worst ghosters. Track your own applications and hold companies accountable.",
  keywords: ["job search", "ghosting", "job applications", "career", "hiring", "recruiter", "glassdoor", "company reviews", "interview ghosting"],
  openGraph: {
    title: "Ghosted - Which Companies Ghost Job Applicants",
    description: "Community-sourced data on which companies ghost job applicants. 5,000+ reports. See the Wall of Shame.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ghosted - Which Companies Ghost Job Applicants",
    description: "Community-sourced data on which companies ghost job applicants. 5,000+ reports. See the Wall of Shame.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
